import { Module } from '@nestjs/common';
import {} from '@nestjs/cqrs';

import { V1SessionModule } from './v1/v1-session.module';

@Module({
    imports: [V1SessionModule],
})
export class SessionModule {}
