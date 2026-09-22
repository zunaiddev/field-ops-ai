import {IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength,} from 'class-validator';
import {ServiceRequestCategory, ServiceRequestPriority} from "../entity/service-req.enums.js";

export class CreateServiceReq {
    @IsNotEmpty({message: 'Customer is required'})
    @IsNumber({}, {message: 'Customer ID must be a number'})
    customerId: number;

    @IsNotEmpty({message: 'Address is required'})
    @IsNumber({}, {message: 'Address ID must be a number'})
    addressId: number;

    @IsNotEmpty({message: 'Title is required'})
    @IsString({message: 'Title must be a string'})
    @MaxLength(255, {message: 'Title cannot exceed 255 characters'})
    title: string;

    @IsNotEmpty({message: 'Description is required'})
    @IsString({message: 'Description must be a string'})
    description: string;

    @IsNotEmpty({message: 'Category is required'})
    @IsEnum(ServiceRequestCategory, {
        message: 'Invalid service request category',
    })
    category: ServiceRequestCategory;

    @IsNotEmpty({message: 'Priority is required'})
    @IsEnum(ServiceRequestPriority, {
        message: 'Invalid service request priority',
    })
    priority: ServiceRequestPriority;
}