import {Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards} from '@nestjs/common';
import {OrgGuard} from "../../common/guards/org.guard.js";
import {CustomerService} from "./customer.service.js";
import {CurrentMember} from "../../common/decorators/current-member.decorator.js";
import {OrganizationMember} from "../orgnization-member/entity/organization-member.entity.js";
import {CreateCustomerReq} from "./dto/create-customer.dto.js";
import {Customer} from "./entity/customer.entity.js";
import {CreateAddressDto} from "./dto/create-address.dto.js";
import {CustomerAddressRes} from "./dto/customer-address-res.dto.js";
import {CustomerRes} from "./dto/customer-res.dto.js";

@UseGuards(OrgGuard)
@Controller('customers')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) {
    }

    @Post()
    async create(@CurrentMember() member: OrganizationMember,
                 @Body() dto: CreateCustomerReq): Promise<Customer> {
        return await this.customerService.create(member, dto);
    }

    @Get(':id')
    async getCustomer(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentMember() member: OrganizationMember,
    ): Promise<CustomerRes> {
        return await this.customerService.getCustomer(id, member);
    }

    @Post(':customerId/addresses')
    async addAddress(
        @Param('customerId', ParseUUIDPipe) customerId: string,
        @Body() dto: CreateAddressDto,
        @CurrentMember() member: OrganizationMember,
    ): Promise<CustomerAddressRes> {
        return await this.customerService.addAddress(customerId, dto, member);
    }
}
