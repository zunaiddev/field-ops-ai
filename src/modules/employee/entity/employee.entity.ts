import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn,} from 'typeorm';

export enum EmployeeRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    ORG_OWNER = 'ORG_OWNER',
    ORG_ADMIN = 'ORG_ADMIN',
    DISPATCHER = 'DISPATCHER',
    MANAGER = 'MANAGER',
    TECHNICIAN = 'TECHNICIAN',
    INVENTORY_MANAGER = 'INVENTORY_MANAGER',
    FINANCE = 'FINANCE',
    VIEWER = 'VIEWER',
}

@Entity('employees')
export class Employee {
    @PrimaryGeneratedColumn({type: "bigint"})
    id: number;

    @Column({
        update: false, unique: true,
        default: () => `'EMP-' || lpad(nextval('employees_id_seq')::text, 6, '0')`,
    })
    employeeId: string;

    @Column({unique: true})
    email: string;

    @Column({length: 100, nullable: true})
    phone: string;

    @Column({name: 'password_hash'})
    passwordHash: string;

    @Column({name: 'first_name', length: 100})
    firstName: string;

    @Column({name: 'last_name', length: 100})
    lastName: string;

    @Column({default: 'ACTIVE'})
    status: string;

    @Column({
        type: 'enum',
        enum: EmployeeRole,
    })
    role: EmployeeRole;

    @Column({type: "timestamp", name: 'email_verified_at', nullable: true})
    emailVerifiedAt: Date | null;

    @Column({type: "timestamp", name: 'last_login_at', nullable: true})
    lastLoginAt: Date | null;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;
}
