import {Module} from '@nestjs/common';
import {OrgnizationService} from "./orgnization.service.js";
import {OrgnizationController} from "./orgnization.controller.js";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Organization} from "./entity/organization.entity.js";

@Module({
  imports: [TypeOrmModule.forFeature([Organization])],
  providers: [OrgnizationService],
  controllers: [OrgnizationController]
})
export class OrganisationModule {}
