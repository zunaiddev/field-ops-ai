import {Module} from '@nestjs/common';
import {UsersController} from "./users.controller.js";
import {UserService} from "./user.service.js";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./entity/user.entity.js";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UsersController],
    providers: [UserService],
    exports: [UserService],
})
export class UsersModule {
}
