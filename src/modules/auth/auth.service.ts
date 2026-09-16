import {
    BadRequestException,
    ConflictException,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import {SignupReq} from "./dto/signup-req.dto.js";
import {SignupRes} from "./dto/signup-res.dto.js";
import {UsersService} from "../users/users.service.js";
import {CacheService, TTL} from "../cache/cache.service.js";
import {JwtService} from "../jwt/jwt.service.js";
import {AuthRes} from "./dto/auth-res.dto.js";
import {LoginReq} from "./dto/login-req.dto.js";
import {User} from "../users/entity/user.entity.js";
import {EmailRes} from "./dto/email-res.dto.js";
import {CacheKeys} from "../../utils/cache.keys.utils.js";
import * as argon2 from "argon2";
import {JwtPayload, JwtType} from "../jwt/jwt.types.js";
import {RefreshTokenRes} from "./dto/refresh-token-res.dto.js";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly cacheService: CacheService,
    ) {
    }

    async signup(req: SignupReq): Promise<SignupRes> {
        const {email} = req;

        if (await this.userService.existsByEmail(email)) {
            throw new ConflictException(`user with ${email} already exists`);
        }

        await this.cacheService.set<SignupReq>(CacheKeys.unverifiedUser(email),
            {...req, password: await argon2.hash(req.password)},
            TTL.ofHours(5),
        );

        const emailToken: string = this.jwtService.generateEmailVerifyToken(email);

        console.log("Email Verification token: ", emailToken);

        return new SignupRes(req);
    }

    async login(req: LoginReq): Promise<AuthRes> {
        const user: User | null = await this.userService.findByEmail(req.email);

        if (!user) {
            const message: string = (await this.cacheService.get<SignupReq>(
                CacheKeys.unverifiedUser(req.email),
            ))
                ? "Please Verify your email address"
                : "User is not registered";

            throw new BadRequestException(message);
        }

        if (await this.cacheService.get<boolean>(CacheKeys.accountLocked(user.email))) {
            throw new HttpException(
                "Too many failed attempts try again after some time",
                HttpStatus.TOO_MANY_REQUESTS,
            );
        }

        if (!(await argon2.verify(user.passwordHash, req.password))) {
            const failedAttempts: number =
                (await this.cacheService.get<number>(CacheKeys.failedPasswordAttempts(user.email))) ?? 1;

            if (failedAttempts >= 5) {
                await this.cacheService.set<boolean>(
                    CacheKeys.accountLocked(user.email), true, TTL.ofMinutes(15));
                await this.cacheService.remove(CacheKeys.failedPasswordAttempts(user.email));
            } else {
                await this.cacheService.set<number>(CacheKeys.failedPasswordAttempts(user.email), failedAttempts + 1, TTL.ofHours(2));
            }

            throw new UnauthorizedException("Invalid password");
        }

        await this.cacheService.remove(CacheKeys.failedPasswordAttempts(user.email));
        await this.userService.update({...user, lastLoginAt: new Date()});

        const accessToken: string = this.jwtService.generateAccessToken(user.id);
        const refreshToken: string = this.jwtService.generateRefreshToken(user.id);

        return new AuthRes(user, accessToken, refreshToken);
    }

    async resendVerifyEmail(email: string): Promise<EmailRes> {
        if (await this.cacheService.get<string>(CacheKeys.resendVerifyEmail(email))) {
            throw new HttpException(
                "Please try again after some time",
                HttpStatus.TOO_MANY_REQUESTS,
            );
        }

        if (!(await this.cacheService.exists(CacheKeys.unverifiedUser(email)))) {
            throw new BadRequestException(`user with ${email} does not exists`);
        }

        await this.cacheService.set(CacheKeys.resendVerifyEmail(email),
            Date.now().toString(), TTL.ofMinutes(3));

        const token: string = this.jwtService.generateEmailVerifyToken(email);
        console.log("Resend verify email: ", token);

        return new EmailRes(email);
    }

    async refreshToken(token: string): Promise<RefreshTokenRes> {
        if (!token) {
            throw new UnauthorizedException("refresh-token cookie is missing");
        }

        const payload: JwtPayload = this.jwtService.validateToken(token, JwtType.REFRESH);
        const accessToken: string = this.jwtService.generateAccessToken(payload.sub);

        return new RefreshTokenRes(payload.sub, accessToken);
    }
}
