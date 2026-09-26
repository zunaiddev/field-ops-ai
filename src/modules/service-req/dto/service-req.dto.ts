import {Exclude, Expose, Type} from "class-transformer";
import {ServiceRequest} from "../entity/service-req.entity.js";
import {
    ServiceRequestCategory,
    ServiceRequestPriority,
    ServiceRequestSource,
    ServiceRequestStatus
} from "../entity/service-req.enums.js";
import {CustomerRes} from "../../customer/dto/customer-res.dto.js";
import {CustomerAddressRes} from "../../customer/dto/customer-address-res.dto.js";

@Exclude()
export class ServiceReqDto {
    @Expose()
    id: number;

    @Expose()
    organizationId: number;

    @Expose()
    customerId: number;

    @Expose()
    addressId: number;

    @Expose()
    createdBy: number;

    @Expose()
    title: string;

    @Expose()
    description: string;

    @Expose()
    category: ServiceRequestCategory;

    @Expose()
    priority: ServiceRequestPriority;

    @Expose()
    status: ServiceRequestStatus;

    @Expose()
    source: ServiceRequestSource;

    @Expose()
    requestedAt: Date;

    @Expose()
    slaDueAt?: Date;

    @Expose()
    @Type(() => CustomerRes)
    customer?: CustomerRes;

    @Expose()
    @Type(() => CustomerAddressRes)
    address?: CustomerAddressRes;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    constructor(serviceReq: ServiceRequest) {
        this.id = serviceReq.id;
        this.addressId = serviceReq.addressId;
        this.organizationId = serviceReq.organizationId;
        this.customerId = serviceReq.customerId;
        this.createdBy = serviceReq.createdBy;
        this.title = serviceReq.title;
        this.description = serviceReq.description;
        this.category = serviceReq.category;
        this.priority = serviceReq.priority;
        this.status = serviceReq.status;
        this.source = serviceReq.source;
        this.requestedAt = serviceReq.requestedAt;
        this.slaDueAt = serviceReq.slaDueAt;
        this.customer = serviceReq.customer ? new CustomerRes(serviceReq.customer) : undefined;
        this.address = serviceReq.address ? new CustomerAddressRes(serviceReq.address) : undefined;
        this.createdAt = serviceReq.createdAt;
        this.updatedAt = serviceReq.updatedAt;
    }
}
