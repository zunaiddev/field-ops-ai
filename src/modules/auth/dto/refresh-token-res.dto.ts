import {Exclude, Expose} from "class-transformer";

@Exclude()
export class RefreshTokenRes {
    @Expose()
    id: string;

    @Expose()
    accessToken: string;

    constructor(id: string, accessToken: string) {
        this.id = id;
        this.accessToken = accessToken;
    }
}