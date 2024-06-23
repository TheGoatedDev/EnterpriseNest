import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { Resource } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

export const otelSDK = new NodeSDK({
    resource: new Resource({
        [SEMRESATTRS_SERVICE_NAME]: process.env.APP_NAME ?? 'EnterpriseNest',
    }),

    instrumentations: [getNodeAutoInstrumentations()],
});
