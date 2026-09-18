import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {OrganizationMember} from "../../modules/orgnization-member/entity/organization-member.entity.js";
import {OrgAuthenticatedReq} from "../guards/org.guard.js";

export const CurrentMember =
    createParamDecorator((data, ctx: ExecutionContext): OrganizationMember => {
        const request = ctx.switchToHttp().getRequest<OrgAuthenticatedReq>();

        return request.member;
    });