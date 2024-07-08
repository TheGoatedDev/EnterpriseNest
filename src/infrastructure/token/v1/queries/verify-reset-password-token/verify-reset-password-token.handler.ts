import { Logger } from '@nestjs/common';
import { ICommandHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';

import { V1FindUserByIDQueryHandler } from '@/application/user/v1/queries/find-user-by-id/find-user-by-id.handler';
import { ResetPasswordTokenPayload } from '@/domain/token/reset-password-token-payload.type';
import { User } from '@/domain/user/user.entity';
import { TokenConfigService } from '@/infrastructure/config/configs/token-config.service';
import { GenericUnauthenticatedException } from '@/shared/exceptions/unauthenticated.exception';

import { V1VerifyResetPasswordTokenQuery } from './verify-reset-password-token.query';

interface V1VerifyResetPasswordTokenQueryHandlerResponse {
    user: User;
}

@QueryHandler(V1VerifyResetPasswordTokenQuery)
export class V1VerifyResetPasswordTokenQueryHandler
    implements
        ICommandHandler<
            V1VerifyResetPasswordTokenQuery,
            V1VerifyResetPasswordTokenQueryHandlerResponse
        >
{
    private readonly logger = new Logger(
        V1VerifyResetPasswordTokenQueryHandler.name,
    );

    constructor(
        private readonly jwtService: JwtService,
        private readonly queryBus: QueryBus,
        private readonly tokenConfigService: TokenConfigService,
    ) {}

    static runHandler(
        bus: QueryBus,
        command: V1VerifyResetPasswordTokenQuery,
    ): Promise<V1VerifyResetPasswordTokenQueryHandlerResponse> {
        return bus.execute<
            V1VerifyResetPasswordTokenQuery,
            V1VerifyResetPasswordTokenQueryHandlerResponse
        >(new V1VerifyResetPasswordTokenQuery(command.resetPasswordToken));
    }

    async execute(
        command: V1VerifyResetPasswordTokenQuery,
    ): Promise<V1VerifyResetPasswordTokenQueryHandlerResponse> {
        this.logger.log(
            `Verifying Reset Password Token for User ${command.resetPasswordToken}`,
        );

        const resetPasswordToken = await this.jwtService
            .verifyAsync<ResetPasswordTokenPayload>(
                command.resetPasswordToken,
                {
                    algorithms: ['HS512'],
                    secret: this.tokenConfigService.resetPasswordTokenSecret,
                },
            )
            .catch((error: unknown) => {
                if (error instanceof Error) {
                    this.logger.error(`Invalid Token: ${error.message}`);
                    throw new GenericUnauthenticatedException(
                        `Invalid Token: ${error.message}`,
                    );
                }

                throw new GenericUnauthenticatedException('Invalid Token');
            });

        if (resetPasswordToken.type !== 'reset-password') {
            this.logger.error('Invalid Token Type');
            throw new GenericUnauthenticatedException('Invalid Token Type');
        }

        const user = await V1FindUserByIDQueryHandler.runHandler(
            this.queryBus,
            {
                id: resetPasswordToken.data.sub,
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
