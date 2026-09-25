import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import {ScheduleService} from './schedule.service.js';
import {CreateScheduleDto} from './dto/create-schedule.dto.js';
import {UpdateScheduleDto} from './dto/update-schedule.dto.js';
import {ScheduleDto} from './dto/schedule.dto.js';
import {CurrentMember} from "../../common/decorators/current-member.decorator.js";
import {OrganizationMember, OrganizationRole} from "../orgnization-member/entity/organization-member.entity.js";
import {Roles} from "../../common/decorators/roles.decorator.js";
import {OrgGuard} from "../../common/guards/org.guard.js";
import {RolesGuard} from "../../common/guards/roles.guard.js";

@Roles(
    OrganizationRole.ORG_OWNER,
    OrganizationRole.ORG_ADMIN,
    OrganizationRole.MANAGER,
)
@UseGuards(OrgGuard, RolesGuard)
@Controller('schedules')
export class ScheduleController {
    constructor(private readonly scheduleService: ScheduleService) {
    }

    @Post()
    async create(
        @Body() createScheduleDto: CreateScheduleDto,
        @CurrentMember() member: OrganizationMember,
    ): Promise<ScheduleDto> {
        return await this.scheduleService.create(createScheduleDto, member);
    }

    @Get("services/:serviceId")
    async getSchedule(
        @Param("serviceId", ParseIntPipe) serviceId: number,
        @CurrentMember() member: OrganizationMember,
    ): Promise<ScheduleDto> {
        return await this.scheduleService.findByServiceId(serviceId, member);
    }

    @Get()
    async findAll(@CurrentMember() member: OrganizationMember): Promise<ScheduleDto[]> {
        return await this.scheduleService.findAll(member);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number,
                  @CurrentMember() member: OrganizationMember): Promise<ScheduleDto> {
        return await this.scheduleService.findOne(id, member);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateScheduleDto: UpdateScheduleDto,
        @CurrentMember() member: OrganizationMember,
    ) {
        return await this.scheduleService.update(id, updateScheduleDto, member);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(
        @Param('id', ParseIntPipe) id: number,
        @CurrentMember() member: OrganizationMember,
    ): Promise<void> {
        await this.scheduleService.delete(id, member);
    }
}