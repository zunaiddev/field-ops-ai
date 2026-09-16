import { Inject, Injectable } from "@nestjs/common";
import type { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async set(key: string, value: string, ttl?: number): Promise<string> {
    return await this.cacheManager.set(key, value, ttl);
  }

  async get(key: string): Promise<string | undefined> {
    return this.cacheManager.get(key);
  }
}
