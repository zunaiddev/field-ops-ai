import {
    BadRequestException,
    ConflictException,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import {RegistrationReq} from "./dto/signup-req.dto.js";
import {RegistrationRes} from "./dto/signup-res.dto.js";
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
import orgNameToSlug from "../../utils/orgNameToSlug.js";
import {OrganizationService} from "../orgnization/organization.service.js";
import {Organization} from "../orgnization/entity/organization.entity.js";
import {OrganizationMemberService} from "../orgnization-member/organization-member.service.js";
import {OrganizationMember, OrganizationRole} from "../orgnization-member/entity/orgnization-member.entity.js";
import {DataSource, EntityManager} from "typeorm";
import {InjectDataSource} from "@nestjs/typeorm";

@Injectable()
export class AuthService {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly organizationService: OrganizationService,
        private readonly organizationMemberService: OrganizationMemberService,
        private readonly cacheService: CacheService,
    ) {
    }

    async register(req: RegistrationReq): Promise<RegistrationRes> {
        const {email} = req;

        const existingUser: User | null = await this.userService.findByEmail(email);

        if (existingUser) {
            throw new ConflictException(`user with ${email} already exists`);
        }

        const slug: string = req.orgSlug ?? orgNameToSlug(req.orgName);

        if (await this.organizationService.existsBySlug(slug)) {
            throw new ConflictException({message: `organization with ${slug} already exists`, slug});
        }

        const {
            user,
            organization,
        } = await this.dataSource.transaction(async (manager: EntityManager) => {
            const user: User = await this.userService.save({
                firstName: req.firstName,
                lastName: req.lastName,
                email: req.email,
                passwordHash: await argon2.hash(req.password)
            }, manager);

            const organization: Organization = await this.organizationService.save({
                name: req.orgName,
                slug: slug,
                currency: req.currency,
                timezone: req.timezone,
            }, manager);

            const organizationMember: OrganizationMember = await this.organizationMemberService.save({
                organization: organization,
                user: user,
                role: OrganizationRole.ORG_OWNER
            }, manager);

            return {user, organization, organizationMember};
        });

        const emailToken: string = this.jwtService.generateEmailVerifyToken(user.id);

        console.log("Email Verification token: ", emailToken);

        return new RegistrationRes({...user, organizationId: organization.id});
    }

    async login(req: LoginReq): Promise<AuthRes> {
        const user: User | null = await this.userService.findByEmail(req.email);

        if (!user) {
            throw new BadRequestException(`could not find user with ${req.email}`);
        }

        if (!user.emailVerifiedAt) {
            throw new UnauthorizedException("Please verify your email first to login");
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

        const user: User | null = await this.userService.findByEmail(email);

        if (!user) {
            throw new BadRequestException(`user with ${email} does not exists`);
        }

        if (user.emailVerifiedAt) {
            throw new BadRequestException(`user with ${email} has been verified`);
        }

        await this.cacheService.set(CacheKeys.resendVerifyEmail(email),
            Date.now().toString(), TTL.ofMinutes(3));

        const token: string = this.jwtService.generateEmailVerifyToken(user.id);
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