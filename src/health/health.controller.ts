import { Body, Controller, Get, Post } from "@nestjs/common";
import { Public } from "../common/decorators/public.decorator.js";
import { CacheService } from "../modules/cache/cache.service.js";

@Public()
@Controller("health")
export class HealthController {
  constructor(private readonly cacheService: CacheService) {}

  @Get()
  checkHealth() {
    return { message: "UP", timestamp: new Date().toISOString() };
  }

  @Post("test")
  async getTest(@Body() body: any) {
    const { key, value } = body;

    return await this.cacheService.set(key, value);
  }
}