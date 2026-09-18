import {Global, Module} from "@nestjs/common";
import {OrganizationMemberModule} from "../../modules/orgnization-member/organization-member.module.js";
import {OrgGuard} from "./org.guard.js";

@Global()
@Module({
    imports: [OrganizationMemberModule],
    providers: [OrgGuard],
    exports: [OrgGuard],
})
export class GuardModule {
}