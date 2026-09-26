import {CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {OrganizationRole} from "../../modules/orgnization-member/entity/organization-member.entity.js";
import {OrgAuthenticatedReq} from "./org.guard.js";
import {ROLES_KEY} from "../decorators/roles.decorator.js";
import {ErrorCode} from "../enums/error-code.enum.js";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {
    }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles =
            this.reflector.getAllAndOverride<OrganizationRole[]>(
                ROLES_KEY,
                [context.getHandler(), context.getClass()],
            );

        console.log("Required Roles", requiredRoles);

        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const request =
            context.switchToHttp().getRequest<OrgAuthenticatedReq>();

        const member = request.member;

        if (!member) {
            throw new UnauthorizedException({
                message: 'Organization member not found',
                errorCode: ErrorCode.MEMBER_NOT_FOUND,
            });
        }


        if (!requiredRoles.includes(member.role)) {
            throw new ForbiddenException({
                message: 'You are not authorized to access this resource',
                errorCode: ErrorCode.FORBIDDEN_RESOURCE,
            });
        }

        return true;
    }
}
