import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity("skills")
export class Skill {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 150, unique: true})
    name: string;

    @Column({type: 'text'})
    description: string;

    @Column({name: "organization_id"})
    organizationId: number;

    @CreateDateColumn({name: 'created_at', type: 'timestamp'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at', type: 'timestamp'})
    updatedAt: Date;
}