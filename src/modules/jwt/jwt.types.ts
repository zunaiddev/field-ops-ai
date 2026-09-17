export interface CustomJwtPayload {
    sub: string;
    type: JwtType;
    jti: string;
    details?: object;
}

export enum JwtType {
    AUTH = 'AUTH',
    REFRESH = 'REFRESH',
    VERIFY_EMAIL = 'VERIFY_EMAIL',
    RESET_PASSWORD = 'RESET_PASSWORD',
}