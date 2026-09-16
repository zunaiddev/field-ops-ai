import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
} from "class-validator";
import {
  CleanEmail,
} from "../../../common/decorators/transform.decorators.js";

export class ResendEmailReqDto {
  @CleanEmail()
  @IsNotEmpty({ message: "Email is required" })
  @IsString({ message: "Email must be a string" })
  @IsEmail({}, { message: "Please provide a valid email address" })
  @MaxLength(255, { message: "Email cannot exceed 255 characters" })
  email: string;
}

export { ResendEmailReqDto as ResendEmailReq };
