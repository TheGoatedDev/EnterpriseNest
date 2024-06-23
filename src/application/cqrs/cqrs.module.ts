import { Logger, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
    CommandBus,
    CqrsModule as BaseCqrsModule,
    EventBus,
    QueryBus,
} from '@nestjs/cqrs';
import { Subject, takeUntil } from 'rxjs';

@Module({
    imports: [BaseCqrsModule.forRoot()],
    exports: [BaseCqrsModule],
})
export class CqrsModule implements OnModuleDestroy, OnModuleInit {
    private destroy$ = new Subject<void>();

    private readonly eventLogger = new Logger('EventBus');
    private readonly commandLogger = new Logger('CommandBus');
    private readonly queryLogger = new Logger('QueryBus');

    constructor(
        private readonly eventBus: EventBus,
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    onModuleInit() {
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
}
