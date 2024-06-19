import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { NodeSDK } from '@opentelemetry/sdk-node';

export const otelSDK = new NodeSDK({
    instrumentations: [getNodeAutoInstrumentations()],
});
