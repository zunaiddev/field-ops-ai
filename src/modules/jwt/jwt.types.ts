export interface JwtPayload {
    sub: string;
    type: JwtType;
    details?: object;
}

export enum JwtType {
    AUTH = 'AUTH',
    REFRESH = 'REFRESH',
    VERIFY_EMAIL = 'VERIFY_EMAIL',
    RESET_PASSWORD = 'RESET_PASSWORD',
}