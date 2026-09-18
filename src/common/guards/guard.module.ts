import {Module} from "@nestjs/common";
import {OrganizationMemberModule} from "../../modules/orgnization-member/organization-member.module.js";
import {OrgGuard} from "./org.guard.js";

@Module({
    imports: [OrganizationMemberModule],
    providers: [OrgGuard],
    exports: [OrgGuard],
})
export class GuardModule {
}