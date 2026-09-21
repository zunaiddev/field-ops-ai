import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import {Customer} from './customer.entity.js';

@Entity('customer_addresses')
export class CustomerAddress {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'customer_id'})
    customerId: number;

    @Column({length: 100})
    addressLine1: string;

    @Column({length: 100, nullable: true})
    addressLine2?: string;

    @Column({length: 100})
    city: string;

    @Column({length: 100})
    state: string;

    @Column({length: 20})
    postalCode: string;

    @Column({length: 100})
    country: string;

    @Column({default: false})
    isPrimary: boolean;

    @ManyToOne(() => Customer,
        {onDelete: 'CASCADE'})
    @JoinColumn({name: 'customer_id'})
    customer: Customer;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;
}