import {
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
} from "class-validator";
import {Trim} from "../../../common/decorators/transform.decorators.js";

export class CreateAddressDto {
    @Trim()
    @IsNotEmpty({message: "Address line 1 is required"})
    @IsString({message: "Address line 1 must be a string"})
    @MaxLength(100, {message: "Address line 1 cannot exceed 100 characters"})
    addressLine1: string;

    @Trim()
    @IsOptional()
    @IsString({message: "Address line 2 must be a string"})
    @MaxLength(100, {message: "Address line 2 cannot exceed 100 characters"})
    addressLine2?: string;

    @Trim()
    @IsNotEmpty({message: "City is required"})
    @IsString({message: "City must be a string"})
    @MaxLength(100, {message: "City cannot exceed 100 characters"})
    city: string;

    @Trim()
    @IsNotEmpty({message: "State is required"})
    @IsString({message: "State must be a string"})
    @MaxLength(100, {message: "State cannot exceed 100 characters"})
    state: string;

    @Trim()
    @IsNotEmpty({message: "Postal code is required"})
    @IsString({message: "Postal code must be a string"})
    @MaxLength(20, {message: "Postal code cannot exceed 20 characters"})
    postalCode: string;

    @Trim()
    @IsNotEmpty({message: "Country is required"})
    @IsString({message: "Country must be a string"})
    @MaxLength(100, {message: "Country cannot exceed 100 characters"})
    country: string;

    @IsOptional()
    @IsBoolean({message: "isPrimary must be a boolean value"})
    isPrimary?: boolean;
}
