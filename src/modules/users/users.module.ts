import {Module} from '@nestjs/common';
import {UsersController} from "./users.controller.js";
import {EmployeeService} from "./employee.service.js";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Employee} from "./entity/employee.entity.js";

@Module({
    imports: [TypeOrmModule.forFeature([Employee])],
    controllers: [UsersController],
    providers: [EmployeeService],
    exports: [EmployeeService],
})
export class UsersModule {
}
