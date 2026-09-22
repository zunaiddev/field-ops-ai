import {CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException} from "@nestjs/common";
import {Request} from "express";
import {CustomJwtPayload, JwtType} from "../../modules/jwt/jwt.types.js";
import {IS_PUBLIC_KEY} from "../decorators/public.decorator.js";
import {Reflector} from "@nestjs/core";
import {JwtService} from "../../modules/jwt/jwt.service.js";
import {ErrorCode} from "../enums/error-code.enum.js";

export interface JwtAuthenticatedRequest extends Request {
    payload: CustomJwtPayload;
}

@Injectable()
export class JwtGuard implements CanActivate {
    private readonly logger: Logger;

    constructor(private readonly reflector: Reflector,
                private readonly jwtService: JwtService) {
        this.logger = new Logger(JwtGuard.name);
    }

    canActivate(context: ExecutionContext): boolean {
        const isPublic: boolean = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if (isPublic) {
            this.logger.log("Skipped Auth Guard");
            return true;
        }

        const request: JwtAuthenticatedRequest = context.switchToHttp().getRequest<JwtAuthenticatedRequest>();

        const authHeader: string | undefined = request.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException({
                message: "Auth header is missing",
                errorCode: ErrorCode.AUTH_HEADER_MISSING,
            });
        }

        const [type, token] = authHeader.split(' ');

        if (type !== "Bearer" || !token) {
            throw new UnauthorizedException({
                message: "Missing or invalid Bearer token",
                errorCode: ErrorCode.INVALID_BEARER_TOKEN,
            });
        }

        request.payload = this.jwtService.validateToken(token, JwtType.AUTH);

        console.log(request.payload);

        this.logger.debug("Request Processes by Jwt Guard");

        return true;
    }
}
