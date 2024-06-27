import { Module, Type } from '@nestjs/common';

import { V1UserModule } from '@/application/user/v1/v1-user.module';

const EventHandlers: Type[] = [];

@Module({
    imports: [V1UserModule],
    providers: [...EventHandlers],
})
export class UserModule {}
