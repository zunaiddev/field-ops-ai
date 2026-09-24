import {Module} from "@nestjs/common";
import {AuthController} from "./auth.controller.js";
import {AuthService} from "./auth.service.js";
import {JwtModule} from "../jwt/jwt.module.js";
import {EmployeeModule} from "../employee/employee.module.js";
import {OrganizationModule} from "../orgnization/organizationModule.js";
import {OrganizationMemberModule} from "../orgnization-member/organization-member.module.js";
import {CustomerModule} from "../customer/customer.module.js";

@Module({
    imports: [JwtModule, EmployeeModule, CustomerModule, OrganizationModule, OrganizationMemberModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {
}
