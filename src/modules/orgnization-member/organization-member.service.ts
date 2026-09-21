import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {OrganizationMember} from "./entity/organization-member.entity.js";
import {DeepPartial, EntityManager, Repository} from "typeorm";
import {Employee} from "../users/entity/employee.entity.js";
import {Organization} from "../orgnization/entity/organization.entity.js";
import {ErrorCode} from "../../common/enums/error-code.enum.js";

@Injectable()
export class OrganizationMemberService {
    constructor(@InjectRepository(OrganizationMember) private readonly organizationMemberRepo: Repository<OrganizationMember>) {
    }

    async save(organization: DeepPartial<OrganizationMember>, entityManager?: EntityManager): Promise<OrganizationMember> {
        const repo = entityManager
            ? entityManager.getRepository(OrganizationMember) : this.organizationMemberRepo;
        return await repo.save(organization);
    }

    async findByUserOrThrow(user: Employee): Promise<OrganizationMember> {
        const member = await this.organizationMemberRepo.findOne({
            where: {userId: user.id},
            relations: {organization: true},
        });

        if (!member) {
            throw new BadRequestException({
                message: `Could not found org details for email ${user.email}`,
                errorCode: ErrorCode.ORG_MEMBER_NOT_FOUND,
            });
        }

        return member;
    }

    async getFullMemberByUserId(userId: string): Promise<OrganizationMember> {
        const member: OrganizationMember | null = await this.organizationMemberRepo.findOne({
            where: {userId},
            relations: {organization: true, user: true}
        });

        if (!member) {
            throw new UnauthorizedException({
                message: "Could not find any organization for this user",
                errorCode: ErrorCode.ORG_NOT_FOUND,
            });
        }

        return member;
    }

    async findMemberInOrg(id: string, organizationId: string): Promise<OrganizationMember | null> {
        return await this.organizationMemberRepo.findOne({
            where: [
                {id, organizationId},
                {userId: id, organizationId}
            ],
            relations: {user: true, organization: true}
        });
    }

    async findAllMembersByOrg(organization: Organization): Promise<OrganizationMember[]> {
        return await this.organizationMemberRepo.find({
            where: {organizationId: organization.id},
            relations: {user: true}
        });
    }

    async existsByEmail(email: string): Promise<boolean> {
        return await this.organizationMemberRepo.existsBy({user: {email}});
    }

    async getMemberByOrgId(orgId: string): Promise<OrganizationMember> {
        const member: OrganizationMember | null = await this.organizationMemberRepo.findOne({
            where: {organizationId: orgId},
            relations: {organization: true, user: false}
        });

        if (!member) {
            throw new UnauthorizedException({
                message: "Could not find organization member",
                errorCode: ErrorCode.ORG_MEMBER_NOT_FOUND,
            });
        }

        return member;
    }
}
