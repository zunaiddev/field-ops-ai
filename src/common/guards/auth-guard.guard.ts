import {CanActivate, ExecutionContext, Injectable, Logger} from '@nestjs/common';
import {Reflector} from "@nestjs/core";
import {IS_PUBLIC_KEY} from "../decorators/public.decorator.js";

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

    console.log(isPublic);

    this.logger.log("Entered in Auth Guard");

    if (isPublic) {
      this.logger.log("Skipped Auth Guard");
      return true;
    }

    return true;
  }
}
