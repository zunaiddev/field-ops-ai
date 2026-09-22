import {Exclude, Expose} from "class-transformer";
import {OrganizationRes} from "../../orgnization/dto/organization-res.dto.js";
import {OrganizationMember} from "../../orgnization-member/entity/organization-member.entity.js";
import {EmployeeDto} from "./employee.dto.js";

@Exclude()
export class EmployeeRes {
    @Expose()
    employee: EmployeeDto;

    @Expose()
    organization: OrganizationRes;

    constructor(orgMember: OrganizationMember) {
        this.employee = new EmployeeDto(orgMember.employee);
        this.organization = new OrganizationRes(orgMember.organization);
    }
}