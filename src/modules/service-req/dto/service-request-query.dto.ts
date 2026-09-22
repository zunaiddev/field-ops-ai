import {IsEnum, IsNumberString, IsOptional, IsString,} from 'class-validator';
import {
    ServiceRequestCategory,
    ServiceRequestPriority,
    ServiceRequestSource,
    ServiceRequestStatus
} from "../entity/service-req.enums.js";

export class ServiceRequestQuery {
    @IsOptional()
    @IsNumberString({}, {message: 'Page must be a number'})
    page?: string;

    @IsOptional()
    @IsNumberString({}, {message: 'Page size must be a number'})
    pageSize?: string;

    @IsOptional()
    @IsString({message: 'Search must be a string'})
    search?: string;

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

    @IsOptional()
    @IsNumberString({}, {message: 'Customer ID must be a number'})
    customerId?: string;
}