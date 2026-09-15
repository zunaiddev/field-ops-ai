import {Module} from "@nestjs/common";
import {AuthGuard} from "./auth-guard.guard.js";

@Module({
    providers: [AuthGuard],
    exports: [AuthGuard],
})
export class GuardModule {}