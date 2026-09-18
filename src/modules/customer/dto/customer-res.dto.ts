import {Exclude, Expose, Type} from "class-transformer";
import {Customer} from "../entity/customer.entity.js";
import {CustomerAddress} from "../entity/customer-address.entity.js";
import {CustomerAddressRes} from "./customer-address-res.dto.js";

@Exclude()
export class CustomerRes {
    @Expose()
    id: string;

    @Expose()
    organizationId: string;

    @Expose()
    name: string;

    @Expose()
    phone?: string;

    @Expose()
    email: string;

    @Expose()
    externalReference?: string;

    @Expose()
    status: string;

    @Expose()
    @Type(() => CustomerAddressRes)
    addresses: CustomerAddressRes[];

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    constructor(customer: Customer, addresses: CustomerAddress[] = []) {
        this.id = customer.id;
        this.organizationId = customer.organizationId;
        this.name = customer.name;
        this.phone = customer.phone;
        this.email = customer.email;
        this.externalReference = customer.externalReference;
        this.status = customer.status;
        this.addresses = addresses.map((address) => new CustomerAddressRes(address));
        this.createdAt = customer.createdAt;
        this.updatedAt = customer.updatedAt;
    }
}
