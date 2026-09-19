import {IsInt, IsOptional, IsString, Max, Min} from "class-validator";
import {Type} from "class-transformer";
import {Trim} from "../../../common/decorators/transform.decorators.js";

export class GetCustomersQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt({message: "Page must be an integer"})
    @Min(1, {message: "Page must be at least 1"})
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt({message: "Page size must be an integer"})
    @Min(1, {message: "Page size must be at least 1"})
    @Max(100, {message: "Page size cannot exceed 100"})
    pageSize?: number;

    @Trim()
    @IsOptional()
    @IsString({message: "Name must be a string"})
    name?: string;

    @Trim()
    @IsOptional()
    @IsString({message: "Email must be a string"})
    email?: string;
}
