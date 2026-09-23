import {IsInt, IsNotEmpty, IsPositive, ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import {TechnicianAddressDto} from "./technician-address.dto.js";

export class CreateTechnicianReq {
    @IsNotEmpty({message: "Employee ID is required"})
    @Type(() => Number)
    @IsInt({message: "Employee ID must be an integer"})
    @IsPositive({message: "Employee ID must be a positive number"})
    employeeId: number;

    @IsNotEmpty({message: "Home address is required"})
    @ValidateNested()
    @Type(() => TechnicianAddressDto)
    homeAddress: TechnicianAddressDto;

    @IsNotEmpty({message: "Current address is required"})
    @ValidateNested()
    @Type(() => TechnicianAddressDto)
    currentAddress: TechnicianAddressDto;
}
