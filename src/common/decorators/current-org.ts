import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {Organization} from "../../modules/orgnization/entity/organization.entity.js";
import {AuthenticatedRequest} from "../guards/auth-guard.guard.js";

export const CurrentOrg =
    createParamDecorator((data, ctx: ExecutionContext): Organization => {
        const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();

        return request.organization;
    });