import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {Organization} from "../../modules/orgnization/entity/organization.entity.js";
import {OrgAuthenticatedReq} from "../guards/org.guard.js";

export const CurrentOrg =
    createParamDecorator((_, ctx: ExecutionContext): Organization => {
        const request = ctx.switchToHttp().getRequest<OrgAuthenticatedReq>();

        return request.organization;
    });