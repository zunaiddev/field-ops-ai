import { Exclude, Expose } from "class-transformer";

@Exclude()
export class SignupRes {
  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  constructor(req: SignupRes) {
    this.email = req.email;
    this.firstName = req.firstName;
    this.lastName = req.lastName;
  }
}