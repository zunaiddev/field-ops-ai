import {CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {OrganizationRole} from "../../modules/orgnization-member/entity/organization-member.entity.js";
import {OrgAuthenticatedReq} from "./org.guard.js";
import {ROLES_KEY} from "../decorators/roles.decorator.js";

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

        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const request =
            context.switchToHttp().getRequest<OrgAuthenticatedReq>();

        const member = request.member;

        if (!member) {
            throw new UnauthorizedException('Organization member not found');
        }

        if (!requiredRoles.includes(member.role)) {
            throw new ForbiddenException(
                'You are not authorized to access this resource',
            );
        }

        return true;
    }
}