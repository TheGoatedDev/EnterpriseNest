import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Counter } from '@opentelemetry/api';
import { MetricService } from 'nestjs-otel';

import { OnRegisterEvent } from '@/domain/authentication/events/on-register.event';

@EventsHandler(OnRegisterEvent)
export class OnRegisterAddToCounterHandler
    implements IEventHandler<OnRegisterEvent>
{
    private readonly counter: Counter;
    constructor(private readonly metricService: MetricService) {
        this.counter = this.metricService.getCounter(
            'authentication.user.register',
            {
                description: 'Count of successful user registrations',
            },
        );
    }

    handle(event: OnRegisterEvent) {
        this.counter.add(1, {
            email: event.user.email,
        });
    }
}
