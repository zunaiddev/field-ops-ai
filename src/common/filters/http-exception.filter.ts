import {ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger,} from '@nestjs/common';
import {Response} from 'express';

interface ErrorResponse {
  success: boolean;
  message: string;
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

        if (Array.isArray(resObj.message)) {
          message = resObj.error || 'Validation failed';
          details = resObj.message;
        } else if (typeof resObj.message === 'string') {
          message = resObj.message;
          if (resObj.error && resObj.error !== resObj.message) {
            details = resObj.error;
          }
        } else if (resObj.error && typeof resObj.error === 'string') {
          message = resObj.error;
        }

        if (resObj.details !== undefined) {
          details = resObj.details;
        }
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
      ...(details !== undefined ? { details } : {}),
    };

    response.status(status).json(errorResponse);
  }
}
