import {Controller, Get, UseGuards} from "@nestjs/common";
import {CustomerService} from "./customer.service.js";
import {CurrentCustomer} from "../../common/decorators/current-customer.decorator.js";
import {Customer} from "./entity/customer.entity.js";
import {CustomerRes} from "./dto/customer-res.dto.js";
import {CustomerGuard} from "../../common/guards/customer.guard.js";

@UseGuards(CustomerGuard)
@Controller('public/customers')
export class PublicCustomerController {
    constructor(private readonly customerService: CustomerService) {
    }

    @Get()
    async getCustomer(@CurrentCustomer() customer: Customer): Promise<CustomerRes> {
        return await this.customerService.getFullCustomer(customer);
    }
}