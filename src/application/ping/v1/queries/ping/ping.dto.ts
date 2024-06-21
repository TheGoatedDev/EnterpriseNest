import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PingDto {
    @Expose()
    @ApiProperty({
        description: 'The message of the health check',
        example: 'OK',
    })
    message!: string;

    @Expose()
    @ApiProperty({
        description: 'The server time of the health check',
        example: new Date(),
    })
    serverTime!: Date;

    @Expose()
    @ApiProperty({
        description: 'The application name of the health check',
        example: 'EnterpriseNest',
    })
    appName!: string;
}
