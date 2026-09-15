import {Module} from '@nestjs/common';
import {HealthModule} from './health/health.module.js';
import {DatabaseModule} from "./database/database.module.js";
import {OrganisationModule} from "./modules/orgnization/organisation.module.js";
import {OrganisationMemberModule} from "./modules/orgnization-member/organisation-member.module.js";
import {UsersModule} from "./modules/users/users.module.js";
import {ConfigModule} from "@nestjs/config";
import configuration from "./config/configuration.js";

@Module({
  imports: [
      ConfigModule.forRoot({isGlobal: true, load: [configuration]}),
      UsersModule,
      OrganisationModule,
      OrganisationMemberModule,
      DatabaseModule,
      HealthModule,
  ],
})
export class AppModule {}