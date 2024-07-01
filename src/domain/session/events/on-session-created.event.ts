import type { Session } from '../session.entity';

export class OnSessionCreatedEvent {
    constructor(public readonly session: Session) {}
}
