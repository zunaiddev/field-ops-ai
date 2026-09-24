import {Exclude, Expose} from "class-transformer";

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

    constructor({id, email, role}: { id: number, email: string, role: string },
                accessToken: string, refreshToken: string) {
        this.id = id;
        this.email = email;
        this.role = role;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}