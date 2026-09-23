import {Exclude, Expose} from "class-transformer";
import {TechnicianAddress} from "../entity/technician-address.entity.js";

@Exclude()
export class TechnicianAddressRes {
    @Expose()
    id: number;

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
    longitude: string;

    @Expose()
    latitude: string;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    constructor(address: TechnicianAddress) {
        this.id = address.id;
        this.addressLine1 = address.addressLine1;
        this.addressLine2 = address.addressLine2;
        this.city = address.city;
        this.state = address.state;
        this.postalCode = address.postalCode;
        this.country = address.country;
        this.longitude = address.longitude;
        this.latitude = address.latitude;
        this.createdAt = address.createdAt;
        this.updatedAt = address.updatedAt;
    }
}
