import {Controller, Get} from '@nestjs/common';
import {Public} from "../common/decorators/public.decorator.js";
import {JwtService} from "../modules/jwt/jwt.service.js";

@Public()
@Controller('health')
export class HealthController {

    constructor(private readonly jwtService: JwtService) {}

    @Get()
    checkHealth(){
        return {message: "UP", timestamp: new Date().toISOString()};
    }

    @Get('test')
    getTest(){
        return {
            "auth": this.jwtService.generateAuthToken("1"),
            "refresh": this.jwtService.generateRefreshToken("1"),
            "resetPassword": this.jwtService.generateResetPasswordToken("john@gmail.com"),
            "verifyEmail": this.jwtService.generateEmailVerifyToken("john@gmail.com")
        }
    }
}