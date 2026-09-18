import {Exclude, Expose} from "class-transformer";
import {CustomerAddress} from "../entity/customer-address.entity.js";

@Exclude()
export class CustomerAddressRes {
    @Expose()
    id: string;

    @Expose()
    customerId: string;

    @Expose()
    addressLine1: string;

    @Expose()
    addressLine2?: string;

    @Expose()
    city: string;

    @Expose()
    state: string;

    @Expose()
    postalCode: string;

    @Expose()
    country: string;

    @Expose()
    isPrimary: boolean;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    constructor(address: CustomerAddress) {
        this.id = address.id;
        this.customerId = address.customerId || address.customer?.id;
        this.addressLine1 = address.addressLine1;
        this.addressLine2 = address.addressLine2;
        this.city = address.city;
        this.state = address.state;
        this.postalCode = address.postalCode;
        this.country = address.country;
        this.isPrimary = address.isPrimary;
        this.createdAt = address.createdAt;
        this.updatedAt = address.updatedAt;
    }
}
