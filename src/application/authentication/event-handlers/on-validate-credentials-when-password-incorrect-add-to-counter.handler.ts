import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Counter } from '@opentelemetry/api';
import { MetricService } from 'nestjs-otel';

import { OnValidateCredentialsEvent } from '@/domain/authentication/events/on-validate-credentials.event';

@EventsHandler(OnValidateCredentialsEvent)
export class OnValidateCredentialsWhenPasswordIncorrectAddToCounterHandler
    implements IEventHandler<OnValidateCredentialsEvent>
{
    private readonly incorrectPasswordCounter: Counter;
    private readonly totalAttemptsCounter: Counter;

    constructor(private readonly metricService: MetricService) {
        this.incorrectPasswordCounter = this.metricService.getCounter(
            'authentication.password.incorrect',
            {
                description: 'Count of incorrect password attempts',
            },
        );

        this.totalAttemptsCounter = this.metricService.getCounter(
            'authentication.attempts.total',
            {
                description: 'Count of total authentication attempts',
            },
        );
    }

    handle(event: OnValidateCredentialsEvent) {
        this.totalAttemptsCounter.add(1, {
            email: event.email,
        });

        if (!event.emailExists) {
            return;
        }

        if (!event.passwordMatches) {
            this.incorrectPasswordCounter.add(1, {
                email: event.email,
            });
        }
    }
}
