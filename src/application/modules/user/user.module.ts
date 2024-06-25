import { Module, Type } from '@nestjs/common';

import { V1UserModule } from '@/application/modules/user/v1/v1-user.module';

const EventHandlers: Type[] = [];

@Module({
    imports: [V1UserModule],
    controllers: [],
    providers: [...EventHandlers],
})
export class UserModule {}
