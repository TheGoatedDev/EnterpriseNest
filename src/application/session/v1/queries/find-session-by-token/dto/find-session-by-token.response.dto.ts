import { ApiProperty } from '@nestjs/swagger';

import { Session } from '@/domain/session/session.entity';

export class V1FindSessionByTokenResponseDto {
    @ApiProperty({
        description: 'The Session that was Found',
        type: Session,
    })
    session!: Session;
}
