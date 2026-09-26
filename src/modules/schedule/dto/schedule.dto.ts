import { Exclude, Expose, Type } from 'class-transformer';
import { Schedule, ScheduleStatus } from '../entity/schedule.entity.js';
import { ServiceReqDto } from '../../service-req/dto/service-req.dto.js';
import { TechnicianDto } from '../../technician/dto/technician.dto.js';
import { CustomerRes } from '../../customer/dto/customer-res.dto.js';
import { CustomerAddressRes } from '../../customer/dto/customer-address-res.dto.js';

@Exclude()
export class ScheduleDto {
    @Expose()
    id: number;

    @Expose()
    organizationId: number;

    @Expose()
    serviceRequestId: number;

    @Expose()
    technicianId: number;

    @Expose()
    scheduledStart: Date;

    @Expose()
    scheduledEnd: Date;

    @Expose()
    status: ScheduleStatus;

    @Expose()
    notes?: string;

    @Expose()
    @Type(() => ServiceReqDto)
    serviceRequest?: ServiceReqDto;

    @Expose()
    @Type(() => CustomerRes)
    customer?: CustomerRes;

    @Expose()
    @Type(() => CustomerAddressRes)
    address?: CustomerAddressRes;

    @Expose()
    @Type(() => TechnicianDto)
    technician?: TechnicianDto;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    constructor(schedule: Schedule) {
        this.id = schedule.id;
        this.organizationId = schedule.organizationId;
        this.serviceRequestId = schedule.serviceRequestId;
        this.technicianId = schedule.technicianId;
        this.scheduledStart = schedule.scheduledStart;
        this.scheduledEnd = schedule.scheduledEnd;
        this.status = schedule.status;
        this.notes = schedule.notes;
        this.serviceRequest = schedule.serviceRequest ? new ServiceReqDto(schedule.serviceRequest) : undefined;
        this.customer = schedule.serviceRequest?.customer
            ? new CustomerRes(schedule.serviceRequest.customer)
            : undefined;
        this.address = schedule.serviceRequest?.address
            ? new CustomerAddressRes(schedule.serviceRequest.address)
            : undefined;
        this.technician = schedule.technician ? new TechnicianDto(schedule.technician) : undefined;
        this.createdAt = schedule.createdAt;
        this.updatedAt = schedule.updatedAt;
    }
}

export { ScheduleDto as ScheduleRes };
