import {Injectable, UnauthorizedException} from "@nestjs/common";
import jwt from "jsonwebtoken";
import {ConfigService} from "@nestjs/config";
import {CustomJwtPayload, JwtType} from "./jwt.types.js";
import {randomUUID} from "node:crypto";
import {OrganizationRole} from "../orgnization-member/entity/organization-member.entity.js";
import {ErrorCode} from "../../common/enums/error-code.enum.js";

@Injectable()
export class JwtService {
    private readonly SECRET: string;

    constructor(configService: ConfigService) {
        this.SECRET = configService.getOrThrow<string>("jwt.secret");
    }

    private generateToken(
        subject: string,
        type: JwtType,
        expiry: jwt.SignOptions["expiresIn"],
        details?: object,
    ): string {
        return jwt.sign({...details, type, jti: randomUUID()}, this.SECRET, {
            algorithm: "HS256",
            expiresIn: expiry,
            subject,
        });
    }

    orgAccessToken(userId: string, orgId: string, role: OrganizationRole): string {
        return this.generateToken(userId, JwtType.AUTH, "15m", {
            orgId, role
        });
    }

    orgRefreshToken(userId: string, orgId: string, role: OrganizationRole): string {
        return this.generateToken(userId, JwtType.REFRESH, "30d", {
            orgId, role
        });
    }

    generateAccessToken(id: string): string {
        return this.generateToken(id, JwtType.AUTH, "15m");
    }

    generateRefreshToken(id: string): string {
        return this.generateToken(id, JwtType.REFRESH, "30d");
    }

    generateResetPasswordToken(email: string): string {
        return this.generateToken(email, JwtType.RESET_PASSWORD, "30d");
    }

    generateEmailVerifyToken(id: string): string {
        return this.generateToken(id, JwtType.VERIFY_EMAIL, "15m");
    }

    validateToken(token: string, type: JwtType): CustomJwtPayload {
        let payload: string | jwt.JwtPayload;
        try {
            payload = jwt.verify(token, this.SECRET);
        } catch (e: any) {
            if (e instanceof jwt.TokenExpiredError) {
                throw new UnauthorizedException({
                    message: "Token has expired",
                    errorCode: ErrorCode.TOKEN_EXPIRED,
                });
            }
            throw new UnauthorizedException({
                message: "Invalid token",
                errorCode: ErrorCode.INVALID_TOKEN,
            });
        }

        if (typeof payload === "string" || !payload || !payload.sub || !payload.jti) {
            throw new UnauthorizedException({
                message: "Invalid token",
                errorCode: ErrorCode.INVALID_TOKEN,
            });
        }

        if (payload.type !== type) {
            throw new UnauthorizedException({
                message: "Invalid token type",
                errorCode: ErrorCode.INVALID_TOKEN_TYPE,
            });
        }

        return {
            sub: payload.sub,
            type: payload.type,
            jti: payload.jti,
            orgId: payload.orgId,
            role: payload.role,
        };
    }
}
