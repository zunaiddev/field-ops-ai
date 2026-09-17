import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {OrganizationMember} from "../../modules/orgnization-member/entity/organization-member.entity.js";
import {AuthenticatedRequest} from "../guards/auth-guard.guard.js";

export const CurrentMember =
    createParamDecorator((data, ctx: ExecutionContext): OrganizationMember => {
        const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();

        return request.member;
    });