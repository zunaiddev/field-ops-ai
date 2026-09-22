import {Module} from '@nestjs/common';
import {EmployeeService} from "./employee.service.js";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Employee} from "./entity/employee.entity.js";
import {EmployeeController} from "./employee.controller.js";
import {OrganizationMemberModule} from "../orgnization-member/organization-member.module.js";

@Module({
    imports: [TypeOrmModule.forFeature([Employee]), OrganizationMemberModule],
    controllers: [EmployeeController],
    providers: [EmployeeService],
    exports: [EmployeeService],
})
export class EmployeeModule {
}
