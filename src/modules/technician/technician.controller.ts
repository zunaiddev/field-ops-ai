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
import {TechnicianAddressDto} from "./dto/technician-address.dto.js";

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
        return await this.technicianService.create(dto, membership);
    }

    @Get()
    async getTechnicians(@CurrentMember() member: OrganizationMember) {
        return await this.technicianService.getTechnicians(member);
    }

    @Delete(":technicianId")
    async deleteTechnician(@Param("technicianId", ParseIntPipe) technicianId: number,
                           @CurrentMember() member: OrganizationMember) {
        await this.technicianService.deleteTechnician(technicianId, member);
    }

    @Get(":technicianId/skills")
    async getTechnicianSkills(@Param("technicianId", ParseIntPipe)
                              technicianId: number,
                              @CurrentMember() member: OrganizationMember) {
        return await this.technicianService.getTechnicianSkills(technicianId, member);
    }

    @Patch(":technicianId/address/:addressId")
    async updateAddress(@Param("technicianId", ParseIntPipe) technicianId: number,
                        @Body() dto: TechnicianAddressDto,
                        @Param("addressId", ParseIntPipe) addressId: number,
                        @CurrentMember() member: OrganizationMember) {
        return await this.technicianService.updateAddress(technicianId, addressId, dto, member);
    }

    @Delete(":technicianId/skills/:skillId")
    async removeSkill(@Param("technicianId", ParseIntPipe) technicianId: number,
                      @Param("skillId", ParseIntPipe) skillId: number,
                      @CurrentMember() member: OrganizationMember) {
        await this.technicianService.removeSkill(technicianId, skillId, member);
    }

    @Patch(":technicianId/skills/:skillId")
    async addSkill(@Param("technicianId", ParseIntPipe) technicianId: number,
                   @Param("skillId", ParseIntPipe) skillId: number,
                   @CurrentMember() member: OrganizationMember) {
        return await this.technicianService.addSkill(technicianId, skillId, member);
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

    @Get("skills/:id/technicians")
    async getTechnicianForSkill(@Param("id", ParseIntPipe) id: number,
                                @CurrentMember() membership: OrganizationMember) {
        return await this.technicianService.getAllTechnicianForSkill(id, membership);
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