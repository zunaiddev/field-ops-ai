import {IsEnum, IsNumber, IsOptional, IsString, MaxLength,} from 'class-validator';
import {
    ServiceRequestCategory,
    ServiceRequestPriority,
    ServiceRequestSource,
    ServiceRequestStatus
} from "../entity/service-req.enums.js";

export class UpdateServiceReq {
    @IsOptional()
    @IsNumber({}, {message: 'Customer ID must be a number'})
    customerId?: number;

    @IsOptional()
    @IsNumber({}, {message: 'Address ID must be a number'})
    addressId?: number;

    @IsOptional()
    @IsString({message: 'Title must be a string'})
    @MaxLength(255, {message: 'Title cannot exceed 255 characters'})
    title?: string;

    @IsOptional()
    @IsString({message: 'Description must be a string'})
    description?: string;

    @IsOptional()
    @IsEnum(ServiceRequestCategory, {
        message: 'Invalid service request category',
    })
    category?: ServiceRequestCategory;

    @IsOptional()
    @IsEnum(ServiceRequestPriority, {
        message: 'Invalid service request priority',
    })
    priority?: ServiceRequestPriority;

    @IsOptional()
    @IsEnum(ServiceRequestStatus, {
        message: 'Invalid service request status',
    })
    status?: ServiceRequestStatus;

    @IsOptional()
    @IsEnum(ServiceRequestSource, {
        message: 'Invalid service request source',
    })
    source?: ServiceRequestSource;
}