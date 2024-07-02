import type { Session } from '../session.entity';

export class OnSessionDeletedEvent {
    constructor(public readonly session: Session) {}
}
