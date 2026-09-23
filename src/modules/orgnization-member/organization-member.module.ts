import {Global, Module} from '@nestjs/common';
import {OrganizationMemberService} from './organization-member.service.js';
import {OrganizationMemberController} from "./organization-member.controller.js";
import {TypeOrmModule} from "@nestjs/typeorm";
import {OrganizationMember} from "./entity/organization-member.entity.js";

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([OrganizationMember])],
    providers: [OrganizationMemberService],
    controllers: [OrganizationMemberController],
    exports: [OrganizationMemberService],
})
export class OrganizationMemberModule {
}
