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
    Query,
    UseGuards,
} from '@nestjs/common';
import {Roles} from '../../common/decorators/roles.decorator.js';
import {OrganizationMember, OrganizationRole} from '../orgnization-member/entity/organization-member.entity.js';
import {OrgGuard} from '../../common/guards/org.guard.js';
import {RolesGuard} from '../../common/guards/roles.guard.js';
import {CurrentMember} from '../../common/decorators/current-member.decorator.js';
import {TechnicianAvailabilityService} from './technician-availability.service.js';
import {CreateTechnicianAvailabilityDto} from './dto/create-technician-availability.dto.js';
import {UpdateTechnicianAvailabilityDto} from './dto/update-technician-availability.dto.js';
import {GetTechnicianAvailabilityQueryDto} from './dto/get-technician-availability-query.dto.js';
import {TechnicianAvailabilityRes} from './dto/technician-availability-res.dto.js';

@Roles(
    OrganizationRole.ORG_OWNER,
    OrganizationRole.ORG_ADMIN,
    OrganizationRole.MANAGER,
)
@UseGuards(OrgGuard, RolesGuard)
@Controller('technicians/availability')
export class TechnicianAvailabilityController {
    constructor(private readonly availabilityService: TechnicianAvailabilityService) {
    }

    @Post()
    async create(
        @Param('technicianId', ParseIntPipe) technicianId: number,
        @Body() dto: CreateTechnicianAvailabilityDto,
        @CurrentMember() member: OrganizationMember,
    ): Promise<TechnicianAvailabilityRes> {
        return await this.availabilityService.create(technicianId, dto, member);
    }

    @Get()
    async findAll(
        @Param('technicianId', ParseIntPipe) technicianId: number,
        @CurrentMember() member: OrganizationMember,
        @Query() query?: GetTechnicianAvailabilityQueryDto,
    ): Promise<TechnicianAvailabilityRes[]> {
        return await this.availabilityService.findAll(technicianId, member, query);
    }

    @Patch(':id')
    async update(
        @Param('technicianId', ParseIntPipe) technicianId: number,
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateTechnicianAvailabilityDto,
        @CurrentMember() member: OrganizationMember,
    ): Promise<TechnicianAvailabilityRes> {
        return await this.availabilityService.update(technicianId, id, dto, member);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(
        @Param('technicianId', ParseIntPipe) technicianId: number,
        @Param('id', ParseIntPipe) id: number,
        @CurrentMember() member: OrganizationMember,
    ): Promise<void> {
        await this.availabilityService.delete(technicianId, id, member);
    }
}
