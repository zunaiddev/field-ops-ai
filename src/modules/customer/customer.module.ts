import {Module} from '@nestjs/common';
import {CustomerService} from "./customer.service.js";
import {CustomerController} from "./customer.controller.js";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CustomerAddress} from "./entity/customer-address.entity.js";
import {Customer} from "./entity/customer.entity.js";
import {CustomerHistory} from "./entity/customer-history.js";
import {PublicCustomerController} from "./public-customer.controller.js";
import {PublicCustomerService} from "./public-customer.service.js";

@Module({
    imports: [TypeOrmModule.forFeature([Customer, CustomerAddress, CustomerHistory])],
    providers: [CustomerService, PublicCustomerService],
    controllers: [CustomerController, PublicCustomerController],
    exports: [CustomerService],
})
export class CustomerModule {
}
