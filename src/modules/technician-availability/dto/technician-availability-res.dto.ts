import {Exclude, Expose} from 'class-transformer';
import {TechnicianAvailability} from '../entity/technician-availability.entity.js';

@Exclude()
export class TechnicianAvailabilityRes {
    @Expose()
    id: number;

    @Expose()
    technicianId: number;

    @Expose()
    dayOfWeek: number;

    @Expose()
    startTime: string;

    @Expose()
    endTime: string;

    @Expose()
    isAvailable: boolean;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    constructor(availability: TechnicianAvailability) {
        this.id = availability.id;
        this.technicianId = availability.technicianId;
        this.dayOfWeek = availability.dayOfWeek;
        this.startTime = availability.startTime;
        this.endTime = availability.endTime;
        this.isAvailable = availability.isAvailable;
        this.createdAt = availability.createdAt;
        this.updatedAt = availability.updatedAt;
    }
}
