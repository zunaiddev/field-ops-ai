import {Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Res} from '@nestjs/common';
import {VerifyService} from "./verify.service.js";
import {Public} from "../../common/decorators/public.decorator.js";
import type {Response} from "express";
import {ResetPasswordDto, VerifyTokenQueryDto} from "./dto/verify-reset-password.dto.js";

@Public()
@Controller('verify')
export class VerifyController {
    constructor(private readonly verifyService: VerifyService) {
    }

    @Get('/email')
    async verifyEmail(@Query('token') token: string, @Res({passthrough: true}) res: Response) {
        return await this.verifyService.verifyEmail(token);
    }

    @Get('/reset-password')
    async verifyResetPasswordToken(@Query() {token}: VerifyTokenQueryDto) {
        return await this.verifyService.verifyResetPasswordToken(token);
    }

    @Post('/reset-password')
    @HttpCode(HttpStatus.OK)
    async resetPassword(@Body() dto: ResetPasswordDto) {
        return await this.verifyService.resetPassword(dto.token, dto.password);
    }
}
