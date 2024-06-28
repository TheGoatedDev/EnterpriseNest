import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Counter } from '@opentelemetry/api';
import { MetricService } from 'nestjs-otel';

import { OnRegisterUserEvent } from '@/domain/authentication/events/on-register-user.event';

@EventsHandler(OnRegisterUserEvent)
export class OnRegisterUserAddToCounterHandler
    implements IEventHandler<OnRegisterUserEvent>
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

    handle(event: OnRegisterUserEvent) {
        this.counter.add(1, {
            email: event.user.email,
        });
    }
}
