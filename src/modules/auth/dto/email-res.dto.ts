import { Exclude, Expose } from "class-transformer";

@Exclude()
export class EmailRes {
  @Expose()
  email: string;

  constructor(email: string) {
    this.email = email;
  }
}