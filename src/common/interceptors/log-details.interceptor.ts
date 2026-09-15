import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LogDetailsInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LogDetailsInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest<Request>();
    const res = httpContext.getResponse<Response>();

    const { method, url } = req;
    const startTime = Date.now();
    const requestTime = new Date().toISOString();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const statusCode = res?.statusCode;
          this.logger.log(
            `[${requestTime}] ${method} ${url} - Status: Success (${statusCode}) - Duration: ${duration}ms`,
          );
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          const statusCode =
            error?.getStatus?.() || error?.status || res?.statusCode || 500;
          this.logger.error(
            `[${requestTime}] ${method} ${url} - Status: Failed (${statusCode}) - Duration: ${duration}ms`,
          );
        },
      }),
    );
  }
}
