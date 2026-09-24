import {
    ArrayNotEmpty,
    IsArray,
    IsInt,
    IsNotEmpty,
    IsPositive,
    ValidateNested,
} from "class-validator";
import {Type} from "class-transformer";
import {TechnicianAddressDto} from "./technician-address.dto.js";

export class CreateTechnicianReq {
    @IsNotEmpty({message: "Employee ID is required"})
    @Type(() => Number)
    @IsInt({message: "Employee ID must be an integer"})
    @IsPositive({message: "Employee ID must be a positive number"})
    employeeId: number;

    @IsArray({message: "Skills must be an array"})
    @ArrayNotEmpty({message: "At least one technician skill is required"})
    @Type(() => Number)
    @IsInt({each: true, message: "Each skill must be an integer"})
    @IsPositive({each: true, message: "Each skill must be a positive number"})
    skills: number[];

    @IsNotEmpty({message: "Home address is required"})
    @ValidateNested()
    @Type(() => TechnicianAddressDto)
    homeAddress: TechnicianAddressDto;

    @IsNotEmpty({message: "Current address is required"})
    @ValidateNested()
    @Type(() => TechnicianAddressDto)
    currentAddress: TechnicianAddressDto;
}
