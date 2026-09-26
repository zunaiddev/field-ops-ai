import { IsEnum, IsOptional } from 'class-validator';
import { ScheduleStatus } from '../entity/schedule.entity.js';

export class TechnicianScheduleQueryDto {
    /**
     * Optional filter by schedule status.
     * Allowed values: SCHEDULED, DISPATCHED, IN_PROGRESS, COMPLETED, CANCELLED.
     */
    @IsOptional()
    @IsEnum(ScheduleStatus, {
        message: `status must be one of the following values: ${Object.values(ScheduleStatus).join(', ')}`,
    })
    status?: ScheduleStatus;
}
