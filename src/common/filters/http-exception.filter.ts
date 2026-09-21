import {ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger,} from '@nestjs/common';
import {Response} from 'express';
import {ErrorCode} from "../enums/error-code.enum.js";

interface ErrorResponse {
    success: boolean;
    message: string;
    code: ErrorCode;
    details?: any;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Something Went Wrong';
        let details: any = undefined;
        let code: ErrorCode = ErrorCode.UNKNOWN;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            } else if (
                typeof exceptionResponse === 'object' &&
                exceptionResponse !== null
            ) {
                const resObj = exceptionResponse as Record<string, any>;

                message = resObj.message;
                code = resObj.errorCode ?? ErrorCode.UNKNOWN;
            }
        } else if (exception instanceof Error) {
            this.logger.error(exception.message, exception.stack);
            message = 'Something Went Wrong';
        } else {
            this.logger.error('Unhandled exception', exception);
        }

        const errorResponse: ErrorResponse = {
            success: false,
            message,
            code,
            ...(details !== undefined ? {details} : {}),
        };

        response.status(status).json(errorResponse);
    }
}
