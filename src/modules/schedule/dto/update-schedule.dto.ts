import {IsDate, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";
import {Trim} from "../../../common/decorators/transform.decorators.js";

export class UpdateScheduleDto {
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