import { Module, Type } from '@nestjs/common';

const QueryHandlers: Type[] = [];
const QueryControllers: Type[] = [];

const CommandHandlers: Type[] = [];
const CommandControllers: Type[] = [];

@Module({
    imports: [],
    controllers: [...CommandControllers, ...QueryControllers],
    providers: [...QueryHandlers, ...CommandHandlers],
})
export class V1TokenModule {}
