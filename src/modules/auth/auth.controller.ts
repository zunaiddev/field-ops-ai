import {Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Res} from '@nestjs/common';
import {AuthService} from './auth.service.js';
import {SignupReq} from './dto/signup-req.dto.js';
import {SignupRes} from './dto/signup-res.dto.js';
import {LoginReq} from './dto/login-req.dto.js';
import {AuthRes} from './dto/auth-res.dto.js';
import {EmailRes} from './dto/email-res.dto.js';
import {ResendEmailReq} from './dto/resend-email-req.dto.js';
import {Public} from '../../common/decorators/public.decorator.js';
import {Cookies} from '../../common/decorators/cookies.decorator.js';
import type {Response} from "express";
import {removeRefreshCookie, setRefreshCookie} from "../../utils/cookie.utils.js";
import {RefreshTokenRes} from "./dto/refresh-token-res.dto.js";

@Public()
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('signup')
    async signup(@Body() req: SignupReq): Promise<SignupRes> {
        return await this.authService.signup(req);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() req: LoginReq, @Res({passthrough: true}) res: Response): Promise<AuthRes> {
        const response: AuthRes = await this.authService.login(req);

        setRefreshCookie(res, response.refreshToken);

        return response;
    }

    @Get('resend-email')
    async resendVerifyEmail(@Query() {email}: ResendEmailReq): Promise<EmailRes> {
        return await this.authService.resendVerifyEmail(email);
    }

    @Get('refresh-token')
    async refreshToken(@Cookies('refresh-token') token: string): Promise<RefreshTokenRes> {
        return await this.authService.refreshToken(token);
    }

    @Get('logout')
    logout(@Res() res: Response): void {
        removeRefreshCookie(res);
    }
}
