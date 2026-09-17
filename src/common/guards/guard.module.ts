import {Module} from "@nestjs/common";
import {AuthGuard} from "./auth-guard.guard.js";
import {OrganizationMemberModule} from "../../modules/orgnization-member/organization-member.module.js";

@Module({
    imports: [OrganizationMemberModule],
    providers: [AuthGuard],
    exports: [AuthGuard],
})
export class GuardModule {
}