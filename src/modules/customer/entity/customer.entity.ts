import {Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {CustomerAddress} from "./customer-address.entity.js";

@Entity("customers")
@Index(['organizationId'])
export class Customer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({name: "organization_id"})
    organizationId: string;

    @Column({length: 150})
    name: string;

    @Column({name: "phone_no", length: 30, nullable: true})
    phone?: string;

    @Column()
    email: string;

    @Column({
        name: 'external_reference',
        length: 100,
        nullable: true,
    })
    externalReference?: string;

    @OneToMany(() => CustomerAddress,
        (address) => address.customer)
    addresses: CustomerAddress[];

    @Column({default: 'ACTIVE'})
    status: string;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;
}