import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtAuthenticatedRequest} from "./jwt.guard.js";
import {Customer} from "../../modules/customer/entity/customer.entity.js";
import {CustomerService} from "../../modules/customer/customer.service.js";
import {ErrorCode} from "../enums/error-code.enum.js";

export interface CustomerAuthenticatedReq extends JwtAuthenticatedRequest {
    customer: Customer;
}

@Injectable()
export class CustomerGuard implements CanActivate {

    constructor(private readonly customerService: CustomerService) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<CustomerAuthenticatedReq>();

        const customer = await this.customerService.findCustomerById(Number(req.payload.sub));

        if (!customer) {
            throw new UnauthorizedException({
                message: "Customer not found",
                code: ErrorCode.CUSTOMER_NOT_FOUND
            });
        }

        if (customer.status !== "ACTIVE") {
            throw new UnauthorizedException({
                message: "Customer is not allowed",
                code: ErrorCode.CUSTOMER_NOT_FOUND
            });
        }

        req.customer = customer;

        console.log(customer);

        return true;
    }
}