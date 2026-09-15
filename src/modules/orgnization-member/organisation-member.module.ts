import {Module} from '@nestjs/common';
import {OrganisationMemberService} from './organisation-member.service.js';
import {OrgnizationMemberController} from "./orgnization-member.controller.js";
import {TypeOrmModule} from "@nestjs/typeorm";
import {OrganizationMember} from "./entity/orgnization-member.entity.js";

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationMember])],
  providers: [OrganisationMemberService],
  controllers: [OrgnizationMemberController]
})
export class OrganisationMemberModule {}
