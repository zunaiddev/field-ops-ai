import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    UseGuards
} from '@nestjs/common';
import {OrgGuard} from "../../common/guards/org.guard.js";
import {CustomerService} from "./customer.service.js";
import {CurrentMember} from "../../common/decorators/current-member.decorator.js";
import {OrganizationMember} from "../orgnization-member/entity/organization-member.entity.js";
import {CreateCustomerReq} from "./dto/create-customer.dto.js";
import {Customer} from "./entity/customer.entity.js";
import {CreateAddressDto} from "./dto/create-address.dto.js";
import {CustomerAddressRes} from "./dto/customer-address-res.dto.js";
import {CustomerRes} from "./dto/customer-res.dto.js";
import {UpdateCustomerDto} from "./dto/update-customer.dto.js";

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

    @Get()
    async getCustomers(@CurrentMember() member: OrganizationMember):
        Promise<CustomerRes[]> {
        return await this.customerService.getCustomers(member);
    }

    @Get(':id')
    async getCustomer(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentMember() member: OrganizationMember,
    ): Promise<CustomerRes> {
        return await this.customerService.getCustomer(id, member);
    }

    @Patch(':id')
    async updateCustomer(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateCustomerDto,
        @CurrentMember() member: OrganizationMember,
    ): Promise<CustomerRes> {
        return await this.customerService.updateCustomer(id, dto, member);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteCustomer(@Param('id', ParseUUIDPipe) id: string,
                         @CurrentMember() member: OrganizationMember): Promise<void> {
        await this.customerService.deleteCustomer(id, member);
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
