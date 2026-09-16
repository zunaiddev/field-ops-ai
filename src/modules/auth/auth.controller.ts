import {Body, Controller, HttpCode, HttpStatus, Post, Query} from '@nestjs/common';
import {AuthService} from './auth.service.js';
import {SignupReq} from './dto/signup-req.dto.js';
import {SignupRes} from './dto/signup-res.dto.js';
import {LoginReq} from './dto/login-req.dto.js';
import {AuthRes} from './dto/auth-res.dto.js';
import {EmailRes} from './dto/email-res.dto.js';
import {ResendEmailReq} from './dto/resend-email-req.dto.js';
import {Public} from '../../common/decorators/public.decorator.js';

@Public()
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    async signup(@Body() req: SignupReq): Promise<SignupRes> {
        return await this.authService.signup(req);
    }

    @Post('login')
    async login(@Body() req: LoginReq): Promise<AuthRes> {
        return await this.authService.login(req);
    }

    @Post('resend-email')
    async resendVerifyEmail(@Query() { email }: ResendEmailReq): Promise<EmailRes> {
        return await this.authService.resendVerifyEmail(email);
    }
}
