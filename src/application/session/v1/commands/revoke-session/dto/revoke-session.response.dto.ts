import { ApiProperty } from '@nestjs/swagger';

import { Session } from '@/domain/session/session.entity';

export class V1RevokeSessionResponseDto {
    @ApiProperty({
        description: 'The Session that was Revoked',
        type: Session,
    })
    session!: Session;
}
