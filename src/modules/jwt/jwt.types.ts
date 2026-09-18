export interface CustomJwtPayload {
    sub: string;
    type: JwtType;
    orgId: string;
    role: string;
    jti: string;
}

export enum JwtType {
    AUTH = 'AUTH',
    REFRESH = 'REFRESH',
    VERIFY_EMAIL = 'VERIFY_EMAIL',
    RESET_PASSWORD = 'RESET_PASSWORD',
}