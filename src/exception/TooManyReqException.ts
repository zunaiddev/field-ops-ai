import {
  HttpException,
  HttpExceptionOptions,
  HttpStatus,
} from "@nestjs/common";

export class TooManyReqException extends HttpException {
  constructor(message: string, options?: HttpExceptionOptions) {
    super(message, HttpStatus.TOO_MANY_REQUESTS, options);
  }
}