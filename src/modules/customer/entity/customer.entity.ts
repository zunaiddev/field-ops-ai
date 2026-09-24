import {Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity("customers")
@Index(['organizationId'])
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: "organization_id"})
    organizationId: number;

    @Column({length: 150})
    name: string;

    @Column({name: "phone_no", length: 30})
    phone: string;

    @Column()
    email: string;

    @Column()
    passwordHash: string;

    @Column({
        name: 'external_reference',
        length: 100,
        nullable: true,
    })
    externalReference?: string;

    @Column({default: 'ACTIVE'})
    status: string;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;
}