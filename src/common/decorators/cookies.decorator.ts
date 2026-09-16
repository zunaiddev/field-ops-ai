import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import type {Request} from 'express';

export const Cookies = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<Request>();
        if (request.cookies) {
            return data ? request.cookies[data] : request.cookies;
        }

        const rawCookies = request.headers.cookie;
        if (!rawCookies) {
            return undefined;
        }

        const parsedCookies = Object.fromEntries(
            rawCookies.split(';').map((c) => {
                const [key, ...v] = c.trim().split('=');
                return [key, decodeURIComponent(v.join('='))];
            }),
        );

        return data ? parsedCookies[data] : parsedCookies;
    },
);

export const Cookie = Cookies;
