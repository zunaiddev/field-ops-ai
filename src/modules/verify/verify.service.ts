import {BadRequestException, Injectable} from '@nestjs/common';
import {JwtService} from "../jwt/jwt.service.js";
import {CustomJwtPayload, JwtType} from "../jwt/jwt.types.js";
import {Public} from "../../common/decorators/public.decorator.js";
import {CacheService, TTL} from "../cache/cache.service.js";
import {CacheKeys} from "../../utils/cache.keys.utils.js";
import {EmployeeService} from "../employee/employee.service.js";
import {Employee} from "../employee/entity/employee.entity.js";
import {ErrorCode} from "../../common/enums/error-code.enum.js";
import {CustomerService} from "../customer/customer.service.js";
import {Customer} from "../customer/entity/customer.entity.js";
import * as argon2 from "argon2";

@Public()
@Injectable()
export class VerifyService {

    constructor(
        private readonly cacheService: CacheService,
        private readonly jwtService: JwtService,
        private readonly userService: EmployeeService,
        private readonly customerService: CustomerService,
    ) {
    }

    async verifyEmail(token: string) {
        const payload: CustomJwtPayload = this.jwtService.validateToken(token, JwtType.VERIFY_EMAIL);

        if (await this.cacheService.exists(CacheKeys.usedToken(payload.jti))) {
            throw new BadRequestException({
                message: "user has already been verified",
                errorCode: ErrorCode.USER_ALREADY_VERIFIED,
            });
        }

        const user: Employee | null = await this.userService.findById(Number(payload.sub));

        if (!user) {
            throw new BadRequestException({
                message: "user not found",
                errorCode: ErrorCode.USER_NOT_FOUND,
            });
        }

        if (user.emailVerifiedAt) {
            throw new BadRequestException({
                message: "user already verified",
                errorCode: ErrorCode.USER_ALREADY_VERIFIED,
            });
        }

        user.emailVerifiedAt = new Date();

        await this.userService.update(user);

        await this.cacheService.set(CacheKeys.usedToken(payload.jti), {email: user.email}, TTL.ofMinutes(16));

        return {message: "Verified"};
    }

    /**
     * Validates a password reset token and retrieves the associated user (Customer or Employee).
     */
    private async validateResetTokenAndGetUser(token: string): Promise<{
        payload: CustomJwtPayload;
        user: Employee | Customer;
        isCustomer: boolean;
    }> {
        const payload: CustomJwtPayload = this.jwtService.validateToken(token, JwtType.RESET_PASSWORD);

        if (await this.cacheService.exists(CacheKeys.usedToken(payload.jti))) {
            throw new BadRequestException({
                message: "Reset token has already been used",
                errorCode: ErrorCode.INVALID_TOKEN,
            });
        }

        const userId = Number(payload.sub);
        const isCustomerRole = payload.role === 'CUSTOMER';
        let user: Employee | Customer | null = null;
        let isCustomer = false;

        if (!isNaN(userId)) {
            if (isCustomerRole) {
                user = await this.customerService.findCustomerById(userId);
                if (user) isCustomer = true;
            } else {
                user = await this.userService.findById(userId);
                if (!user) {
                    user = await this.customerService.findCustomerById(userId);
                    if (user) isCustomer = true;
                }
            }
        }

        // Fallback: in case subject contains an email address
        if (!user && payload.sub) {
            user = await this.userService.findByEmail(payload.sub);
            if (!user) {
                user = await this.customerService.findByEmail(payload.sub);
                if (user) isCustomer = true;
            }
        }

        if (!user) {
            throw new BadRequestException({
                message: "User not found",
                errorCode: ErrorCode.USER_NOT_FOUND,
            });
        }

        return { payload, user, isCustomer: user instanceof Customer || isCustomer };
    }

    /**
     * Verifies that a password reset token is valid, unexpired, and not yet used.
     */
    async verifyResetPasswordToken(token: string) {
        const { user, isCustomer } = await this.validateResetTokenAndGetUser(token);

        return {
            valid: true,
            email: user.email,
            userType: isCustomer ? 'CUSTOMER' : 'EMPLOYEE',
            message: "Token is valid",
        };
    }

    /**
     * Verifies the reset token, hashes the new password, updates the user, and marks the token as used.
     */
    async resetPassword(token: string, password: string) {
        const { payload, user, isCustomer } = await this.validateResetTokenAndGetUser(token);

        const passwordHash = await argon2.hash(password);

        if (isCustomer) {
            (user as Customer).passwordHash = passwordHash;
            await this.customerService.update(user as Customer);
        } else {
            (user as Employee).passwordHash = passwordHash;
            await this.userService.update(user as Employee);
        }

        // Mark token as used
        await this.cacheService.set(
            CacheKeys.usedToken(payload.jti),
            { email: user.email, resetAt: new Date().toISOString() },
            TTL.ofDays(30),
        );

        // Clear failed password attempts and account lock if any
        await this.cacheService.remove(CacheKeys.failedPasswordAttempts(user.email));
        await this.cacheService.remove(CacheKeys.accountLocked(user.email));

        return { message: "Password reset successful" };
    }
}
