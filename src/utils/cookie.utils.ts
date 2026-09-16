import {Response} from "express";
import {TTL} from "../modules/cache/cache.service.js";

export function setRefreshCookie(res: Response, refreshToken: string) {
    res.cookie('refresh-token', refreshToken, {
        expires: new Date(Date.now() + TTL.ofDays(30)),
        httpOnly: true,
        secure: false,
        path: '/'
    });
}

export function removeRefreshCookie(res: Response) {
    res.cookie('refresh-token', "", {
        expires: new Date(),
        httpOnly: true,
        secure: false,
        path: '/'
    });
}