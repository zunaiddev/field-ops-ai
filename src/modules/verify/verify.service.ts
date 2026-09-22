import {BadRequestException, Injectable} from '@nestjs/common';
import {JwtService} from "../jwt/jwt.service.js";
import {CustomJwtPayload, JwtType} from "../jwt/jwt.types.js";
import {Public} from "../../common/decorators/public.decorator.js";
import {CacheService, TTL} from "../cache/cache.service.js";
import {CacheKeys} from "../../utils/cache.keys.utils.js";
import {EmployeeService} from "../employee/employee.service.js";
import {Employee} from "../employee/entity/employee.entity.js";
import {ErrorCode} from "../../common/enums/error-code.enum.js";

@Public()
@Injectable()
export class VerifyService {

    constructor(private readonly cacheService: CacheService,
                private readonly jwtService: JwtService,
                private readonly userService: EmployeeService) {
    }

    async verifyEmail(token: string) {
        const payload: CustomJwtPayload = this.jwtService.validateToken(token, JwtType.VERIFY_EMAIL);

        if (await this.cacheService.exists(CacheKeys.usedToken(payload.jti))) {
            throw new BadRequestException({
                message: "user has already been verified",
                errorCode: ErrorCode.USER_ALREADY_VERIFIED,
            });
        }

        const user: Employee | null = await this.userService.findById(Number(payload.sub));

        if (!user) {
            throw new BadRequestException({
                message: "user not found",
                errorCode: ErrorCode.USER_NOT_FOUND,
            });
        }

        if (user.emailVerifiedAt) {
            throw new BadRequestException({
                message: "user already verified",
                errorCode: ErrorCode.USER_ALREADY_VERIFIED,
            });
        }

        user.emailVerifiedAt = new Date();

        await this.userService.update(user);

        await this.cacheService.set(CacheKeys.usedToken(payload.jti), {email: user.email}, TTL.ofMinutes(16));

        return {message: "Verified"};
    }
}
