import {Injectable, Logger, OnModuleDestroy} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {Redis} from 'ioredis';

@Injectable()
export class EventBusService implements OnModuleDestroy {
    private readonly redis: Redis;
    private readonly logger: Logger;

    constructor(private readonly configService: ConfigService) {
        this.logger = new Logger(EventBusService.name);

        const host: string = this.configService.getOrThrow<string>('REDIS_HOST');
        const port: number = this.configService.getOrThrow<number>('REDIS_PORT');

        this.redis = new Redis({
            host,
            port,
        });
    }

    async publish(event: string, payload: unknown): Promise<void> {
        await this.redis.publish(event, JSON.stringify(payload));

        this.logger.log(`New Event ${event}`);
    }

    async onModuleDestroy(): Promise<void> {
        await this.redis.quit();
    }
}