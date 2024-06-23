import { RedisPublisher } from '@/application/cqrs/adapters/redis/redis.publisher';
import { RedisSubscriber } from '@/application/cqrs/adapters/redis/redis.subscriber';
import { CqrsModuleType } from '@/application/cqrs/cqrs.module-type';

export const CQRSRedisOptions: CqrsModuleType = {
    subscriber: RedisSubscriber,
    publisher: RedisPublisher,
};
