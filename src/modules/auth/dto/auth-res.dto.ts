import {Exclude, Expose} from "class-transformer";
import {Employee} from "../../employee/entity/employee.entity.js";

@Exclude()
export class AuthRes {
    @Expose()
    id: number;

    @Expose()
    email: string;

    @Expose()
    accessToken: string;

    @Expose()
    role: string;

    refreshToken: string;

    constructor(employee: Employee, accessToken: string, refreshToken: string) {
        this.id = employee.id;
        this.email = employee.email;
        this.role = employee.role;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}