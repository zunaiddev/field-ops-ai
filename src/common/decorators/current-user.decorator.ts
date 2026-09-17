import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {AuthenticatedRequest} from "../guards/auth-guard.guard.js";

export const CurrentUser =
    createParamDecorator((data: string | undefined, context: ExecutionContext): any => {
        const request: AuthenticatedRequest = context.switchToHttp().getRequest<AuthenticatedRequest>();
        return request.user;
    });