import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity("organizations")
export class Organization {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 150})
    name: string;

    @Column({unique: true, length: 100})
    slug: string;

    @Column({default: "ACTIVE"})
    status: string;

    @Column({default: "UTC"})
    timezone: string;

    @Column({default: "USD", length: 3})
    currency: string;

    @CreateDateColumn({name: "created_at"})
    createdAt: Date;

    @UpdateDateColumn({name: "updated_at"})
    updatedAt: Date;
}