import {Module} from '@nestjs/common';
import {VerifyService} from './verify.service.js';
import {VerifyController} from './verify.controller.js';
import {JwtModule} from "../jwt/jwt.module.js";
import {EmployeeModule} from "../employee/employee.module.js";

@Module({
    imports: [JwtModule, EmployeeModule],
    providers: [VerifyService],
    controllers: [VerifyController]
})
export class VerifyModule {
}
