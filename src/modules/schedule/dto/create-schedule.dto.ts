import {IsDate, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString} from 'class-validator';
import {Type} from 'class-transformer';
import {Trim} from '../../../common/decorators/transform.decorators.js';

export class CreateScheduleDto {
    @IsNotEmpty({message: 'Service request ID is required'})
    @Type(() => Number)
    @IsInt({message: 'Service request ID must be an integer'})
    @IsPositive({message: 'Service request ID must be a positive number'})
    serviceRequestId: number;

    @IsNotEmpty({message: 'Technician ID is required'})
    @Type(() => Number)
    @IsInt({message: 'Technician ID must be an integer'})
    @IsPositive({message: 'Technician ID must be a positive number'})
    technicianId: number;

    @IsNotEmpty({message: 'Scheduled start date is required'})
    @Type(() => Date)
    @IsDate({message: 'Scheduled start must be a valid date'})
    scheduledStart: Date;

    @IsNotEmpty({message: 'Scheduled end date is required'})
    @Type(() => Date)
    @IsDate({message: 'Scheduled end must be a valid date'})
    scheduledEnd: Date;

    @Trim()
    @IsOptional()
    @IsString({message: 'Notes must be a string'})
    notes?: string;
}
