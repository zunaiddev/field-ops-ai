import {Module} from '@nestjs/common';
import {EmployeeService} from "./employee.service.js";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Employee} from "./entity/employee.entity.js";

@Module({
    imports: [TypeOrmModule.forFeature([Employee])],
    providers: [EmployeeService],
    exports: [EmployeeService],
})
export class EmployeeModule {
}
