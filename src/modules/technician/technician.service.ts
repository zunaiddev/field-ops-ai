import {BadRequestException, ConflictException, Injectable, NotFoundException} from '@nestjs/common';
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
import {OrganizationMemberService} from "../orgnization-member/organization-member.service.js";
import {EmployeeRole} from "../employee/entity/employee.entity.js";
import {TechnicianAddressDto} from "./dto/technician-address.dto.js";
import {TechnicianAddressRes} from "./dto/technician-address-res.dto.js";

@Injectable()
export class TechnicianService {
    constructor(@InjectRepository(Technician)
                private readonly technicianRepo: Repository<Technician>,
                @InjectRepository(Skill)
                private readonly skillRepo: Repository<Skill>,
                @InjectRepository(TechnicianSkill)
                private technicianSkillRepo: Repository<TechnicianSkill>,
                private readonly orgMemberService: OrganizationMemberService,
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
        const orgMember =
            await this.orgMemberService.findMemberInOrg(dto.employeeId, membership.organizationId);

        if (!orgMember || !orgMember.employee) {
            throw new NotFoundException({
                message: "employee not found",
                code: ErrorCode.MEMBER_NOT_FOUND
            });
        }

        if (orgMember.employee.role !== EmployeeRole.TECHNICIAN) {
            throw new BadRequestException({
                message: "employee role must be Technician",
                code: ErrorCode.INVALID_EMPLOYEE_ROLE
            });
        }

        if (await this.technicianRepo.existsBy({employee: {id: dto.employeeId}})) {
            throw new ConflictException({
                message: "Technician already exists",
                code: ErrorCode.TECHNICIAN_ALREADY_EXISTS
            });
        }

        const skills: Skill[] = await this.skillRepo.findBy(dto.skills
            .map(s => ({id: s, organizationId: membership.organizationId})));

        if (skills.length !== dto.skills.length) {
            throw new NotFoundException({
                message: "Could not found all the skills",
                code: ErrorCode.SKILL_NOT_FOUND
            });
        }

        const technician: Technician = await this.dataSource.transaction(async manager => {
            const homeAddress: TechnicianAddress = await this.addressService.save(dto.homeAddress, manager);
            const currentAddress: TechnicianAddress = await this.addressService.save(dto.currentAddress, manager);

            const technician: Technician = await this.save({
                employee: orgMember.employee,
                homeAddress, currentAddress,
                organizationId: membership.organizationId,
                availabilityStatus: "AVAILABLE",
                status: "ACTIVE"
            }, manager);

            await manager.getRepository(TechnicianSkill).save(skills.map(s => ({
                skillId: s.id,
                skill: s,
                technicianId: technician.id,
                technician: technician,
            })));

            return technician;
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

    async getAllTechnicianForSkill(skillId: number, membership: OrganizationMember) {
        return await this.technicianSkillRepo.find({
            where: {skillId: skillId, technician: {organizationId: membership.organizationId}},
            relations: {technician: true}
        });
    }

    async getTechnicians(membership: OrganizationMember) {
        return (await this.technicianRepo.find({
            where: {organizationId: membership.organizationId},
            relations: {employee: true, homeAddress: true, currentAddress: true}
        })).map(technician => new TechnicianDto(technician));
    }

    async getTechnicianSkills(technicianId: number, member: OrganizationMember) {
        return (await this.technicianSkillRepo.find({
            where: {technician: {id: technicianId, organizationId: member.organizationId}},
            relations: {skill: true}
        })).map(ts => new SkillDto(ts.skill));
    }

    async updateAddress(technicianId: number, addressId: number, dto: TechnicianAddressDto, member: OrganizationMember) {
        const technician = await this.technicianRepo.findOne({
            where: {id: technicianId, organizationId: member.organizationId},
            relations: {homeAddress: true, currentAddress: true}
        });

        if (!technician) {
            throw new NotFoundException({
                message: "Technician not found",
                code: ErrorCode.TECHNICIAN_NOT_FOUND
            });
        }

        const address = technician.homeAddress.id === addressId ? technician.homeAddress :
            technician.currentAddress.id === addressId ? technician.currentAddress : null;

        if (!address) {
            throw new NotFoundException({
                message: "Address not found",
                code: ErrorCode.ADDRESS_NOT_FOUND
            });
        }

        Object.assign(address, dto);
        const updatesAddress = await this.addressService.save(address);

        return new TechnicianAddressRes(updatesAddress);
    }


    async addSkill(technicianId: number, skillId: number, member: OrganizationMember) {
        const technician = await this.technicianRepo.findOne({
            where: {id: technicianId, organizationId: member.organizationId},
        });

        if (!technician) {
            throw new NotFoundException({
                message: "Technician not found",
                code: ErrorCode.TECHNICIAN_NOT_FOUND
            });
        }

        const skill = await this.skillRepo.findOneBy({id: skillId, organizationId: member.organizationId});

        if (!skill) {
            throw new NotFoundException({
                message: "skill not found",
                code: ErrorCode.SKILL_NOT_FOUND
            });
        }

        const exists: boolean = await this.technicianSkillRepo.existsBy({
            skillId: skillId,
            technicianId: technicianId,
        });

        if (exists) {
            throw new ConflictException({
                message: "Skill is already associated with technician",
                code: ErrorCode.SKILL_ASSOCIATED
            });
        }

        await this.technicianSkillRepo.save({
            skillId: skill.id,
            skill: skill,
            technicianId: technician.id,
            technician: technician
        });

        return new SkillDto(skill);
    }

    async removeSkill(technicianId: number, skillId: number, member: OrganizationMember) {
        const technicianSkill = await this.technicianSkillRepo.findOneBy({
            skillId,
            technician: {id: technicianId, organizationId: member.organizationId}
        });

        if (!technicianSkill) {
            throw new NotFoundException({
                message: "Technician Skill not found",
                code: ErrorCode.SKILL_NOT_FOUND
            });
        }

        await this.technicianSkillRepo.delete(technicianSkill);
    }

    async deleteTechnician(technicianId: number, member: OrganizationMember) {
        const technician = await this.technicianRepo.findOne({
            where: {id: technicianId, organizationId: member.organizationId},
            relations: {homeAddress: true, currentAddress: true}
        });

        if (!technician) {
            throw new NotFoundException({
                message: "Technician not found",
                code: ErrorCode.TECHNICIAN_NOT_FOUND
            });
        }

        await this.dataSource.transaction(async manager => {
            const skillRepo = manager.getRepository(TechnicianSkill);
            const addressRepo = manager.getRepository(TechnicianAddress);

            await skillRepo.delete({technicianId: technician.id});
            await manager.getRepository(Technician).delete({id: technician.id});

            await Promise.all([addressRepo.delete({id: technician.homeAddress.id}),
                addressRepo.delete({id: technician.currentAddress.id})]);
        });
    }
}
