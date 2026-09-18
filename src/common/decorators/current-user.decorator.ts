import {createParamDecorator, ExecutionContext} from "@nestjs/common";

export const CurrentUser =
    createParamDecorator((data: string | undefined, context: ExecutionContext): any => {
        const request = context.switchToHttp().getRequest();
        return request;
    });