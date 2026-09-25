import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Organization } from '../../orgnization/entity/organization.entity.js';
import { ServiceRequest } from '../../service-req/entity/service-req.entity.js';
import { Technician } from '../../technician/entity/technician.entity.js';

export enum ScheduleStatus {
    SCHEDULED = 'SCHEDULED',
    DISPATCHED = 'DISPATCHED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

@Entity('schedules')
@Index(['organizationId'])
export class Schedule {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'organization_id' })
    organizationId: number;

    @ManyToOne(() => Organization, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'organization_id' })
    organization?: Organization;

    @Column({ name: 'service_request_id' })
    serviceRequestId: number;

    @ManyToOne(() => ServiceRequest, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'service_request_id' })
    serviceRequest?: ServiceRequest;

    @Column({ name: 'technician_id' })
    technicianId: number;

    @ManyToOne(() => Technician, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'technician_id' })
    technician?: Technician;

    @Column({ name: 'scheduled_start', type: 'timestamp' })
    scheduledStart: Date;

    @Column({ name: 'scheduled_end', type: 'timestamp' })
    scheduledEnd: Date;

    @Column({
        type: 'enum',
        enum: ScheduleStatus,
        default: ScheduleStatus.SCHEDULED,
    })
    status: ScheduleStatus;

    @Column({ type: 'text', nullable: true })
    notes?: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}

export { Schedule as ScheduleEntity };
