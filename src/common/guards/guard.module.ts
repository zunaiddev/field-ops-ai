import {Global, Module} from "@nestjs/common";
import {OrgGuard} from "./org.guard.js";
import {RolesGuard} from "./roles.guard.js";
import {CustomerModule} from "../../modules/customer/customer.module.js";
import {CustomerGuard} from "./customer.guard.js";

@Global()
@Module({
    imports: [CustomerModule],
    providers: [OrgGuard, RolesGuard, CustomerGuard],
    exports: [OrgGuard, RolesGuard, CustomerGuard],
})
export class GuardModule {
}