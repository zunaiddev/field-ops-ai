import {Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Res} from '@nestjs/common';
import {AuthService} from './auth.service.js';
import {RegistrationReq} from './dto/registration-req.dto.js';
import {RegistrationRes} from './dto/signup-res.dto.js';
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

    @Post('register')
    async signup(@Body() req: RegistrationReq): Promise<RegistrationRes> {
        return await this.authService.register(req);
    }

    @Post('login/')
    @HttpCode(HttpStatus.OK)
    async login(@Body() req: LoginReq, @Res({passthrough: true}) res: Response): Promise<AuthRes> {
        const response: AuthRes = await this.authService.login(req);

        setRefreshCookie(res, response.refreshToken);

        return response;
    }

    @Post('login/customer')
    @HttpCode(HttpStatus.OK)
    async customerLogin(@Body() req: LoginReq, @Res({passthrough: true}) res: Response): Promise<AuthRes> {
        const response: AuthRes = await this.authService.login(req, true);

        setRefreshCookie(res, response.refreshToken);

        return response;
    }

    @Post('/forgot-password/customer')
    async forgotPassword(@Query('email') email: string) {
        return await this.authService.forgotPassword(email, true);
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
    logout(@Res({passthrough: true}) res: Response): void {
        removeRefreshCookie(res);
    }
}