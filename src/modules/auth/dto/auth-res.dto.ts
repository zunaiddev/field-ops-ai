import {Exclude, Expose} from "class-transformer";
import {Employee} from "../../users/entity/employee.entity.js";

@Exclude()
export class AuthRes {
    @Expose()
    id: string;

    @Expose()
    email: string;

    @Expose()
    accessToken: string;

    refreshToken: string;

    constructor(user: Employee, accessToken: string, refreshToken: string) {
        this.id = user.id;
        this.email = user.email;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}