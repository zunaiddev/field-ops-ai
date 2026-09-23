import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {
    ServiceRequestCategory,
    ServiceRequestPriority,
    ServiceRequestSource,
    ServiceRequestStatus
} from "./service-req.enums.js";

@Entity('service_requests')
export class ServiceRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'organization_id'})
    organizationId: number;

    @Column({name: 'customer_id'})
    customerId: number;

    @Column({name: 'address_id'})
    addressId: number;

    @Column({name: 'created_by'})
    createdBy: number;

    @Column({length: 255})
    title: string;

    @Column({type: 'text'})
    description: string;

    @Column({
        type: 'enum',
        enum: ServiceRequestCategory,
    })
    category: ServiceRequestCategory;

    @Column({
        type: 'enum',
        enum: ServiceRequestPriority,
    })
    priority: ServiceRequestPriority;

    @Column({
        type: 'enum',
        enum: ServiceRequestStatus,
        default: ServiceRequestStatus.NEW,
    })
    status: ServiceRequestStatus;

    @Column({
        type: 'enum',
        enum: ServiceRequestSource,
    })
    source: ServiceRequestSource;

    @Column({name: 'requested_at', type: 'timestamp'})
    requestedAt: Date;

    @Column({name: 'sla_due_at', type: 'timestamp', nullable: true})
    slaDueAt?: Date;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;
}