import { Injectable, UnauthorizedException } from "@nestjs/common";
import jwt from "jsonwebtoken";
import { ConfigService } from "@nestjs/config";
import { JwtPayload, JwtType } from "./jwt.types.js";

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
    return jwt.sign({ ...details, type }, this.SECRET, {
      algorithm: "HS256",
      expiresIn: expiry,
      subject,
    });
  }

  generateAuthToken(id: string): string {
    return this.generateToken(id, JwtType.AUTH, "15m");
  }

  generateRefreshToken(id: string): string {
    return this.generateToken(id, JwtType.REFRESH, "30d");
  }

  generateResetPasswordToken(email: string): string {
    return this.generateToken(email, JwtType.RESET_PASSWORD, "30d");
  }

  generateEmailVerifyToken(email: string): string {
    return this.generateToken(email, JwtType.VERIFY_EMAIL, "15m");
  }

  validateToken(token: string, type: JwtType): JwtPayload {
    const payload = jwt.verify(token, this.SECRET);

    if (typeof payload === "string") {
      throw new UnauthorizedException("Invalid token");
    }

    return { sub: "email", type: type };
  }
}
