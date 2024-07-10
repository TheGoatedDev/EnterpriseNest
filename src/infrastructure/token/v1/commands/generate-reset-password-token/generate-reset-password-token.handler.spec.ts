import { CommandBus, CqrsModule, EventBus, QueryBus } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateMockUser } from '@tests/utils/create-mocks';
import jwt from 'jsonwebtoken';

import { ResetPasswordTokenPayload } from '@/domain/token/reset-password-token-payload.type';
import { TokenConfigService } from '@/infrastructure/config/configs/token-config.service';
import { V1GenerateResetPasswordTokenCommand } from '@/infrastructure/token/v1/commands/generate-reset-password-token/generate-reset-password-token.command';
import { V1GenerateResetPasswordTokenCommandHandler } from '@/infrastructure/token/v1/commands/generate-reset-password-token/generate-reset-password-token.handler';

describe('v1GenerateResetPasswordTokenCommandHandler', () => {
    let queryBus: QueryBus;
    let commandBus: CommandBus;
    let eventBus: EventBus;

    let handler: V1GenerateResetPasswordTokenCommandHandler;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [CqrsModule, JwtModule.register({})],
            providers: [
                {
                    provide: TokenConfigService,
                    useValue: {
                        resetPasswordTokenSecret: 'test',
                        resetPasswordTokenExpiration: '1d',
                    },
                },
                V1GenerateResetPasswordTokenCommandHandler,
            ],
        }).compile();

        await module.init();

        queryBus = module.get<QueryBus>(QueryBus);
        commandBus = module.get<CommandBus>(CommandBus);
        eventBus = module.get<EventBus>(EventBus);

        jest.spyOn(eventBus, 'publish');

        handler = module.get<V1GenerateResetPasswordTokenCommandHandler>(
            V1GenerateResetPasswordTokenCommandHandler,
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
        const command = new V1GenerateResetPasswordTokenCommand(user);

        const result = await handler.execute(command);

        expect(result.resetPasswordToken).toBeDefined();
    });

    it('should be with the correct values', async () => {
        const user = CreateMockUser();
        const command = new V1GenerateResetPasswordTokenCommand(user);

        const result = await handler.execute(command);

        const decoded = jwt.decode(
            result.resetPasswordToken,
        ) as ResetPasswordTokenPayload;

        expect(decoded.type).toEqual('reset-password');
        expect(decoded.data.sub).toEqual(user.id);
    });

    it('should publish a event', async () => {
        const user = CreateMockUser();
        const command = new V1GenerateResetPasswordTokenCommand(user);

        await handler.execute(command);

        expect(eventBus.publish).toHaveBeenCalled();
    });
});
