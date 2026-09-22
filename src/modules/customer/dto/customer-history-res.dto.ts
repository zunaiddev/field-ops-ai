import {Exclude, Expose} from "class-transformer";
import {CustomerHistory, CustomerHistoryAction} from "../entity/customer-history.js";

@Exclude()
export class CustomerHistoryRes {
    @Expose()
    id: number;

    @Expose()
    customerId: number;

    @Expose()
    organizationId: number;

    @Expose()
    action: CustomerHistoryAction;

    @Expose()
    description?: string;

    @Expose()
    createdBy: number;

    @Expose()
    createdAt: Date;

    constructor(history: CustomerHistory, customerId?: number) {
        this.id = history.id;
        this.customerId = history.customer?.id ?? customerId!;
        this.organizationId = history.organizationId;
        this.action = history.action;
        this.description = history.description;
        this.createdBy = history.createdBy;
        this.createdAt = history.createdAt;
    }
}
