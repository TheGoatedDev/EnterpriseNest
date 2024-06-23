import {
    Inject,
    Injectable,
    Logger,
    OnModuleDestroy,
    OnModuleInit,
    Optional,
    Type,
} from '@nestjs/common';
import { IEvent, IMessageSource } from '@nestjs/cqrs';
import Redis from 'ioredis';
import { Subject } from 'rxjs';

import { RedisConfigService } from '@/application/config/configs/redis-config.service';
import { EVENTS } from '@/application/cqrs/cqrs.module-type';

@Injectable()
export class RedisSubscriber
    implements IMessageSource, OnModuleInit, OnModuleDestroy
{
    private readonly client: Redis;

    private readonly logger = new Logger(RedisSubscriber.name);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- It is a generic type
    private bridge?: Subject<any>;

    constructor(
        private readonly redisConfig: RedisConfigService,
        @Inject(EVENTS) @Optional() private readonly events: Type[] = [],
    ) {
        this.client = new Redis({
            host: this.redisConfig.host,
            port: this.redisConfig.port,
            username: this.redisConfig.username,
            password: this.redisConfig.password,
            db: this.redisConfig.db,
            lazyConnect: true,
        });

        // On Connect
        this.client.on('connect', () => {
            this.logger.log('Connected to Redis');
        });

        // On Error
        this.client.on('error', (error) => {
            this.logger.error('Redis error', error);
        });

        // On Disconnect
        this.client.on('disconnect', () => {
            this.logger.log('Disconnected from Redis');
        });
    }

    async onModuleInit() {
        await this.client.subscribe('eventBus');

        this.client.on('message', (channel, message) => {
            if (channel !== 'eventBus') {
                return void 0;
            }

            const { topic, event: eventData } = JSON.parse(message) as {
                topic: string;
                event: unknown;
            };

            if (this.bridge) {
                for (const Event of this.events) {
                    if (Event.name === topic) {
                        const receivedEvent = new Event(eventData) as IEvent;
                        this.bridge.next(receivedEvent);
                    }
                }
            }
        });

        this.client.on('error', (error) => {
            this.logger.error('Redis error', error);
        });
    }

    async onModuleDestroy() {
        await this.client.unsubscribe('eventBus');
        await this.client.quit();
    }

    bridgeEventsTo<T extends IEvent>(subject: Subject<T>) {
        this.bridge = subject;
    }
}
