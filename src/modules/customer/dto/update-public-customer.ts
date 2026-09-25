import {CleanName, Trim} from "../../../common/decorators/transform.decorators.js";
import {IsNotEmpty, IsString, MaxLength} from "class-validator";

export class UpdatePublicCustomer {
    @CleanName()
    @IsNotEmpty({message: "Name is required"})
    @IsString({message: "Name must be a string"})
    @MaxLength(150, {message: "Name cannot exceed 150 characters"})
    name: string;

    @Trim()
    @IsString({message: "Phone number must be a string"})
    @MaxLength(30, {message: "Phone number cannot exceed 30 characters"})
    phone: string;
}