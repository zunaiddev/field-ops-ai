import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Technician} from "./entity/technician.entity.js";
import {DataSource, EntityManager, Repository} from "typeorm";
import {TechnicianAddressService} from "./technician-address.service.js";
import {CreateTechnicianReq} from "./dto/create-technician-req.dto.js";
import {OrganizationMember} from "../orgnization-member/entity/organization-member.entity.js";
import {TechnicianAddress} from "./entity/technician-address.entity.js";
import {TechnicianDto} from "./dto/technician.dto.js";
import {CreateSkillReq} from "./dto/create-skill.req.js";
import {Skill} from "./entity/skill.entity.js";
import {SkillDto} from "./dto/skill.dto.js";
import {ErrorCode} from "../../common/enums/error-code.enum.js";
import {UpdateSkillReq} from "./dto/update-skill-req.dto.js";
import {TechnicianSkill} from "./entity/technician-skill.entity.js";

@Injectable()
export class TechnicianService {
    constructor(@InjectRepository(Technician)
                private readonly technicianRepo: Repository<Technician>,
                @InjectRepository(Skill)
                private readonly skillRepo: Repository<Skill>,
                @InjectRepository(TechnicianSkill)
                private technicianSkillRepo: Repository<TechnicianSkill>,
                private readonly dataSource: DataSource,
                private readonly addressService: TechnicianAddressService) {
    }

    async save(technician: Partial<Technician>, manager?: EntityManager): Promise<Technician> {
        const repo: Repository<Technician> = manager?.getRepository(Technician) ?? this.technicianRepo;

        return repo.save(technician);
    }

    async saveSkill(skill: Partial<Skill>, manager?: EntityManager): Promise<Skill> {
        const repo: Repository<Skill> = manager?.getRepository(Skill) ?? this.skillRepo;

        return repo.save(skill);
    }

    async findAllSkillsByOrgId(orgId: number): Promise<Skill[]> {
        return await this.skillRepo.findBy({organizationId: orgId});
    }

    async findSkillByOrgId(id: number, orgId: number): Promise<Skill> {
        const skill = await this.skillRepo.findOneBy({id, organizationId: orgId});

        if (!skill) {
            throw new NotFoundException({
                message: "Skill not found",
                code: ErrorCode.SKILL_NOT_FOUND
            });
        }

        return skill;
    }

    async create(dto: CreateTechnicianReq, membership: OrganizationMember) {
        const technician = await this.dataSource.transaction(async manager => {
            const homeAddress: TechnicianAddress = await this.addressService.save(dto.homeAddress, manager);
            const currentAddress: TechnicianAddress = await this.addressService.save(dto.currentAddress, manager);

            return await this.save({
                homeAddress, currentAddress,
                organizationId: membership.organizationId,
                availabilityStatus: "AVAILABLE",
            }, manager);
        });

        return new TechnicianDto(technician);
    }

    async createSkill(skill: CreateSkillReq, membership: OrganizationMember): Promise<SkillDto> {
        return this.saveSkill({...skill, organizationId: membership.organizationId});
    }

    async getAllSkills(membership: OrganizationMember, value?: string): Promise<SkillDto[]> {
        return (await this.findAllSkillsByOrgId(membership.organizationId))
            .map(skill => new SkillDto(skill));
    }

    async getSkill(id: number, membership: OrganizationMember): Promise<SkillDto> {
        return new SkillDto(await this.findSkillByOrgId(id, membership.organizationId));
    }

    async updateSkill(id: number, dto: UpdateSkillReq, membership: OrganizationMember) {
        const skill: Skill = await this.findSkillByOrgId(id, membership.organizationId);

        if (dto.name) skill.name = dto.name;
        if (dto.description) skill.description = dto.description;

        return new SkillDto(await this.saveSkill(skill));
    }

    async deleteSkill(id: number, membership: OrganizationMember) {
        if (await this.technicianSkillRepo.existsBy({skillId: id})) {
            throw new BadRequestException({
                message: "This skill is associated with this technician",
                code: ErrorCode.SKILL_ASSOCIATED
            });
        }

        await this.skillRepo.delete({id, organizationId: membership.organizationId});
    }
}