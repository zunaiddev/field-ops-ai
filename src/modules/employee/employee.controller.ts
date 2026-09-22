import {Controller, Get} from "@nestjs/common";
import {EmployeeService} from "./employee.service.js";
import {CurrentJwtPayload} from "../../common/decorators/current-jwt-payload.decorator.js";
import * as jwtTypes from "../jwt/jwt.types.js";

@Controller("/employees")
export class EmployeeController {

    constructor(private readonly employeeService: EmployeeService) {
    }

    @Get()
    async getEmployee(@CurrentJwtPayload() payload: jwtTypes.CustomJwtPayload) {
        return await this.employeeService.getEmployee(payload.sub);
    }
}