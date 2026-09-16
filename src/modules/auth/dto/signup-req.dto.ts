import {IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength,} from "class-validator";
import {CleanEmail, CleanName,} from "../../../common/decorators/transform.decorators.js";

export class SignupReqDto {
    @CleanName()
    @IsNotEmpty({message: "First name is required"})
    @IsString({message: "First name must be a string"})
    @MaxLength(100, {message: "First name cannot exceed 100 characters"})
    firstName: string;

    @CleanName()
    @IsNotEmpty({message: "Last name is required"})
    @IsString({message: "Last name must be a string"})
    @MaxLength(100, {message: "Last name cannot exceed 100 characters"})
    lastName: string;

    @CleanEmail()
    @IsNotEmpty({message: "Email is required"})
    @IsEmail({}, {message: "Please provide a valid email address"})
    @MaxLength(255, {message: "Email cannot exceed 255 characters"})
    email: string;

    @IsNotEmpty({message: "Password is required"})
    @IsString({message: "Password must be a string"})
    @MinLength(8, {message: "Password must be at least 8 characters long"})
    @MaxLength(64, {message: "Password cannot exceed 64 characters"})
    @IsStrongPassword(
        {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        },
        {
            message:
                "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
        },
    )
    password: string;
}

export {SignupReqDto as SignupReq};
