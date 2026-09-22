import {Module} from '@nestjs/common';
import {ServiceReqService} from "./service-req.service.js";
import {ServiceReqController} from "./service-req.controller.js";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ServiceRequest} from "./entity/service-req.entity.js";
import {CustomerModule} from "../customer/customer.module.js";
import {OrganizationMemberModule} from "../orgnization-member/organization-member.module.js";


@Module({
    imports: [TypeOrmModule.forFeature([ServiceRequest]),
        CustomerModule, OrganizationMemberModule],
    providers: [ServiceReqService],
    controllers: [ServiceReqController]
})
export class ServiceReqModule {
}