import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {Technician} from '../../technician/entity/technician.entity.js';

@Entity('technician_availabilities')
@Index(['technicianId'])
export class TechnicianAvailability {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'technician_id'})
    technicianId: number;

    @ManyToOne(() => Technician, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'technician_id'})
    technician?: Technician;

    @Column({name: 'day_of_week'})
    dayOfWeek: number;

    @Column({name: 'start_time', type: 'time'})
    startTime: string;

    @Column({name: 'end_time', type: 'time'})
    endTime: string;

    @Column({name: 'is_available', default: true})
    isAvailable: boolean;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;
}