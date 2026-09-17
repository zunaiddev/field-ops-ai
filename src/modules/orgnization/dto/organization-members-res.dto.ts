import { Organization } from "../entity/organization.entity.js";
import { OrganizationRes } from "./organization-res.dto.js";
import { Exclude, Expose } from "class-transformer";
import { OrganizationMember } from "../../orgnization-member/entity/organization-member.entity.js";
import { UserDto } from "../../users/dto/user.dto.js";

@Exclude()
export class OrganizationMembersRes {
    @Expose()
    orgDetails: OrganizationRes;

    @Expose()
    members: UserDto[];

    constructor(organization: Organization, members: OrganizationMember[]) {
        this.orgDetails = new OrganizationRes(organization);
        this.members = members.map((member) => new UserDto(member.user, member.role));
    }
}
