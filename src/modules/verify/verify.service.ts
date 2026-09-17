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

        const user: User | null = await this.userService.findById(payload.sub);

        if (!user) {
            throw new BadRequestException(`user not found`);
        }

        if (user.emailVerifiedAt) {
            throw new BadRequestException("user already verified");
        }

        user.emailVerifiedAt = new Date();

        await this.userService.update(user);

        await this.cacheService.set(CacheKeys.usedToken(payload.jti), {email: user.email}, TTL.ofMinutes(16));

        const accessToken: string = this.jwtService.generateAccessToken(user.id);
        const refreshToken: string = this.jwtService.generateRefreshToken(user.id);

        return new AuthRes(user, accessToken, refreshToken);
    }
}