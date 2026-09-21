import {Exclude, Expose} from "class-transformer";
import {OrganizationMember} from "../../orgnization-member/entity/organization-member.entity.js";
import {EmployeeDto} from "../../users/dto/employee.dto.js";

@Exclude()
export class OrganizationMembersRes {
    @Expose()
    employees: EmployeeDto[];

    constructor(members: OrganizationMember[]) {
        this.employees = members.map((member) => new EmployeeDto(member.user, member.role));
    }
}