import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {JwtAuthenticatedRequest} from "../guards/jwt.guard.js";
import {CustomJwtPayload} from "../../modules/jwt/jwt.types.js";

export const CurrentJwtPayload =
    createParamDecorator((_, ctx: ExecutionContext): CustomJwtPayload => {
        const request = ctx.switchToHttp().getRequest<JwtAuthenticatedRequest>();

        return request.payload;
    });