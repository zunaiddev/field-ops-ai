import { Global, Module } from "@nestjs/common";
import { CacheService } from "./cache.service.js";
import { CacheModule } from "@nestjs/cache-manager";
import redisConfig from "../../config/redis.config.js";

@Global()
@Module({
  imports: [CacheModule.registerAsync(redisConfig())],
  providers: [CacheService],
  exports: [CacheService],
})
export class RedisCacheModule {}