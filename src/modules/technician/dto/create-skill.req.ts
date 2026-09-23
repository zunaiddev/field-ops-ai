import {IsNotEmpty, IsString, MaxLength} from "class-validator";
import {Trim} from "../../../common/decorators/transform.decorators.js";

export class CreateSkillReq {
    @Trim()
    @IsNotEmpty({message: "Name is required"})
    @IsString({message: "Name must be a string"})
    @MaxLength(150, {message: "Name cannot exceed 150 characters"})
    name: string;

    @Trim()
    @IsString({message: "Description must be a string"})
    description: string;
}
