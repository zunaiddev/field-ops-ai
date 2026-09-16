import { IsBoolean, IsNotEmpty, IsString } from "class-validator";
import { CleanEmail } from "../../../common/decorators/transform.decorators.js";

export class LoginReq {
  @CleanEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsBoolean()
  remember: boolean;
}