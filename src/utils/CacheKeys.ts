export class CacheKeys {
  static signup(email: string): string {
    return `signup-user:${email.toLowerCase()}`;
  }

  static failedPasswordAttempts(email: string): string {
    return `failed-password-attempts:${email.toLowerCase()}`;
  }

  static accountLocked(email: string): string {
    return `locked:${email.toLowerCase()}`;
  }

  static resendVerifyEmail(email: string): string {
    return `resend-email:${email.toLowerCase()}`;
  }

  static forgotPasswordAttempts(email: string): string {
    return `forget-password:${email.toLowerCase()}`;
  }

  static passwordResetToken(email: string): string {
    return `password-reset-token:${email.toLowerCase()}`;
  }

  static refreshToken(userId: string): string {
    return `refresh-token:${userId}`;
  }

  static user(userId: string): string {
    return `user:${userId}`;
  }

  static rateLimit(identifier: string): string {
    return `rate-limit:${identifier}`;
  }
}