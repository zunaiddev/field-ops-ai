import {
  HttpException,
  HttpExceptionOptions,
  HttpStatus,
} from "@nestjs/common";
import {ErrorCode} from "../common/enums/error-code.enum.js";

export class TooManyReqException extends HttpException {
  constructor(message: string = "Too many requests", errorCode: ErrorCode = ErrorCode.TOO_MANY_REQUESTS, options?: HttpExceptionOptions) {
    super({message, errorCode}, HttpStatus.TOO_MANY_REQUESTS, options);
  }
}
