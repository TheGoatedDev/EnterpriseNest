import { ApiProperty } from '@nestjs/swagger';

import { Session } from '@/domain/session/session.entity';

export class V1FindCurrentSessionResponseDto {
    @ApiProperty({
        description: 'The Session that was Found',
        type: Session,
    })
    session!: Session;
}
