import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { VerifyService } from './verify.service.js';
import { JwtType } from '../jwt/jwt.types.js';
import { ErrorCode } from '../../common/enums/error-code.enum.js';
import { Customer } from '../customer/entity/customer.entity.js';
import { Employee } from '../employee/entity/employee.entity.js';

describe('VerifyService - Password Reset Token Verification', () => {
    let service: VerifyService;
    let mockCacheService: any;
    let mockJwtService: any;
    let mockEmployeeService: any;
    let mockCustomerService: any;

    beforeEach(() => {
        mockCacheService = {
            exists: vi.fn().mockResolvedValue(false),
            set: vi.fn().mockResolvedValue(undefined),
            remove: vi.fn().mockResolvedValue(undefined),
            get: vi.fn().mockResolvedValue(undefined),
        };
        mockJwtService = {
            validateToken: vi.fn(),
        };
        mockEmployeeService = {
            findById: vi.fn(),
            findByEmail: vi.fn(),
            update: vi.fn().mockResolvedValue({}),
        };
        mockCustomerService = {
            findCustomerById: vi.fn(),
            findByEmail: vi.fn(),
            update: vi.fn().mockResolvedValue({}),
        };

        service = new VerifyService(
            mockCacheService,
            mockJwtService,
            mockEmployeeService,
            mockCustomerService,
        );
    });

    describe('verifyResetPasswordToken', () => {
        it('should verify a valid token for an employee by userId and role', async () => {
            mockJwtService.validateToken.mockReturnValue({
                sub: '1',
                role: 'ADMIN',
                jti: 'jwt-uuid-1',
                type: JwtType.RESET_PASSWORD,
            });

            const mockEmployee = {
                id: 1,
                email: 'worker@fieldops.ai',
                firstName: 'Worker',
                lastName: 'One',
            } as Employee;

            mockEmployeeService.findById.mockResolvedValue(mockEmployee);

            const result = await service.verifyResetPasswordToken('valid-token');

            expect(mockJwtService.validateToken).toHaveBeenCalledWith('valid-token', JwtType.RESET_PASSWORD);
            expect(result).toEqual({
                valid: true,
                email: 'worker@fieldops.ai',
                userType: 'EMPLOYEE',
                message: 'Token is valid',
            });
        });

        it('should verify a valid token for a customer by customerId and role', async () => {
            mockJwtService.validateToken.mockReturnValue({
                sub: '10',
                role: 'CUSTOMER',
                jti: 'jwt-uuid-2',
                type: JwtType.RESET_PASSWORD,
            });

            const mockCustomer = {
                id: 10,
                email: 'client@example.com',
                name: 'Client Customer',
            } as Customer;

            mockCustomerService.findCustomerById.mockResolvedValue(mockCustomer);

            const result = await service.verifyResetPasswordToken('customer-token');

            expect(result).toEqual({
                valid: true,
                email: 'client@example.com',
                userType: 'CUSTOMER',
                message: 'Token is valid',
            });
        });

        it('should verify a valid token when sub is email as fallback', async () => {
            mockJwtService.validateToken.mockReturnValue({
                sub: 'fallback@example.com',
                role: 'CUSTOMER',
                jti: 'jwt-uuid-fallback',
                type: JwtType.RESET_PASSWORD,
            });

            const mockCustomer = {
                id: 15,
                email: 'fallback@example.com',
                name: 'Fallback Customer',
            } as Customer;

            mockCustomerService.findByEmail.mockResolvedValue(mockCustomer);

            const result = await service.verifyResetPasswordToken('fallback-token');

            expect(result).toEqual({
                valid: true,
                email: 'fallback@example.com',
                userType: 'CUSTOMER',
                message: 'Token is valid',
            });
        });

        it('should throw BadRequestException if token has already been used', async () => {
            mockJwtService.validateToken.mockReturnValue({
                sub: '1',
                role: 'ADMIN',
                jti: 'used-jti',
                type: JwtType.RESET_PASSWORD,
            });

            mockCacheService.exists.mockResolvedValue(true);

            await expect(service.verifyResetPasswordToken('already-used-token')).rejects.toThrow(BadRequestException);
            await expect(service.verifyResetPasswordToken('already-used-token')).rejects.toMatchObject({
                response: expect.objectContaining({
                    errorCode: ErrorCode.INVALID_TOKEN,
                }),
            });
        });

        it('should throw BadRequestException if user does not exist in db', async () => {
            mockJwtService.validateToken.mockReturnValue({
                sub: '999',
                role: 'ADMIN',
                jti: 'jwt-uuid-3',
                type: JwtType.RESET_PASSWORD,
            });

            mockEmployeeService.findById.mockResolvedValue(null);
            mockCustomerService.findCustomerById.mockResolvedValue(null);

            await expect(service.verifyResetPasswordToken('ghost-token')).rejects.toThrow(BadRequestException);
            await expect(service.verifyResetPasswordToken('ghost-token')).rejects.toMatchObject({
                response: expect.objectContaining({
                    errorCode: ErrorCode.USER_NOT_FOUND,
                }),
            });
        });

        it('should propagate UnauthorizedException when token is expired or invalid', async () => {
            mockJwtService.validateToken.mockImplementation(() => {
                throw new UnauthorizedException({
                    message: 'Token has expired',
                    errorCode: ErrorCode.TOKEN_EXPIRED,
                });
            });

            await expect(service.verifyResetPasswordToken('expired-token')).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('resetPassword', () => {
        it('should hash new password, update employee, and mark token as used', async () => {
            mockJwtService.validateToken.mockReturnValue({
                sub: '1',
                role: 'ADMIN',
                jti: 'jwt-uuid-4',
                type: JwtType.RESET_PASSWORD,
            });

            const employee = {
                id: 1,
                email: 'worker@fieldops.ai',
                passwordHash: 'old-hash',
            } as Employee;

            mockEmployeeService.findById.mockResolvedValue(employee);

            const result = await service.resetPassword('valid-token', 'newSecret123');

            expect(result).toEqual({ message: 'Password reset successful' });
            expect(mockEmployeeService.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    email: 'worker@fieldops.ai',
                    passwordHash: expect.any(String),
                }),
            );
            expect(employee.passwordHash).not.toBe('old-hash');
            expect(mockCacheService.set).toHaveBeenCalled();
            expect(mockCacheService.remove).toHaveBeenCalled();
        });

        it('should hash new password, update customer, and mark token as used', async () => {
            mockJwtService.validateToken.mockReturnValue({
                sub: '2',
                role: 'CUSTOMER',
                jti: 'jwt-uuid-5',
                type: JwtType.RESET_PASSWORD,
            });

            const customer = {
                id: 2,
                email: 'cust@example.com',
                passwordHash: 'old-customer-hash',
            } as Customer;

            mockCustomerService.findCustomerById.mockResolvedValue(customer);

            const result = await service.resetPassword('valid-token', 'brandNewPassword!');

            expect(result).toEqual({ message: 'Password reset successful' });
            expect(mockCustomerService.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    email: 'cust@example.com',
                    passwordHash: expect.any(String),
                }),
            );
            expect(customer.passwordHash).not.toBe('old-customer-hash');
            expect(mockCacheService.set).toHaveBeenCalled();
        });
    });
});
