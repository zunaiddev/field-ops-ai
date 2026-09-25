import {IsBoolean, IsInt, IsOptional, IsString, Matches, Max, Min} from 'class-validator';
import {Type} from 'class-transformer';
import {Trim} from '../../../common/decorators/transform.decorators.js';

export class UpdateTechnicianAvailabilityDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt({message: 'dayOfWeek must be an integer'})
    @Min(0, {message: 'dayOfWeek must be between 0 (Sunday) and 6 (Saturday)'})
    @Max(6, {message: 'dayOfWeek must be between 0 (Sunday) and 6 (Saturday)'})
    dayOfWeek?: number;

    @Trim()
    @IsOptional()
    @IsString({message: 'startTime must be a string'})
    @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, {
        message: 'startTime must be in HH:mm or HH:mm:ss format',
    })
    startTime?: string;

    @Trim()
    @IsOptional()
    @IsString({message: 'endTime must be a string'})
    @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, {
        message: 'endTime must be in HH:mm or HH:mm:ss format',
    })
    endTime?: string;

    @IsOptional()
    @IsBoolean({message: 'isAvailable must be a boolean'})
    isAvailable?: boolean;
}
