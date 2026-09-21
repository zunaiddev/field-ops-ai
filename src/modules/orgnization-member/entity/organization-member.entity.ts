import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Employee} from "../../employee/entity/employee.entity.js";
import {Organization} from "../../orgnization/entity/organization.entity.js";

export enum OrganizationRole {
    ORG_OWNER = 'ORG_OWNER',
    ORG_ADMIN = 'ORG_ADMIN',
    DISPATCHER = 'DISPATCHER',
    MANAGER = 'MANAGER',
    TECHNICIAN = 'TECHNICIAN',
    INVENTORY_MANAGER = 'INVENTORY_MANAGER',
    FINANCE = 'FINANCE',
    VIEWER = 'VIEWER',
}

@Entity('organization_members')
export class OrganizationMember {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'organization_id'})
    organizationId: number;

    @Column({name: 'user_id'})
    employeeId: number;

    @Column({
        type: 'enum',
        enum: OrganizationRole,
    })
    role: OrganizationRole;

    @ManyToOne(() => Organization, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({name: 'organization_id'})
    organization: Organization;

    @ManyToOne(() => Employee, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({name: 'user_id'})
    employee: Employee;
}
