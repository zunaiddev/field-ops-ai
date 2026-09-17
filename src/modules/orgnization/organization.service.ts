import {Injectable} from '@nestjs/common';
import {EntityManager, Repository} from "typeorm";
import {Organization} from "./entity/organization.entity.js";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class OrganizationService {
    constructor(@InjectRepository(Organization) private readonly organizationRepo: Repository<Organization>) {
    }

    async save(organization: Partial<Organization>, entityManager?: EntityManager): Promise<Organization> {
        const repo = entityManager
            ? entityManager.getRepository(Organization) : this.organizationRepo;
        return await repo.save(organization);
    }

    async findById(id: string): Promise<Organization> {
        return await this.organizationRepo.findOneByOrFail({id});
    }

    async findBySlug(slug: string): Promise<Organization | null> {
        return await this.organizationRepo.findOneBy({slug});
    }

    async existsBySlug(slug: string): Promise<boolean> {
        return await this.organizationRepo.existsBy({slug});
    }
}