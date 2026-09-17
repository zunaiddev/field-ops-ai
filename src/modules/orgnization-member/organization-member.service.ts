import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {OrganizationMember} from "./entity/orgnization-member.entity.js";
import {DeepPartial, EntityManager, Repository} from "typeorm";

@Injectable()
export class OrganizationMemberService {
    constructor(@InjectRepository(OrganizationMember) private readonly organizationMemberRepo: Repository<OrganizationMember>) {
    }

    async save(organization: DeepPartial<OrganizationMember>, entityManager?: EntityManager): Promise<OrganizationMember> {
        const repo = entityManager
            ? entityManager.getRepository(OrganizationMember) : this.organizationMemberRepo;
        return await repo.save(organization);
    }
}
