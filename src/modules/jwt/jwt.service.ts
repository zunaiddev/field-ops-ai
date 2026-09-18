import {Injectable, UnauthorizedException} from "@nestjs/common";
import jwt from "jsonwebtoken";
import {ConfigService} from "@nestjs/config";
import {CustomJwtPayload, JwtType} from "./jwt.types.js";
import {randomUUID} from "node:crypto";
import {OrganizationRole} from "../orgnization-member/entity/organization-member.entity.js";

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

    /**
     * Expires in 15 minutes
     */
    orgAccessToken(userId: string, orgId: string, role: OrganizationRole): string {
        return this.generateToken(userId, JwtType.AUTH, "15m", {
            orgId, role
        });
    }

    /**
     * Expires in 30 Days
     */
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

    /**
     * expires in 15 minutes
     * @param id - user id for token
     */
    generateEmailVerifyToken(id: string): string {
        return this.generateToken(id, JwtType.VERIFY_EMAIL, "15m");
    }

    validateToken(token: string, type: JwtType): CustomJwtPayload {
        let payload: string | jwt.JwtPayload;
        try {
            payload = jwt.verify(token, this.SECRET);
        } catch (e: any) {
            if (e instanceof jwt.TokenExpiredError) {
                throw new UnauthorizedException("Token has expired");
            }
            throw new UnauthorizedException("Invalid token");
        }

        if (typeof payload === "string" || !payload || !payload.sub || !payload.jti) {
            throw new UnauthorizedException("Invalid token");
        }

        if (payload.type !== type) {
            throw new UnauthorizedException("Invalid token type");
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
