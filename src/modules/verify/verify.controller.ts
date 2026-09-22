import {Controller, Get, Query, Res} from '@nestjs/common';
import {VerifyService} from "./verify.service.js";
import {Public} from "../../common/decorators/public.decorator.js";
import type {Response} from "express";

@Public()
@Controller('verify')
export class VerifyController {
    constructor(private readonly verifyService: VerifyService) {
    }

    @Get('/email')
    async verifyEmail(@Query('token') token: string, @Res({passthrough: true}) res: Response) {
        return await this.verifyService.verifyEmail(token);
    }
}