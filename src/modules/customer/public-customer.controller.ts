import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards} from "@nestjs/common";
import {CurrentCustomer} from "../../common/decorators/current-customer.decorator.js";
import {Customer} from "./entity/customer.entity.js";
import {CustomerRes} from "./dto/customer-res.dto.js";
import {CustomerGuard} from "../../common/guards/customer.guard.js";
import {PublicCustomerService} from "./public-customer.service.js";
import {CreateServiceReq} from "../service-req/dto/create-service-request.dto.js";
import {UpdateServiceReq} from "../service-req/dto/update-service-request.dto.js";
import {CreateAddressDto} from "./dto/create-address.dto.js";
import {UpdateAddressDto} from "./dto/update-address.dto.js";
import {UpdatePublicCustomer} from "./dto/update-public-customer.js";
import {CustomerScheduleRes} from "./dto/customer-schedule-res.dto.js";

@UseGuards(CustomerGuard)
@Controller('public/customers')
export class PublicCustomerController {
    constructor(private readonly publicCustomerService: PublicCustomerService) {
    }

    @Get()
    async getCustomer(@CurrentCustomer() customer: Customer): Promise<CustomerRes> {
        return await this.publicCustomerService.getFullCustomer(customer);
    }

    @Patch()
    async updateCustomer(@CurrentCustomer() customer: Customer,
                         @Body() dto: UpdatePublicCustomer) {
        return await this.publicCustomerService.updateCustomer(customer, dto);
    }

    @Get("addresses")
    async getAddress(@CurrentCustomer() customer: Customer) {
        return await this.publicCustomerService.getAddresses(customer);
    }

    @Post("addresses")
    async addAddress(@CurrentCustomer() customer: Customer, @Body() address: CreateAddressDto) {
        return await this.publicCustomerService.addAddress(customer, address);
    }

    @Patch("addresses/:id")
    async updateAddress(@CurrentCustomer() customer: Customer,
                        @Param("id") addressId: number,
                        @Body() dto: UpdateAddressDto) {
        return await this.publicCustomerService.updateAddress(customer, addressId, dto);
    }

    @Delete("addresses/:id")
    async deleteAddress(@CurrentCustomer() customer: Customer,
                        @Param("id", ParseIntPipe) addressId: number) {
        return await this.publicCustomerService.deleteAddress(customer, addressId);
    }

    @Get("services")
    async getServices(@CurrentCustomer() customer: Customer) {
        return await this.publicCustomerService.getServices(customer);
    }

    @Post("services")
    async createService(@CurrentCustomer() customer: Customer, @Body() dto: CreateServiceReq) {
        return await this.publicCustomerService.createServiceReq(customer, dto);
    }

    @Patch("services/:id")
    async updateService(@CurrentCustomer() customer: Customer,
                        @Param("id", ParseIntPipe) id: number,
                        @Body() dto: UpdateServiceReq) {
        return await this.publicCustomerService.updateService(id, customer, dto);
    }

    @Delete("services/:id")
    async deleteService(@CurrentCustomer() customer: Customer,
                        @Param("id", ParseIntPipe) id: number) {
        await this.publicCustomerService.deleteService(customer, id);
    }

    @Get('schedule/:serviceId')
    async getSchedule(@CurrentCustomer() customer: Customer,
                      @Param("serviceId", ParseIntPipe) serviceId: number): Promise<CustomerScheduleRes> {
        return await this.publicCustomerService.getSchedule(serviceId, customer);
    }
}
