import {IsNotEmpty, IsString, MaxLength} from "class-validator";

export class UpdateStatusReq {
    @IsNotEmpty()
    @IsString()
    @MaxLength(100, {message: "availabilityStatus should not be more than 100"})
    status: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(100, {message: "availabilityStatus should not be more than 100"})
    availabilityStatus: string;
}