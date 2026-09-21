import {Module} from "@nestjs/common";
import {HealthModule} from "./health/health.module.js";
import {DatabaseModule} from "./database/database.module.js";
import {OrganisationModule} from "./modules/orgnization/organisation.module.js";
import {OrganizationMemberModule} from "./modules/orgnization-member/organization-member.module.js";
import {EmployeeModule} from "./modules/employee/employee.module.js";
import {ConfigModule} from "@nestjs/config";
import configuration from "./config/configuration.js";
import {GuardModule} from "./common/guards/guard.module.js";
import {APP_GUARD} from "@nestjs/core";
import {JwtModule} from "./modules/jwt/jwt.module.js";
import {RedisCacheModule} from "./modules/cache/redis-cache-module.js";
import {AuthModule} from "./modules/auth/auth.module.js";
import {VerifyModule} from './modules/verify/verify.module.js';
import {MailModule} from './mail/mail.module.js';
import {JwtGuard} from "./common/guards/jwt.guard.js";
import {CustomerModule} from "./modules/customer/customer.module.js";
import {EventBusModule} from './common/events/event-bus.module.js';

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true, load: [configuration]}),
        AuthModule,
        RedisCacheModule,
        EmployeeModule,
        OrganisationModule,
        OrganizationMemberModule,
        DatabaseModule,
        HealthModule,
        GuardModule,
        JwtModule,
        VerifyModule,
        MailModule,
        CustomerModule,
        EventBusModule,
    ],
    providers: [{provide: APP_GUARD, useClass: JwtGuard}],
})
export class AppModule {
}