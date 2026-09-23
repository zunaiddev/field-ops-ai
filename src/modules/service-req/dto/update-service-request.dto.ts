import {IsEnum, IsNumber, IsString, MaxLength,} from 'class-validator';
import {ServiceRequestCategory, ServiceRequestPriority, ServiceRequestStatus} from "../entity/service-req.enums.js";

export class UpdateServiceReq {
    @IsNumber({}, {message: 'Address ID must be a number'})
    addressId: number;

    @IsString({message: 'Title must be a string'})
    @MaxLength(255, {message: 'Title cannot exceed 255 characters'})
    title: string;

    @IsString({message: 'Description must be a string'})
    description: string;

    @IsEnum(ServiceRequestCategory, {
        message: 'Invalid service request category',
    })
    category: ServiceRequestCategory;

    @IsEnum(ServiceRequestPriority, {
        message: 'Invalid service request priority',
    })
    priority: ServiceRequestPriority;

    @IsEnum(ServiceRequestStatus, {
        message: 'Invalid service request status',
    })
    status: ServiceRequestStatus;
}