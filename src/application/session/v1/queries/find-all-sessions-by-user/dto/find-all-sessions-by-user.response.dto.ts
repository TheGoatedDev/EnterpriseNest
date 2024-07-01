import { ApiProperty } from '@nestjs/swagger';

import { Session } from '@/domain/session/session.entity';

export class V1FindAllSessionsByUserResponseDto {
    @ApiProperty({
        description: 'The Sessions that was Found',
        type: [Session],
    })
    sessions!: Session[];
}
