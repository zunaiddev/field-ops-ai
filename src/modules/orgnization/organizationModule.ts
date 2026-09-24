import {Global, Module} from '@nestjs/common';
import {OrganizationService} from "./organization.service.js";
import {OrganizationController} from "./organization-controller.js";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Organization} from "./entity/organization.entity.js";
import {OrganizationMemberModule} from "../orgnization-member/organization-member.module.js";
import {EmployeeModule} from "../employee/employee.module.js";
import {GuardModule} from "../../common/guards/guard.module.js";

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([Organization]),
        OrganizationMemberModule, EmployeeModule, GuardModule],
    providers: [OrganizationService],
    controllers: [OrganizationController],
    exports: [OrganizationService],
})
export class OrganizationModule {
}
