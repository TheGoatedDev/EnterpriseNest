import { Type } from '@nestjs/common';

export interface CqrsModuleType {
    publisher?: Type;
    subscriber?: Type;
}

export const EVENTS = Symbol('EVENTS');
export const PUBLISHER = Symbol('CQRS_Publisher');
export const SUBSCRIBER = Symbol('CQRS_Subscriber');
