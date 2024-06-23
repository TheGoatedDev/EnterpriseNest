import {
    DynamicModule,
    Inject,
    Logger,
    OnModuleDestroy,
    OnModuleInit,
    Optional,
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

import {
    CqrsModuleType,
    EVENTS,
    PUBLISHER,
    SUBSCRIBER,
} from '@/application/cqrs/cqrs.module-type';

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

        @Inject(PUBLISHER)
        @Optional()
        private readonly publisher?: IEventPublisher,
        @Inject(SUBSCRIBER)
        @Optional()
        private readonly subscriber?: IMessageSource,
    ) {}

    onModuleInit() {
        if (this.subscriber) {
            this.logger.debug('Using custom subscriber for CQRS events');
            this.subscriber.bridgeEventsTo(this.eventBus.subject$);
        }

        if (this.publisher) {
            this.logger.debug('Using custom publisher for CQRS events');
            this.eventBus.publisher = this.publisher;
        }

        // Log all events, commands, and queries
        this.eventBus.pipe(takeUntil(this.destroy$)).subscribe((event) => {
            this.eventLogger.debug(
                `${event.constructor.name} - ${JSON.stringify(event)}`,
            );
        });

        this.commandBus.pipe(takeUntil(this.destroy$)).subscribe((command) => {
            this.commandLogger.debug(
                `${command.constructor.name} - ${JSON.stringify(command)}`,
            );
        });

        this.queryBus.pipe(takeUntil(this.destroy$)).subscribe((query) => {
            this.queryLogger.debug(
                `${query.constructor.name} - ${JSON.stringify(query)}`,
            );
        });
    }

    onModuleDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    static forRoot(
        events: Type[],
        options: CqrsModuleType = DefaultOptions,
    ): DynamicModule {
        return {
            global: true,
            module: CqrsModule,
            imports: [BaseCqrsModule.forRoot()],
            providers: [
                ...(options.publisher
                    ? [
                          {
                              provide: PUBLISHER,
                              useClass: options.publisher,
                          },
                      ]
                    : []),
                ...(options.subscriber
                    ? [
                          {
                              provide: SUBSCRIBER,
                              useClass: options.subscriber,
                          },
                      ]
                    : []),
                {
                    provide: EVENTS,
                    useValue: events,
                },
            ],
            exports: [BaseCqrsModule],
        };
    }
}

export const DefaultOptions: CqrsModuleType = {
    publisher: undefined,
    subscriber: undefined,
};
