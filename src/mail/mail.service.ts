import {Injectable, Logger} from '@nestjs/common';
import {MailerService} from "@nestjs-modules/mailer";
import {ConfigService} from "@nestjs/config";

export interface SendVerificationEmailOptions {
    to: string;
    userName: string;
    organizationName: string;
    token: string;
    verificationUrl?: string;
    expiresIn?: string;
    supportEmail?: string;
}

@Injectable()
export class MailService {
    private readonly baseUrl: string;
    private readonly logger: Logger;

    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
    ) {
        this.baseUrl = this.configService.getOrThrow<string>('baseUrl');
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
}