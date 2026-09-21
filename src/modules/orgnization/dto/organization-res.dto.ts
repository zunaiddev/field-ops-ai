import {Exclude, Expose} from "class-transformer";
import {Organization} from "../entity/organization.entity.js";
import {Employee} from "../../users/entity/employee.entity.js";
import {OrganizationMember, OrganizationRole} from "../../orgnization-member/entity/organization-member.entity.js";
import {EmployeeDto} from "../../users/dto/employee.dto.js";

@Exclude()
export class OrganizationRes {
    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose()
    slug: string;

    @Expose()
    status: string;

    @Expose()
    timezone: string;

    @Expose()
    currency: string;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    @Expose()
    user?: EmployeeDto;

    constructor(organizationMember: OrganizationMember);
    constructor(organization: Organization, user?: Employee, role?: OrganizationRole | string);
    constructor(orgOrMember: Organization | OrganizationMember, user?: Employee, role?: OrganizationRole | string) {
        if ('organization' in orgOrMember) {
            const orgMember = orgOrMember as OrganizationMember;
            this.id = orgMember.organization.id;
            this.name = orgMember.organization.name;
            this.slug = orgMember.organization.slug;
            this.status = orgMember.organization.status;
            this.timezone = orgMember.organization.timezone;
            this.currency = orgMember.organization.currency;
            this.createdAt = orgMember.organization.createdAt;
            this.updatedAt = orgMember.organization.updatedAt;
            if (orgMember.user) {
                this.user = new EmployeeDto(orgMember.user, orgMember.role);
            }
        } else {
            const org = orgOrMember as Organization;
            this.id = org.id;
            this.name = org.name;
            this.slug = org.slug;
            this.status = org.status;
            this.timezone = org.timezone;
            this.currency = org.currency;
            this.createdAt = org.createdAt;
            this.updatedAt = org.updatedAt;
            if (user) {
                this.user = new EmployeeDto(user, role);
            }
        }
    }
}
