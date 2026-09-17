import {Exclude, Expose} from "class-transformer";
import {User} from "../entity/user.entity.js";
import {OrganizationRole} from "../../orgnization-member/entity/organization-member.entity.js";

@Exclude()
export class UserDto {
    @Expose()
    id: string;

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

    constructor(user: User, role?: OrganizationRole | string) {
        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.status = user.status;
        this.role = role;
        this.emailVerifiedAt = user.emailVerifiedAt;
        this.lastLoginAt = user.lastLoginAt;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }
}
