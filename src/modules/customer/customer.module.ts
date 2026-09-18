import {Module} from '@nestjs/common';
import {CustomerService} from "./customer.service.js";
import {CustomerController} from "./customer.controller.js";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CustomerAddress} from "./entity/customer-address.entity.js";
import {Customer} from "./entity/customer.entity.js";

@Module({
    imports: [TypeOrmModule.forFeature([Customer, CustomerAddress])],
    providers: [CustomerService],
    controllers: [CustomerController],
    exports: [CustomerService],
})
export class CustomerModule {
}