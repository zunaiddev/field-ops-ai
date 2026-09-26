import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Trim } from '../../../common/decorators/transform.decorators.js';
import { ScheduleStatus } from '../entity/schedule.entity.js';

export class UpdateTechnicianScheduleStatusDto {
    /**
     * The updated status for the schedule.
     * Allowed values: SCHEDULED, DISPATCHED, IN_PROGRESS, COMPLETED, CANCELLED.
     */
    @IsNotEmpty({ message: 'status is required' })
    @IsEnum(ScheduleStatus, {
        message: `status must be one of the following values: ${Object.values(ScheduleStatus).join(', ')}`,
    })
    status: ScheduleStatus;

    /**
     * Optional notes from the technician regarding the status change or work performed.
     */
    @Trim()
    @IsOptional()
    @IsString({ message: 'notes must be a string' })
    notes?: string;
}
