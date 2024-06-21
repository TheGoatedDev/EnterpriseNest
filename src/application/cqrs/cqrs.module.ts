import {
    DynamicModule,
    Inject,
    Logger,
    Module,
    OnModuleDestroy,
    OnModuleInit,
    Type,
} from '@nestjs/common';
import {
    CommandBus,
    CqrsModule as BaseCqrsModule,
    EventBus,
    type IEventPublisher,
    type IMessageSource,
    QueryBus,
} from '@nestjs/cqrs';
import { Subject, takeUntil } from 'rxjs';

import { RedisPublisher } from '@/application/cqrs/adapters/redis/redis.publisher';
import { RedisSubscriber } from '@/application/cqrs/adapters/redis/redis.subscriber';
import {
    EVENTS,
    PUBLISHER,
    SUBSCRIBER,
} from '@/application/cqrs/cqrs.module-type';

@Module({})
export class CqrsModule implements OnModuleDestroy, OnModuleInit {
    private readonly logger = new Logger(CqrsModule.name);

    private destroy$ = new Subject<void>();

    private readonly eventLogger = new Logger('EventBus');
    private readonly commandLogger = new Logger('CommandBus');
    private readonly queryLogger = new Logger('QueryBus');

    constructor(
        private readonly eventBus: EventBus,
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        @Inject(PUBLISHER) private readonly publisher?: IEventPublisher,
        @Inject(SUBSCRIBER) private readonly subscriber?: IMessageSource,
    ) {
        this.eventBus.pipe(takeUntil(this.destroy$)).subscribe((event) => {
            this.eventLogger.log(
                `${event.constructor.name} - ${JSON.stringify(event)}`,
            );
        });

        this.commandBus.pipe(takeUntil(this.destroy$)).subscribe((command) => {
            this.commandLogger.log(
                `${command.constructor.name} - ${JSON.stringify(command)}`,
            );
        });

        this.queryBus.pipe(takeUntil(this.destroy$)).subscribe((query) => {
            this.queryLogger.log(
                `${query.constructor.name} - ${JSON.stringify(query)}`,
            );
        });
    }

    onModuleInit() {
        if (this.subscriber) {
            this.logger.log('Using custom subscriber for CQRS events');
            this.subscriber.bridgeEventsTo(this.eventBus.subject$);
        }

        if (this.publisher) {
            this.logger.log('Using custom publisher for CQRS events');
            this.eventBus.publisher = this.publisher;
        }
    }

    onModuleDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    static forRoot(events: Type[]): DynamicModule {
        return {
            module: CqrsModule,
            imports: [BaseCqrsModule.forRoot()],
            providers: [
                {
                    provide: PUBLISHER,
                    useClass: RedisPublisher,
                },
                {
                    provide: SUBSCRIBER,
                    useClass: RedisSubscriber,
                },
                {
                    provide: EVENTS,
                    useValue: events,
                },
            ],
            exports: [BaseCqrsModule],
        };
    }
}
