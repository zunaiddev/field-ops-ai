import {Module} from '@nestjs/common';
import {VerifyService} from './verify.service.js';
import {VerifyController} from './verify.controller.js';
import {JwtModule} from "../jwt/jwt.module.js";
import {UsersModule} from "../users/users.module.js";

@Module({
    imports: [JwtModule, UsersModule],
    providers: [VerifyService],
    controllers: [VerifyController]
})
export class VerifyModule {
}
