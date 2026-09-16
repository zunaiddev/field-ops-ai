import {Controller, Patch, Query, Res} from '@nestjs/common';
import {VerifyService} from "./verify.service.js";
import {Public} from "../../common/decorators/public.decorator.js";
import {AuthRes} from "../auth/dto/auth-res.dto.js";
import {setRefreshCookie} from "../../utils/cookie.utils.js";
import type {Response} from "express";

@Public()
@Controller('verify')
export class VerifyController {
    constructor(private readonly verifyService: VerifyService) {
    }

    @Patch('/email')
    async verifyEmail(@Query('token') token: string, @Res({passthrough: true}) res: Response): Promise<AuthRes> {
        const response: AuthRes = await this.verifyService.verifyEmail(token);

        setRefreshCookie(res, response.refreshToken);

        return response;
    }
}