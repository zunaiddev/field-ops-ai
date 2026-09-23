import {Exclude, Expose, Type} from "class-transformer";
import {Technician} from "../entity/technician.entity.js";
import {EmployeeDto} from "../../employee/dto/employee.dto.js";
import {TechnicianAddressRes} from "./technician-address-res.dto.js";

@Exclude()
export class TechnicianDto {
    @Expose()
    id: number;

    @Expose()
    organizationId: number;

    @Expose()
    status: string;

    @Expose()
    availabilityStatus: string;

    @Expose()
    @Type(() => EmployeeDto)
    employee?: EmployeeDto;

    @Expose()
    @Type(() => TechnicianAddressRes)
    homeAddress?: TechnicianAddressRes;

    @Expose()
    @Type(() => TechnicianAddressRes)
    currentAddress?: TechnicianAddressRes;

    @Expose()
    lastLocationAt?: Date;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    constructor(technician: Technician) {
        this.id = technician.id;
        this.organizationId = technician.organizationId;
        this.status = technician.status;
        this.availabilityStatus = technician.availabilityStatus;
        this.employee = technician.employee ? new EmployeeDto(technician.employee) : undefined;
        this.homeAddress = technician.homeAddress ? new TechnicianAddressRes(technician.homeAddress) : undefined;
        this.currentAddress = technician.currentAddress ? new TechnicianAddressRes(technician.currentAddress) : undefined;
        this.lastLocationAt = technician.lastLocationAt;
        this.createdAt = technician.createdAt;
        this.updatedAt = technician.updatedAt;
    }
}