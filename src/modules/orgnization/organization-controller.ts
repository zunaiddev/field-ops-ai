import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {OrganizationService} from "./organization.service.js";
import {OrganizationRes} from "./dto/organization-res.dto.js";
import {OrganizationUpdateReq} from "./dto/organization-update-req.dto.js";
import {CurrentMember} from "../../common/decorators/current-member.decorator.js";
import {OrganizationMember} from "../orgnization-member/entity/organization-member.entity.js";
import {Organization} from "./entity/organization.entity.js";
import {CurrentOrg} from "../../common/decorators/current-org.js";
import {AddMemberDto} from "./dto/add-member.dto.js";
import {OrganizationMembersRes} from "./dto/organization-members-res.dto.js";
import {UpdateMemberReq} from "./dto/update-member.dto.js";
import {UserDto} from "../users/dto/user.dto.js";

@Controller('organizations')
export class OrganizationController {
    constructor(private readonly organizationService: OrganizationService) {
    }

    @Get('current')
    async getCurrentOrganization(@CurrentMember() orgMember: OrganizationMember): Promise<OrganizationRes> {
        return await this.organizationService.getCurrent(orgMember);
    }

    @Patch('current')
    async updateCurrentOrganization(
        @CurrentMember() orgMember: OrganizationMember,
        @Body() updateDto: OrganizationUpdateReq,
    ): Promise<OrganizationRes> {
        return await this.organizationService.updateCurrent(orgMember, updateDto);
    }

    @Get('current/members')
    async getCurrentOrganizationMembers(@CurrentMember() orgMember: OrganizationMember): Promise<OrganizationMembersRes> {
        return await this.organizationService.getCurrentMembers(orgMember);
    }

    @Post('current/members')
    async addMember(@Body() dto: AddMemberDto, @CurrentOrg() org: Organization): Promise<OrganizationRes> {
        return await this.organizationService.addMember(org, dto);
    }

    @Patch('current/members/:id')
    async updateMemberRole(@Param('id') id: string, @CurrentMember() orgMember: OrganizationMember, @Body() dto: UpdateMemberReq): Promise<UserDto> {
        return await this.organizationService.updateMember(id, orgMember, dto);
    }

    @Delete('current/members/:id')
    async deleteMember(@Param('id') id: string, @CurrentMember() orgMember: OrganizationMember): Promise<void> {
        await this.organizationService.deleteMember(id, orgMember);
    }
}
