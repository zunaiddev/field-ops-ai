import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import {OrgGuard} from "../../common/guards/org.guard.js";
import {CustomerService} from "./customer.service.js";
import {CurrentMember} from "../../common/decorators/current-member.decorator.js";
import {OrganizationMember} from "../orgnization-member/entity/organization-member.entity.js";
import {CreateCustomerReq} from "./dto/add-customer-req.dto.js";
import {Customer} from "./entity/customer.entity.js";

@UseGuards(OrgGuard)
@Controller('customers')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) {
    }

    @Post()
    async create(@CurrentMember() member: OrganizationMember,
                 @Body() dto: CreateCustomerReq,): Promise<Customer> {
        return await this.customerService.create(member, dto);
    }
}
