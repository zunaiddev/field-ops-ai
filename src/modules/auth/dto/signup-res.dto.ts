import {Exclude, Expose} from "class-transformer";

@Exclude()
export class RegistrationRes {
    @Expose()
    email: string;

    @Expose()
    firstName: string;

    @Expose()
    lastName: string;

    @Expose()
    organizationId: number;

    constructor({email, firstName, lastName, organizationId}: RegistrationRes) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.organizationId = organizationId;
    }
}