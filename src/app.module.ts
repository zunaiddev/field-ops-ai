import { Module } from "@nestjs/common";
import { HealthModule } from "./health/health.module.js";
import { DatabaseModule } from "./database/database.module.js";
import { OrganisationModule } from "./modules/orgnization/organisation.module.js";
import { OrganisationMemberModule } from "./modules/orgnization-member/organisation-member.module.js";
import { UsersModule } from "./modules/users/users.module.js";
import { ConfigModule } from "@nestjs/config";
import configuration from "./config/configuration.js";
import { GuardModule } from "./common/guards/guard.module.js";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./common/guards/auth-guard.guard.js";
import { JwtModule } from "./modules/jwt/jwt.module.js";
import { RedisCacheModule } from "./modules/cache/redis-cache-module.js";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    RedisCacheModule,
    UsersModule,
    OrganisationModule,
    OrganisationMemberModule,
    DatabaseModule,
    HealthModule,
    GuardModule,
    JwtModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule {}