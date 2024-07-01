import { Session } from '@/domain/session/session.entity';

export class V1RevokeSessionCommand {
    constructor(public readonly session: Session) {}
}
