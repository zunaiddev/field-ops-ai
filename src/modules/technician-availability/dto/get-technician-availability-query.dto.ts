import {IsBoolean, IsInt, IsOptional, Max, Min} from 'class-validator';
import {Transform, Type} from 'class-transformer';

export class GetTechnicianAvailabilityQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt({message: 'dayOfWeek must be an integer'})
    @Min(0, {message: 'dayOfWeek must be between 0 (Sunday) and 6 (Saturday)'})
    @Max(6, {message: 'dayOfWeek must be between 0 (Sunday) and 6 (Saturday)'})
    dayOfWeek?: number;

    @IsOptional()
    @Transform(({value}) => {
        if (value === 'true' || value === true) return true;
        if (value === 'false' || value === false) return false;
        return value;
    })
    @IsBoolean()
    isAvailable?: boolean;
}
