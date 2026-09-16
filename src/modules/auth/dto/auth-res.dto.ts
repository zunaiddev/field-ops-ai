import { Exclude, Expose } from "class-transformer";
import { User } from "../../users/entity/user.entity.js";

@Exclude()
export class AuthRes {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  accessToken: string;

  refreshToken: string;

  constructor(user: User, accessToken: string, refreshToken: string) {
    this.id = user.id;
    this.email = user.email;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}