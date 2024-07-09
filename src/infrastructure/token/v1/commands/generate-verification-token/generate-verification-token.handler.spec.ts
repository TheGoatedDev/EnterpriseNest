import { CommandBus, CqrsModule, EventBus, QueryBus } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateMockUser } from '@tests/utils/create-mocks';
import jwt from 'jsonwebtoken';

import { VerificationTokenPayload } from '@/domain/token/verification-token-payload.type';
import { TokenConfigService } from '@/infrastructure/config/configs/token-config.service';
import { V1GenerateVerificationTokenCommand } from '@/infrastructure/token/v1/commands/generate-verification-token/generate-verification-token.command';
import { V1GenerateVerificationTokenCommandHandler } from '@/infrastructure/token/v1/commands/generate-verification-token/generate-verification-token.handler';

describe('v1GenerateVerificationTokenCommandHandler', () => {
    let queryBus: QueryBus;
    let commandBus: CommandBus;
    let eventBus: EventBus;

    let handler: V1GenerateVerificationTokenCommandHandler;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [CqrsModule, JwtModule.register({})],
            providers: [
                {
                    provide: TokenConfigService,
                    useValue: {
                        verificationTokenSecret: 'test',
                        verificationTokenExpiration: '1d',
                    },
                },
                V1GenerateVerificationTokenCommandHandler,
            ],
        }).compile();

        await module.init();

        queryBus = module.get<QueryBus>(QueryBus);
        commandBus = module.get<CommandBus>(CommandBus);
        eventBus = module.get<EventBus>(EventBus);

        jest.spyOn(eventBus, 'publish');

        handler = module.get<V1GenerateVerificationTokenCommandHandler>(
            V1GenerateVerificationTokenCommandHandler,
        );
    });

    it('should be defined', () => {
        expect(queryBus).toBeDefined();
        expect(commandBus).toBeDefined();
        expect(eventBus).toBeDefined();
        expect(handler).toBeDefined();
    });

    it('should generate a verification token', async () => {
        const user = CreateMockUser();
        const command = new V1GenerateVerificationTokenCommand(user);

        const result = await handler.execute(command);

        expect(result.verificationToken).toBeDefined();
    });

    it('should be with the correct values', async () => {
        const user = CreateMockUser();
        const command = new V1GenerateVerificationTokenCommand(user);

        const result = await handler.execute(command);

        const decoded = jwt.decode(
            result.verificationToken,
        ) as VerificationTokenPayload;

        expect(decoded.type).toEqual('verification');
        expect(decoded.data.sub).toEqual(user.id);
    });

    it('should publish a event', async () => {
        const user = CreateMockUser();
        const command = new V1GenerateVerificationTokenCommand(user);

        await handler.execute(command);

        expect(eventBus.publish).toHaveBeenCalled();
    });
});
