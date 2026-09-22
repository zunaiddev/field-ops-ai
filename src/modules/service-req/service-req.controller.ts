import {Body, Controller, Get, Param, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {ServiceReqService} from "./service-req.service.js";
import {CreateServiceReq} from "./dto/create-service-request.dto.js";
import {ServiceRequestQuery} from "./dto/service-request-query.dto.js";
import {UpdateServiceReq} from "./dto/update-service-request.dto.js";
import {OrgGuard} from "../../common/guards/org.guard.js";
import {Roles} from "../../common/decorators/roles.decorator.js";
import {OrganizationMember, OrganizationRole} from "../orgnization-member/entity/organization-member.entity.js";
import {CurrentMember} from "../../common/decorators/current-member.decorator.js";

@Roles(OrganizationRole.ORG_OWNER, OrganizationRole.ORG_ADMIN,
    OrganizationRole.TECHNICIAN)
@UseGuards(OrgGuard)
@Controller('service-requests')
export class ServiceReqController {
    constructor(private readonly serviceReqService: ServiceReqService) {
    }

    @Post()
    async create(@Body() dto: CreateServiceReq,
                 @CurrentMember() member: OrganizationMember) {
        return await this.serviceReqService.create(dto, member);
    }

    @Get()
    findAll(@Query() query: ServiceRequestQuery) {
        return query;
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return {id};
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateServiceReq) {
        return {id, ...dto};
    }

    @Post(':id/convert-to-work-order')
    convertToWorkOrder(@Param('id') id: string) {
        return {id};
    }
}