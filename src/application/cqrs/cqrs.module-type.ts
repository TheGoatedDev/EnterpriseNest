import { Type } from '@nestjs/common';
import { IEventPublisher, IMessageSource } from '@nestjs/cqrs';

export interface CqrsModuleType {
    events?: Type[];
    publisher?: IEventPublisher;
    subscriber?: IMessageSource;
}

export const EVENTS = Symbol('EVENTS');
export const PUBLISHER = Symbol('CQRS_Publisher');
export const SUBSCRIBER = Symbol('CQRS_Subscriber');
