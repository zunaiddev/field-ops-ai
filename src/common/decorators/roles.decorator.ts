import {OrganizationRole} from "../../modules/orgnization-member/entity/organization-member.entity.js";
import {SetMetadata} from "@nestjs/common";

export const ROLES_KEY = "roles";

export const Roles = (...roles: OrganizationRole[]) =>
    SetMetadata(ROLES_KEY, roles);