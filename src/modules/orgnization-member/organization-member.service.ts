import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {OrganizationMember} from "./entity/organization-member.entity.js";
import {DeepPartial, EntityManager, Repository} from "typeorm";
import {User} from "../users/entity/user.entity.js";
import {Organization} from "../orgnization/entity/organization.entity.js";

@Injectable()
export class OrganizationMemberService {
    constructor(@InjectRepository(OrganizationMember) private readonly organizationMemberRepo: Repository<OrganizationMember>) {
    }

    async save(organization: DeepPartial<OrganizationMember>, entityManager?: EntityManager): Promise<OrganizationMember> {
        const repo = entityManager
            ? entityManager.getRepository(OrganizationMember) : this.organizationMemberRepo;
        return await repo.save(organization);
    }

    async findByUserOrThrow(user: User): Promise<OrganizationMember> {
        const member = await this.organizationMemberRepo.findOne({
            where: {userId: user.id},
            relations: {organization: true},
        });

        if (!member) {
            throw new BadRequestException(`Could not found org details for email ${user.email}`)
        }

        return member;
    }

    async getFullMemberByUserId(userId: string): Promise<OrganizationMember> {
        const member: OrganizationMember | null = await this.organizationMemberRepo.findOne({
            where: {userId},
            relations: {organization: true, user: true}
        });

        if (!member) {
            throw new UnauthorizedException("Could not find any organization for this user");
        }

        return member;
    }

    async findMemberInOrg(id: string, organizationId: string): Promise<OrganizationMember | null> {
        return await this.organizationMemberRepo.findOne({
            where: [
                { id, organizationId },
                { userId: id, organizationId }
            ],
            relations: { user: true, organization: true }
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
}
