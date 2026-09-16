import {Inject, Injectable} from "@nestjs/common";
import type {Cache} from "cache-manager";
import {CACHE_MANAGER} from "@nestjs/cache-manager";

export const TTL = {
    ofSeconds: (seconds: number): number => seconds * 1000,
    ofMinutes: (minutes: number): number => minutes * 60 * 1000,
    ofHours: (hours: number): number => hours * 60 * 60 * 1000,
    ofDays: (days: number): number => days * 24 * 60 * 60 * 1000,
};

@Injectable()
export class CacheService {
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {
    }

    async set<T>(key: string, value: T, ttl?: number): Promise<T> {
        return await this.cacheManager.set(key, value, ttl);
    }

    async get<T>(key: string): Promise<T | undefined> {
        return this.cacheManager.get<T>(key);
    }

    async remove(key: string): Promise<void> {
        await this.cacheManager.del(key);
    }

    async exists(key: string): Promise<boolean> {
        return !!(await this.get<any>(key));
    }
}