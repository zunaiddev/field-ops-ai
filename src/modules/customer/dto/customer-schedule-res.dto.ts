import { Exclude, Expose, Type } from "class-transformer";
import { Schedule, ScheduleStatus } from "../../schedule/entity/schedule.entity.js";
import { Technician } from "../../technician/entity/technician.entity.js";

@Exclude()
export class CustomerTechnicianRes {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    firstName: string;

    @Expose()
    lastName: string;

    @Expose()
    phone?: string;

    @Expose()
    email?: string;

    constructor(technician: Technician) {
        this.id = technician.id;
        const employee = technician.employee;
        if (employee) {
            this.firstName = employee.firstName;
            this.lastName = employee.lastName;
            this.name = `${employee.firstName || ''} ${employee.lastName || ''}`.trim();
            this.phone = employee.phone;
            this.email = employee.email;
        }
    }
}

@Exclude()
export class CustomerScheduleRes {
    @Expose()
    id: number;

    @Expose()
    serviceRequestId: number;

    @Expose()
    scheduledStart: Date;

    @Expose()
    scheduledEnd: Date;

    @Expose()
    status: ScheduleStatus;

    @Expose()
    notes?: string;

    @Expose()
    @Type(() => CustomerTechnicianRes)
    technician?: CustomerTechnicianRes;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    constructor(schedule: Schedule) {
        this.id = schedule.id;
        this.serviceRequestId = schedule.serviceRequestId;
        this.scheduledStart = schedule.scheduledStart;
        this.scheduledEnd = schedule.scheduledEnd;
        this.status = schedule.status;
        this.notes = schedule.notes;
        this.technician = schedule.technician ? new CustomerTechnicianRes(schedule.technician) : undefined;
        this.createdAt = schedule.createdAt;
        this.updatedAt = schedule.updatedAt;
    }
}
