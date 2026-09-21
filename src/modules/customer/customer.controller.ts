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
    Query,
    UseGuards
} from '@nestjs/common';
import {OrgGuard} from "../../common/guards/org.guard.js";
import {CustomerService} from "./customer.service.js";
import {CurrentMember} from "../../common/decorators/current-member.decorator.js";
import {OrganizationMember, OrganizationRole} from "../orgnization-member/entity/organization-member.entity.js";
import {CreateCustomerReq} from "./dto/create-customer.dto.js";
import {CreateAddressDto} from "./dto/create-address.dto.js";
import {UpdateAddressDto} from "./dto/update-address.dto.js";
import {CustomerAddressRes} from "./dto/customer-address-res.dto.js";
import {CustomerRes} from "./dto/customer-res.dto.js";
import {PaginatedCustomersRes} from "./dto/paginated-customers-res.dto.js";
import {UpdateCustomerDto} from "./dto/update-customer.dto.js";
import {GetCustomersQueryDto} from "./dto/get-customers-query.dto.js";
import {RolesGuard} from "../../common/guards/roles.guard.js";
import {Roles} from "../../common/decorators/roles.decorator.js";

@Roles(OrganizationRole.ORG_OWNER, OrganizationRole.ORG_ADMIN,
    OrganizationRole.MANAGER)
@UseGuards(OrgGuard, RolesGuard)
@Controller('customers')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) {
    }

    @Post()
    async create(@CurrentMember() member: OrganizationMember,
                 @Body() dto: CreateCustomerReq): Promise<CustomerRes> {
        return await this.customerService.create(member, dto);
    }

    @Get()
    async getCustomers(@CurrentMember() member: OrganizationMember,
                       @Query() query: GetCustomersQueryDto): Promise<PaginatedCustomersRes> {
        return await this.customerService.getCustomers(member, {
            page: query.page,
            pageSize: query.pageSize,
            search: {
                name: query.name,
                email: query.email,
            },
        });
    }

    @Get(':id')
    async getCustomer(@Param('id', ParseUUIDPipe) id: string,
                      @CurrentMember() member: OrganizationMember): Promise<CustomerRes> {
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

    @Get(':customerId/addresses')
    async getAddress(@Param('customerId', ParseUUIDPipe) customerId: string,
                     @CurrentMember() member: OrganizationMember)
        : Promise<CustomerAddressRes[]> {
        return await this.customerService.getAddress(customerId, member);
    }

    @Patch('addresses/:addressId')
    async updateAddress(
        @Param('addressId', ParseUUIDPipe) addressId: string,
        @Body() dto: UpdateAddressDto,
        @CurrentMember() member: OrganizationMember,
    ): Promise<CustomerAddressRes> {
        return await this.customerService.updateAddress(addressId, dto, member);
    }

    @Delete('addresses/:addressId')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteAddress(
        @Param('addressId', ParseUUIDPipe) addressId: string,
        @CurrentMember() member: OrganizationMember,
    ): Promise<void> {
        await this.customerService.deleteAddress(addressId, member);
    }
}