import {CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException} from '@nestjs/common';
import {Reflector} from "@nestjs/core";
import {IS_PUBLIC_KEY} from "../decorators/public.decorator.js";
import {Request} from "express";

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger: Logger;

  constructor(private readonly reflector: Reflector) {
    this.logger = new Logger(AuthGuard.name);
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass()
    ]);

    if (isPublic) {
      this.logger.log("Skipped Auth Guard");
      return true;
    }

    const request: Request = context.switchToHttp().getRequest<Request>();

    const authHeader:string | undefined = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException("Auth header is missing");
    }

    const [type, token] = authHeader.split(' ');

    if (type !== "Bearer" || !token) {
      throw new UnauthorizedException("Missing or invalid Bearer token");
    }

    return true;
  }
}