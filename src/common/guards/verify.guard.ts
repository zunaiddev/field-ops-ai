import {CanActivate, ExecutionContext} from "@nestjs/common";
import {JwtService} from "../../modules/jwt/jwt.service.js";

export class VerifyGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {
    }

    canActivate(context: ExecutionContext): boolean {
        const ctx = context.switchToHttp();

        return true;
    }
}