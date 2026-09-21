import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Customer} from "./customer.entity.js";

export enum CustomerHistoryAction {
    CREATED = 'CREATED',
    UPDATED = 'UPDATED',
    DELETED = 'DELETED',
    ADDRESS_CREATED = 'ADDRESS_CREATED',
    ADDRESS_UPDATED = 'ADDRESS_UPDATED',
    ADDRESS_DELETED = 'ADDRESS_DELETED',
}

@Entity('customer_histories')
export class CustomerHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Customer, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'customer_id'})
    customer: Customer;

    @Column({name: 'organization_id'})
    organizationId: number;

    @Column({
        type: "enum", enum: CustomerHistoryAction,
        default: CustomerHistoryAction.CREATED
    })
    action: CustomerHistoryAction;

    @Column({type: "text", nullable: true})
    description?: string;

    @Column({name: 'created_by'})
    createdBy: number;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;
}
