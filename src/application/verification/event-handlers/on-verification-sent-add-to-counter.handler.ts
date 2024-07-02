import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Counter } from '@opentelemetry/api';
import { MetricService } from 'nestjs-otel';

import { OnVerificationSentEvent } from '@/domain/verification/events/on-verification-sent.event';

@EventsHandler(OnVerificationSentEvent)
export class OnVerificationSentAddToCounterHandler
    implements IEventHandler<OnVerificationSentEvent>
{
    private readonly counter: Counter;
    constructor(private readonly metricService: MetricService) {
        this.counter = this.metricService.getCounter(
            'verification.sent.total',
            {
                description: 'Count of verification emails sent to users',
            },
        );
    }

    handle(event: OnVerificationSentEvent) {
        this.counter.add(1, {
            email: event.user.email,
        });
    }
}
