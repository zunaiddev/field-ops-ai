import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards} from '@nestjs/common';
import {TechnicianService} from "./technician.service.js";
import {Roles} from "../../common/decorators/roles.decorator.js";
import {OrganizationMember, OrganizationRole} from "../orgnization-member/entity/organization-member.entity.js";
import {OrgGuard} from "../../common/guards/org.guard.js";
import {RolesGuard} from "../../common/guards/roles.guard.js";
import {CurrentMember} from "../../common/decorators/current-member.decorator.js";
import {CreateTechnicianReq} from "./dto/create-technician-req.dto.js";
import {CreateSkillReq} from "./dto/create-skill.req.js";
import {SkillDto} from "./dto/skill.dto.js";
import {UpdateSkillReq} from "./dto/update-skill-req.dto.js";

@Roles(OrganizationRole.ORG_OWNER, OrganizationRole.ORG_ADMIN,
    OrganizationRole.MANAGER)
@UseGuards(OrgGuard, RolesGuard)
@Controller('technicians')
export class TechnicianController {
    constructor(private readonly technicianService: TechnicianService) {
    }

    @Post()
    async create(@Body() dto: CreateTechnicianReq,
                 @CurrentMember() membership: OrganizationMember) {
        // return await this.technicianService.create(dto, membership);
        return dto;
    }

    @Post("/skills")
    async createSkill(@Body() skill: CreateSkillReq, @CurrentMember() membership: OrganizationMember) {
        return await this.technicianService.createSkill(skill, membership);
    }

    @Get("skills")
    async getSkills(@CurrentMember() membership: OrganizationMember): Promise<SkillDto[]> {
        return await this.technicianService.getAllSkills(membership);
    }

    @Get("skills/:id")
    async getSkill(@Param("id", ParseIntPipe) id: number,
                   @CurrentMember() membership: OrganizationMember): Promise<SkillDto> {
        return await this.technicianService.getSkill(id, membership);
    }

    @Patch("skills/:id")
    async updateSkill(@Param("id", ParseIntPipe) id: number,
                      @Body() dto: UpdateSkillReq,
                      @CurrentMember() membership: OrganizationMember): Promise<SkillDto> {
        return await this.technicianService.updateSkill(id, dto, membership);
    }

    @Delete("skill/:id")
    async deleteSkill(@Param("id", ParseIntPipe) id: number,
                      @CurrentMember() membership: OrganizationMember): Promise<void> {
        await this.technicianService.deleteSkill(id, membership);
    }
}