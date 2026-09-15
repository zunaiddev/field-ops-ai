import {Injectable} from '@nestjs/common';
import jwt from 'jsonwebtoken';
import {ConfigService} from "@nestjs/config";
import {JwtType} from "./jwt.types.js";

@Injectable()
export class JwtService {
    private readonly SECRET: string;

    constructor(configService: ConfigService) {
        this.SECRET = configService.getOrThrow<string>("jwt.secret");
    }

    private generateToken(subject: string, type: JwtType, expiry: jwt.SignOptions["expiresIn"], details?: object,): string {
        return jwt.sign({...details, type}, this.SECRET,
            {algorithm: 'HS256', expiresIn: expiry, subject},);
    }

    generateAuthToken(id:string):string{
        return this.generateToken(id, JwtType.AUTH, '15m');
    }

    generateRefreshToken(id:string):string{
        return this.generateToken(id, JwtType.REFRESH, '30d');
    }

    generateResetPasswordToken(email: string){
        return this.generateToken(email, JwtType.RESET_PASSWORD, '30d');
    }

    generateEmailVerifyToken(email: string){
        return this.generateToken(email, JwtType.VERIFY_EMAIL, '15m');
    }
}
