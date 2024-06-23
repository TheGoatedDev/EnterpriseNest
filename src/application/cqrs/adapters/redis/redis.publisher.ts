import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { IEvent, IEventPublisher } from '@nestjs/cqrs';
import Redis from 'ioredis';

import { RedisConfigService } from '@/application/config/configs/redis-config.service';

@Injectable()
export class RedisPublisher implements IEventPublisher, OnModuleInit {
    private readonly client: Redis;

    private readonly logger = new Logger(RedisPublisher.name);

    constructor(private readonly redisConfig: RedisConfigService) {
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

    onModuleInit() {
        this.client.on('error', (error) => {
            this.logger.error('Redis error', error);
        });
    }

    async publish<T extends IEvent>(event: T) {
        this.logger.log(`Publishing event: ${event.constructor.name}`);

        await this.client.publish(
            'eventBus',
            JSON.stringify({
                topic: event.constructor.name,
                event,
            }),
        );
    }
}
