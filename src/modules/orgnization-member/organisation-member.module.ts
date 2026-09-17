import {Module} from '@nestjs/common';
import {OrganizationMemberService} from './organization-member.service.js';
import {OrgnizationMemberController} from "./orgnization-member.controller.js";
import {TypeOrmModule} from "@nestjs/typeorm";
import {OrganizationMember} from "./entity/orgnization-member.entity.js";

@Module({
    imports: [TypeOrmModule.forFeature([OrganizationMember])],
    providers: [OrganizationMemberService],
    controllers: [OrgnizationMemberController],
    exports: [OrganizationMemberService],
})
export class OrganisationMemberModule {
}
