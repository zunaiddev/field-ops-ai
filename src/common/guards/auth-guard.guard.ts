import {CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import {Reflector} from "@nestjs/core";
import {IS_PUBLIC_KEY} from "../decorators/public.decorator.js";
import {Request} from "express";
import {User} from "../../modules/users/entity/user.entity.js";
import {JwtService} from "../../modules/jwt/jwt.service.js";

import {CustomJwtPayload, JwtType} from "../../modules/jwt/jwt.types.js";
import {OrganizationMemberService} from "../../modules/orgnization-member/organization-member.service.js";
import {Organization} from "../../modules/orgnization/entity/organization.entity.js";
import {OrganizationMember} from "../../modules/orgnization-member/entity/organization-member.entity.js";

export interface AuthenticatedRequest extends Request {
    user: User,
    organization: Organization,
    member: OrganizationMember,
    jti: string
}

@Injectable()
export class AuthGuard implements CanActivate {
    private readonly logger: Logger;

    constructor(private readonly reflector: Reflector,
                private readonly jwtService: JwtService,
                private readonly organizationMemberService: OrganizationMemberService) {
        this.logger = new Logger(AuthGuard.name);
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if (isPublic) {
            this.logger.log("Skipped Auth Guard");
            return true;
        }

        const request: AuthenticatedRequest = context.switchToHttp().getRequest<AuthenticatedRequest>();

        const authHeader: string | undefined = request.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException("Auth header is missing");
        }

        const [type, token] = authHeader.split(' ');

        if (type !== "Bearer" || !token) {
            throw new UnauthorizedException("Missing or invalid Bearer token");
        }

        const payload: CustomJwtPayload = this.jwtService.validateToken(token, JwtType.AUTH);

        const member: OrganizationMember = await this.organizationMemberService.getFullMemberByUserId(payload.sub);

        if (!(member && member.user && member.user.emailVerifiedAt)) {
            throw new UnauthorizedException("Could not find user or user email not verified");
        }

        if (!member.organization) {
            throw new UnauthorizedException("Could not find any organization for this user");
        }

        request.member = member;
        request.user = member.user;
        request.organization = member.organization;

        return true;
    }
}