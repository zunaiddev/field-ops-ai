import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    Logger,
    UnauthorizedException
} from '@nestjs/common';
import {OrganizationMemberService} from "../../modules/orgnization-member/organization-member.service.js";
import {Organization} from "../../modules/orgnization/entity/organization.entity.js";
import {
    OrganizationMember,
    OrganizationRole
} from "../../modules/orgnization-member/entity/organization-member.entity.js";
import {JwtAuthenticatedRequest} from "./jwt.guard.js";
import {CustomJwtPayload} from "../../modules/jwt/jwt.types.js";

export interface OrgAuthenticatedReq extends JwtAuthenticatedRequest {
    organization: Organization,
    member: OrganizationMember,
}

@Injectable()
export class OrgGuard implements CanActivate {
    private readonly logger: Logger

    constructor(private readonly orgMemberService: OrganizationMemberService) {
        this.logger = new Logger(OrgGuard.name);
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: OrgAuthenticatedReq = context.switchToHttp().getRequest<OrgAuthenticatedReq>();

        const {sub: userId}: CustomJwtPayload = request.payload;

        const member: OrganizationMember = await this.orgMemberService.getFullMemberByUserId(userId);

        if (!(member && member.user && member.user.emailVerifiedAt)) {
            throw new UnauthorizedException("Could not find user or user email not verified");
        }

        if (!(member.role === OrganizationRole.ORG_OWNER || member.role === OrganizationRole.ORG_ADMIN)) {
            throw new ForbiddenException("You are not authorized to access this resource");
        }

        if (!member.organization) {
            throw new UnauthorizedException("Could not find any organization for this user");
        }

        request.member = member;
        request.organization = member.organization;

        this.logger.debug("Request Processes by Organization Guard");
        return true;
    }
}