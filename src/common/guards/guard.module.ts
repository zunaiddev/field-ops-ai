import {Global, Module} from "@nestjs/common";
import {OrganizationMemberModule} from "../../modules/orgnization-member/organization-member.module.js";
import {OrgGuard} from "./org.guard.js";
import {RolesGuard} from "./roles.guard.js";

@Global()
@Module({
    imports: [OrganizationMemberModule],
    providers: [OrgGuard, RolesGuard],
    exports: [OrgGuard, RolesGuard],
})
export class GuardModule {
}