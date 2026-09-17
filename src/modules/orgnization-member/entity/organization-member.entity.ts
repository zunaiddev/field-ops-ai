import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {User} from "../../users/entity/user.entity.js";
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
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'organization_id' })
    organizationId: string;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({
        type: 'enum',
        enum: OrganizationRole,
    })
    role: OrganizationRole;

    @ManyToOne(() => Organization, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'organization_id' })
    organization: Organization;

    @ManyToOne(() => User, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
