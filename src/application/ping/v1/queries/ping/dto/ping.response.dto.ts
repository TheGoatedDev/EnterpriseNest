import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PingResponseDto {
    @ApiProperty({
        description: 'The message of the health check',
        example: 'OK',
    })
    @Expose()
    message!: string;

    @ApiProperty({
        description: 'The server time of the health check',
        example: new Date(),
    })
    @Expose()
    serverTime!: Date;

    @ApiProperty({
        description: 'The application name of the health check',
        example: 'EnterpriseNest',
    })
    @Expose()
    appName!: string;
}
