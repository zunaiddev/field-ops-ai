import { ConfigService } from "@nestjs/config";
import { RedisStore, redisStore } from "cache-manager-redis-store";
import { Logger } from "@nestjs/common";

export default () => ({
  isGlobal: true,
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const logger = new Logger("Redis");

    const store: RedisStore = await redisStore({
      socket: {
        host: configService.getOrThrow<string>("REDIS_HOST"),
        port: configService.getOrThrow<string>("REDIS_PORT"),
      },
    });

    const client = store.getClient();

    if (client.isOpen) {
      logger.log("Connected to Redis server");
    }

    if (client.isReady) {
      logger.log("Redis client ready to receive commands");
    }

    client.on("connect", () => {
      logger.log("Connected to Redis server");
    });

    client.on("ready", () => {
      logger.log("Redis client ready to receive commands");
    });

    client.on("end", () => {
      logger.warn("Disconnected from Redis");
    });

    client.on("reconnecting", () => {
      logger.warn("Reconnecting to Redis...");
    });

    client.on("error", (err) => {
      logger.error(`Redis Error: ${err.message}`, err.stack);
    });

    return { store: () => store };
  },
});