import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Counter } from '@opentelemetry/api';
import { MetricService } from 'nestjs-otel';

import { OnLoginEvent } from '@/domain/authentication/events/on-login.event';

@EventsHandler(OnLoginEvent)
export class OnLoginWhenSuccessAddToCounterHandler
    implements IEventHandler<OnLoginEvent>
{
    private readonly userLoginCounter: Counter;
    constructor(private readonly metricService: MetricService) {
        this.userLoginCounter = this.metricService.getCounter(
            'authentication.user.login',
            {
                description: 'Count of successful user logins',
            },
        );
    }

    handle(event: OnLoginEvent) {
        this.userLoginCounter.add(1, {
            email: event.user.email,
        });
    }
}
