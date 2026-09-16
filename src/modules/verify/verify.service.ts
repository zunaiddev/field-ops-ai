import {BadRequestException, Injectable} from '@nestjs/common';
import {JwtService} from "../jwt/jwt.service.js";
import {JwtPayload, JwtType} from "../jwt/jwt.types.js";
import {Public} from "../../common/decorators/public.decorator.js";
import {CacheService, TTL} from "../cache/cache.service.js";
import {CacheKeys} from "../../utils/cache.keys.utils.js";
import {UsersService} from "../users/users.service.js";
import {User} from "../users/entity/user.entity.js";
import {AuthRes} from "../auth/dto/auth-res.dto.js";

@Public()
@Injectable()
export class VerifyService {

    constructor(private readonly cacheService: CacheService,
                private readonly jwtService: JwtService,
                private readonly userService: UsersService) {
    }

    async verifyEmail(token: string): Promise<AuthRes> {
        const payload: JwtPayload = this.jwtService.validateToken(token, JwtType.VERIFY_EMAIL);

        if (await this.cacheService.exists(CacheKeys.usedToken(payload.jti))) {
            throw new BadRequestException("user has already been verified");
        }

        const response = await this.cacheService.get<any>(CacheKeys.unverifiedUser(payload.sub));

        if (!response) {
            throw new BadRequestException("user not found");
        }

        const user: User = new User();
        user.firstName = response.firstName;
        user.lastName = response.lastName;
        user.email = response.email;
        user.status = "ACTIVE";
        user.passwordHash = response.password;
        user.lastLoginAt = new Date();

        await this.userService.save(user);

        await this.cacheService.remove(CacheKeys.unverifiedUser(user.email));
        await this.cacheService.set(CacheKeys.usedToken(payload.jti), {email: response.email}, TTL.ofMinutes(15));

        const accessToken = this.jwtService.generateAccessToken(user.id);
        const refreshToken = this.jwtService.generateRefreshToken(user.id);

        return new AuthRes(user, accessToken, refreshToken);
    }
}