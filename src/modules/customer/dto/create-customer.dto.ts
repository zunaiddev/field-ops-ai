import {IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength,} from "class-validator";
import {CleanEmail, CleanName, Trim} from "../../../common/decorators/transform.decorators.js";

export class CreateCustomerReq {
    @CleanName()
    @IsNotEmpty({message: "Name is required"})
    @IsString({message: "Name must be a string"})
    @MaxLength(150, {message: "Name cannot exceed 150 characters"})
    name: string;

    @Trim()
    @IsString({message: "Phone number must be a string"})
    @MaxLength(30, {message: "Phone number cannot exceed 30 characters"})
    phone: string;

    @CleanEmail()
    @IsNotEmpty({message: "Email is required"})
    @IsEmail({}, {message: "Please provide a valid email address"})
    @MaxLength(255, {message: "Email cannot exceed 255 characters"})
    email: string;

    @IsNotEmpty({message: "Password is required"})
    @MaxLength(60, {message: "Password cannot exceed 60 characters"})
    @MinLength(6, {message: "Password should be least 6 characters"})
    password: string;

    @Trim()
    @IsOptional()
    @IsString({message: "External reference must be a string"})
    @MaxLength(100, {message: "External reference cannot exceed 100 characters"})
    externalReference?: string;

    @Trim()
    @IsOptional()
    @IsString({message: "Status must be a string"})
    @MaxLength(50, {message: "Status cannot exceed 50 characters"})
    status?: string;
}
