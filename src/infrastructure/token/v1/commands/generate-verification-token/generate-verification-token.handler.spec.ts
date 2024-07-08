import { CommandBus, CqrsModule, EventBus, QueryBus } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { MockRepositoriesModule } from '@/infrastructure/repositories/presets/mock-repositories.module';
import { HashingService } from '@/shared/services/hashing/hashing.service';

describe('v1GenerateVerificationTokenCommandHandler', () => {
    let queryBus: QueryBus;
    let commandBus: CommandBus;
    let eventBus: EventBus;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                CqrsModule,
                JwtModule.register({
                    secret: 'test',
                }),
                MockRepositoriesModule,
            ],
            providers: [HashingService],
        }).compile();

        await module.init();

        queryBus = module.get<QueryBus>(QueryBus);
        commandBus = module.get<CommandBus>(CommandBus);
        eventBus = module.get<EventBus>(EventBus);
    });

    it('should be defined', () => {
        expect(queryBus).toBeDefined();
        expect(commandBus).toBeDefined();
        expect(eventBus).toBeDefined();
    });
});
