import {Exclude, Expose} from "class-transformer";
import {OrganizationMember} from "../../orgnization-member/entity/organization-member.entity.js";
import {UserDto} from "../../users/dto/user.dto.js";

@Exclude()
export class OrganizationMembersRes {
    @Expose()
    employees: UserDto[];

    constructor(members: OrganizationMember[]) {
        this.employees = members.map((member) => new UserDto(member.user, member.role));
    }
}