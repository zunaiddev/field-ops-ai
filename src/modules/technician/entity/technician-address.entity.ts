import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity("technician_addresses")
export class TechnicianAddress {
    @PrimaryGeneratedColumn()
    id: number;

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

    @Column({length: 100})
    longitude: string;

    @Column({length: 100})
    latitude: string;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;
}