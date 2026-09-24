import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Employee} from "../../employee/entity/employee.entity.js";
import {TechnicianAddress} from "./technician-address.entity.js";

@Entity("technicians")
export class Technician {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: "employee_id"})
    employeeId: number;

    @OneToOne(() => Employee, employee => employee.id, {
        cascade: true
    })
    @JoinColumn({name: 'employee_id'})
    employee: Employee;

    @Column({name: "organization_id"})
    organizationId: number;

    @Column({name: "status"})
    status: string;

    @Column({name: "availability_status"})
    availabilityStatus: string;

    @OneToOne(type => TechnicianAddress,
        technicianAddress => technicianAddress.id)
    @JoinColumn({name: "home_address_id"})
    homeAddress: TechnicianAddress;

    @OneToOne(type => TechnicianAddress,
        technicianAddress => technicianAddress.id)
    @JoinColumn({name: "current_address_id"})
    currentAddress: TechnicianAddress;

    @Column({name: "last_location_at", nullable: true, type: 'timestamp'})
    lastLocationAt?: Date;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;
}