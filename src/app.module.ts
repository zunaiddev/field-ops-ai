import {Module} from '@nestjs/common';
import {HealthModule} from './modules/health/health.module.js';
import {DatabaseModule} from "./database/database.module.js";
import {UsersModule} from "./modules/users/users.module.js";
import {OrganisationModule} from "./modules/orgnization/organisation.module.js";
import {OrganisationMemberModule} from "./modules/orgnization-member/organisation-member.module.js";

@Module({
  imports: [
      UsersModule,
      OrganisationModule,
      OrganisationMemberModule,
      DatabaseModule,
      HealthModule,
  ],
})
export class AppModule {}