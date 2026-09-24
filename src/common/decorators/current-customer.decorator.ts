import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {Customer} from "../../modules/customer/entity/customer.entity.js";
import {CustomerAuthenticatedReq} from "../guards/customer.guard.js";

export const CurrentCustomer =
    createParamDecorator((_, ctx: ExecutionContext): Customer => {
        return ctx.switchToHttp().getRequest<CustomerAuthenticatedReq>().customer;
    });