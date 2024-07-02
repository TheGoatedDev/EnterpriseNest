import type { Session } from '../session.entity';

export class OnSessionRevokedEvent {
    constructor(public readonly session: Session) {}
}
