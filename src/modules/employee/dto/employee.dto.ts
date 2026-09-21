import {Exclude, Expose} from "class-transformer";
import {Employee} from "../entity/employee.entity.js";
import {OrganizationRole} from "../../orgnization-member/entity/organization-member.entity.js";

@Exclude()
export class EmployeeDto {
    @Expose()
    id: number;

    @Expose()
    firstName: string;

    @Expose()
    lastName: string;

    @Expose()
    email: string;

    @Expose()
    status: string;

    @Expose()
    role?: OrganizationRole | string;

    @Expose()
    emailVerifiedAt: Date | null;

    @Expose()
    lastLoginAt: Date | null;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    constructor(employee: Employee, _?: OrganizationRole | string) {
        this.id = employee.id;
        this.firstName = employee.firstName;
        this.lastName = employee.lastName;
        this.email = employee.email;
        this.status = employee.status;
        this.role = employee.role;
        this.emailVerifiedAt = employee.emailVerifiedAt;
        this.lastLoginAt = employee.lastLoginAt;
        this.createdAt = employee.createdAt;
        this.updatedAt = employee.updatedAt;
    }
}
