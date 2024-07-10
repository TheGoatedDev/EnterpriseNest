import { Logger } from '@nestjs/common';
import { ICommandHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';

import { V1FindUserByIDQueryHandler } from '@/application/user/v1/queries/find-user-by-id/find-user-by-id.handler';
import { VerificationTokenPayload } from '@/domain/token/verification-token-payload.type';
import { User } from '@/domain/user/user.entity';
import { TokenConfigService } from '@/infrastructure/config/configs/token-config.service';
import { GenericUnauthenticatedException } from '@/shared/exceptions/unauthenticated.exception';

import { V1VerifyVerificationTokenQuery } from './verify-verification-token.query';

interface V1VerifyVerificationTokenQueryHandlerResponse {
    user: User;
}

@QueryHandler(V1VerifyVerificationTokenQuery)
export class V1VerifyVerificationTokenQueryHandler
    implements
        ICommandHandler<
            V1VerifyVerificationTokenQuery,
            V1VerifyVerificationTokenQueryHandlerResponse
        >
{
    private readonly logger = new Logger(
        V1VerifyVerificationTokenQueryHandler.name,
    );

    constructor(
        private readonly jwtService: JwtService,
        private readonly queryBus: QueryBus,
        private readonly tokenConfigService: TokenConfigService,
    ) {}

    static runHandler(
        bus: QueryBus,
        command: V1VerifyVerificationTokenQuery,
    ): Promise<V1VerifyVerificationTokenQueryHandlerResponse> {
        return bus.execute<
            V1VerifyVerificationTokenQuery,
            V1VerifyVerificationTokenQueryHandlerResponse
        >(new V1VerifyVerificationTokenQuery(command.verificationToken));
    }

    async execute(
        command: V1VerifyVerificationTokenQuery,
    ): Promise<V1VerifyVerificationTokenQueryHandlerResponse> {
        this.logger.log(
            `Verifying Verification Token for User ${command.verificationToken}`,
        );

        const verificationToken = await this.jwtService
            .verifyAsync<VerificationTokenPayload>(command.verificationToken, {
                algorithms: ['HS512'],
                secret: this.tokenConfigService.verificationTokenSecret,
            })
            .catch((error: unknown) => {
                if (error instanceof Error) {
                    this.logger.error(`Invalid Token: ${error.message}`);
                    throw new GenericUnauthenticatedException(
                        `Invalid Token: ${error.message}`,
                    );
                }

                throw new GenericUnauthenticatedException('Invalid Token');
            });

        if (verificationToken.type !== 'verification') {
            this.logger.error('Invalid Token Type');
            throw new GenericUnauthenticatedException('Invalid Token Type');
        }

        const user = await V1FindUserByIDQueryHandler.runHandler(
            this.queryBus,
            {
                id: verificationToken.data.sub,
            },
        );

        if (!user) {
            this.logger.error('User not found');
            throw new GenericUnauthenticatedException('User not found');
        }

        return Promise.resolve({
            user,
        });
    }
}
