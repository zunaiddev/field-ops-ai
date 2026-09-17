import {Module} from "@nestjs/common";
import {AuthController} from "./auth.controller.js";
import {AuthService} from "./auth.service.js";
import {JwtModule} from "../jwt/jwt.module.js";
import {UsersModule} from "../users/users.module.js";
import {OrganisationModule} from "../orgnization/organisation.module.js";
import {OrganizationMemberModule} from "../orgnization-member/organization-member.module.js";

@Module({
    imports: [JwtModule, UsersModule, OrganisationModule, OrganizationMemberModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {
}
