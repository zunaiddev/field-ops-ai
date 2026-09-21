import {Exclude, Expose, Type} from "class-transformer";
import {Customer} from "../entity/customer.entity.js";
import {CustomerAddress} from "../entity/customer-address.entity.js";
import {CustomerAddressRes} from "./customer-address-res.dto.js";

@Exclude()
export class CustomerRes {
    @Expose()
    id: number;

    @Expose()
    organizationId: number;

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
    @Type((): typeof CustomerAddressRes => CustomerAddressRes)
    addresses: CustomerAddressRes[] | undefined;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    constructor(customer: Customer, addresses: CustomerAddress[] | undefined = undefined) {
        this.id = customer.id;
        this.organizationId = customer.organizationId;
        this.name = customer.name;
        this.phone = customer.phone;
        this.email = customer.email;
        this.externalReference = customer.externalReference;
        this.status = customer.status;
        this.addresses = addresses ? addresses?.map((address) => new CustomerAddressRes(address)) : undefined;
        this.createdAt = customer.createdAt;
        this.updatedAt = customer.updatedAt;
    }
}