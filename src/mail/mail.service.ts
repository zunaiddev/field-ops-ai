import {Injectable, Logger} from '@nestjs/common';
import {MailerService} from "@nestjs-modules/mailer";
import {ConfigService} from "@nestjs/config";
import {Employee} from "../modules/employee/entity/employee.entity.js";

export interface SendVerificationEmailOptions {
    to: string;
    userName: string;
    organizationName: string;
    token: string;
    verificationUrl?: string;
    expiresIn?: string;
    supportEmail?: string;
}

export interface SendUserAccountCreatedOptions {
    to: string;
    userName: string;
    email?: string;
    password?: string;
    organizationName?: string;
    role?: string;
    loginUrl?: string;
    supportEmail?: string;
}

export interface SendResetPasswordEmailOptions {
    to: string;
    userName: string;
    token: string;
    resetUrl?: string;
    expiresIn?: string;
    userType?: 'customer' | 'employee' | string;
    supportEmail?: string;
}

@Injectable()
export class MailService {
    private readonly baseUrl: string;
    private readonly frontendUrl: string;
    private readonly logger: Logger;

    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
    ) {
        this.baseUrl = this.configService.get<string>('baseUrl') || 'http://localhost:3000';
        this.frontendUrl = this.configService.get<string>('frontendUrl')
            || this.configService.get<string>('FRONTEND_URL')
            || process.env.FRONTEND_URL
            || 'http://localhost:3000';
        this.logger = new Logger(MailService.name);
    }

    async sendVerificationEmail(options: SendVerificationEmailOptions) {
        const {
            to,
            userName,
            organizationName,
            token,
            verificationUrl = `${this.baseUrl}/api/v1/verify/email?token=${token}`,
            expiresIn = '15 minutes',
            supportEmail = 'support@fieldops.ai',
        } = options;

        try {
            await this.mailerService.sendMail({
                to,
                subject: 'Verify Your Email - FieldOps AI',
                template: './verify-email',
                context: {
                    userName,
                    organizationName,
                    verificationUrl,
                    token,
                    expiresIn,
                    supportEmail,
                    currentYear: new Date().getFullYear(),
                },
            });
            this.logger.log(`Verification email sent to ${to}`);
        } catch (error) {
            this.logger.error(`Could not send verification email to ${to}`, error);
        }
    }

    async sendEmployeeCreation(employee: Employee, password: string) {
        const loginUrl = `${this.frontendUrl.replace(/\/+$/, '')}/auth/login`;
        const userName = `${employee.firstName || ''} ${employee.lastName || ''}`.trim() || employee.email;

        try {
            await this.mailerService.sendMail({
                to: employee.email,
                subject: 'Welcome to FieldOps AI - Account Credentials',
                template: './employee-created',
                context: {
                    userName,
                    firstName: employee.firstName,
                    lastName: employee.lastName,
                    email: employee.email,
                    password,
                    employeeId: employee.employeeId,
                    role: employee.role,
                    loginUrl,
                    supportEmail: 'support@fieldops.ai',
                    currentYear: new Date().getFullYear(),
                },
            });
            this.logger.log(`Employee creation email sent to ${employee.email}`);
        } catch (error) {
            this.logger.error(`Could not send employee creation email to ${employee.email}`, error);
        }
    }

    /**
     * Sends a welcome email when a user account is created.
     */
    async sendUserAccountCreated(options: SendUserAccountCreatedOptions) {
        const {
            to,
            userName,
            email = to,
            password,
            organizationName,
            role,
            loginUrl = `${this.frontendUrl.replace(/\/+$/, '')}/auth/login`,
            supportEmail = 'support@fieldops.ai',
        } = options;

        try {
            await this.mailerService.sendMail({
                to,
                subject: 'Welcome to FieldOps AI - Your Account Has Been Created',
                template: './user-account-created',
                context: {
                    userName,
                    email,
                    password,
                    organizationName,
                    role,
                    loginUrl,
                    supportEmail,
                    currentYear: new Date().getFullYear(),
                },
            });
            this.logger.log(`User account creation email sent to ${to}`);
        } catch (error) {
            this.logger.error(`Could not send user account creation email to ${to}`, error);
        }
    }

    /**
     * Sends a password reset email to a user (customer or employee) with a secure reset link.
     */
    async sendResetPasswordEmail(options: SendResetPasswordEmailOptions) {
        const {
            to,
            userName,
            token,
            resetUrl = `${this.frontendUrl.replace(/\/+$/, '')}/auth/reset-password?token=${token}`,
            expiresIn = '30 minutes',
            userType,
            supportEmail = 'support@fieldops.ai',
        } = options;

        try {
            await this.mailerService.sendMail({
                to,
                subject: 'Reset Your Password - FieldOps AI',
                template: './reset-password',
                context: {
                    userName,
                    resetUrl,
                    token,
                    expiresIn,
                    userType,
                    supportEmail,
                    currentYear: new Date().getFullYear(),
                },
            });
            this.logger.log(`Password reset email sent to ${to}`);
        } catch (error) {
            this.logger.error(`Could not send password reset email to ${to}`, error);
        }
    }
}
