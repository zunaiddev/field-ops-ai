import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MailService } from './mail.service.js';

describe('MailService - sendUserAccountCreated', () => {
    let mailService: MailService;
    let mockMailerService: any;
    let mockConfigService: any;

    beforeEach(() => {
        mockMailerService = {
            sendMail: vi.fn().mockResolvedValue({}),
        };
        mockConfigService = {
            get: vi.fn((key: string) => {
                if (key === 'baseUrl') return 'http://localhost:3000';
                if (key === 'frontendUrl') return 'http://localhost:5173';
                return undefined;
            }),
        };

        mailService = new MailService(mockMailerService, mockConfigService);
    });

    it('should send user account created email with expected context', async () => {
        await mailService.sendUserAccountCreated({
            to: 'alex@example.com',
            userName: 'Alex Smith',
            email: 'alex@example.com',
            organizationName: 'Acme Corp',
            role: 'TECHNICIAN',
            password: 'temp-password-123',
        });

        expect(mockMailerService.sendMail).toHaveBeenCalledTimes(1);
        expect(mockMailerService.sendMail).toHaveBeenCalledWith(
            expect.objectContaining({
                to: 'alex@example.com',
                subject: 'Welcome to FieldOps AI - Your Account Has Been Created',
                template: './user-account-created',
                context: expect.objectContaining({
                    userName: 'Alex Smith',
                    email: 'alex@example.com',
                    organizationName: 'Acme Corp',
                    role: 'TECHNICIAN',
                    password: 'temp-password-123',
                    loginUrl: 'http://localhost:5173/auth/login',
                    supportEmail: 'support@fieldops.ai',
                }),
            }),
        );
    });

    it('should fall back gracefully if optional fields are omitted', async () => {
        await mailService.sendUserAccountCreated({
            to: 'sarah@example.com',
            userName: 'Sarah Connor',
        });

        expect(mockMailerService.sendMail).toHaveBeenCalledTimes(1);
        expect(mockMailerService.sendMail).toHaveBeenCalledWith(
            expect.objectContaining({
                to: 'sarah@example.com',
                template: './user-account-created',
                context: expect.objectContaining({
                    userName: 'Sarah Connor',
                    email: 'sarah@example.com',
                    loginUrl: 'http://localhost:5173/auth/login',
                }),
            }),
        );
    });
});
