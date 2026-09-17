import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique: true})
    email: string;

    @Column({name: 'password_hash'})
    passwordHash: string;

    @Column({name: 'first_name', length: 100})
    firstName: string;

    @Column({name: 'last_name', length: 100})
    lastName: string;

    @Column({default: 'ACTIVE'})
    status: string;

    @Column({type: "timestamp", name: 'email_verified_at', nullable: true})
    emailVerifiedAt: Date | null;

    @Column({type: "timestamp", name: 'last_login_at', nullable: true})
    lastLoginAt: Date | null;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;
}