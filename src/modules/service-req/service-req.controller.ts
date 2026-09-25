import {Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {ServiceReqService} from "./service-req.service.js";
import {CreateServiceReq} from "./dto/create-service-request.dto.js";
import {ServiceRequestQuery} from "./dto/service-request-query.dto.js";
import {UpdateServiceReq} from "./dto/update-service-request.dto.js";
import {OrgGuard} from "../../common/guards/org.guard.js";
import {Roles} from "../../common/decorators/roles.decorator.js";
import {OrganizationMember, OrganizationRole} from "../orgnization-member/entity/organization-member.entity.js";
import {CurrentMember} from "../../common/decorators/current-member.decorator.js";
import {PaginatedServiceRequestsRes} from "./dto/paginated-service-req-res.dto.js";
import {ServiceReqDto} from "./dto/service-req.dto.js";
import {RolesGuard} from "../../common/guards/roles.guard.js";

@Roles(OrganizationRole.ORG_OWNER, OrganizationRole.ORG_ADMIN,
    OrganizationRole.TECHNICIAN)
@UseGuards(OrgGuard, RolesGuard)
@Controller('service-requests')
export class ServiceReqController {
    constructor(private readonly serviceReqService: ServiceReqService) {
    }

    @Post()
    async create(@Body() dto: CreateServiceReq,
                 @CurrentMember() member: OrganizationMember): Promise<ServiceReqDto> {
        return await this.serviceReqService.create(dto, member);
    }

    @Get()
    async getAll(@Query() query: ServiceRequestQuery,
                 @CurrentMember() member: OrganizationMember): Promise<PaginatedServiceRequestsRes> {
        return await this.serviceReqService.findAll(query, member);
    }

    @Get(':id')
    async getByID(@Param('id', ParseIntPipe) id: number,
                  @CurrentMember() membership: OrganizationMember): Promise<ServiceReqDto> {
        return await this.serviceReqService.getServiceReq(id, membership);
    }

    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number,
                 @Body() dto: UpdateServiceReq, @CurrentMember() membership: OrganizationMember) {
        return await this.serviceReqService.updateServiceReq(id, dto, membership);
    }

    @Post(':id/convert-to-work-order')
    convertToWorkOrder(@Param('id') id: string) {
        return {id};
    }
}
