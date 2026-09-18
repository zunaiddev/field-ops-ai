import {BadRequestException, ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {DataSource, EntityManager, Repository} from "typeorm";
import {Organization} from "./entity/organization.entity.js";
import {InjectDataSource, InjectRepository} from "@nestjs/typeorm";
import {User} from "../users/entity/user.entity.js";
import {OrganizationRes} from "./dto/organization-res.dto.js";
import {OrganizationMemberService} from "../orgnization-member/organization-member.service.js";
import {OrganizationMember, OrganizationRole} from "../orgnization-member/entity/organization-member.entity.js";
import {OrganizationUpdateReq} from "./dto/organization-update-req.dto.js";
import {AddMemberDto} from "./dto/add-member.dto.js";
import {UpdateMemberDto} from "./dto/update-member.dto.js";
import {UserService} from "../users/user.service.js";
import * as argon2 from "argon2";
import {OrganizationMembersRes} from "./dto/organization-members-res.dto.js";
import {UserDto} from "../users/dto/user.dto.js";

@Injectable()
export class OrganizationService {
    constructor(@InjectRepository(Organization) private readonly organizationRepo: Repository<Organization>,
                @InjectDataSource() private readonly dataSource: DataSource,
                private readonly userService: UserService,
                private readonly orgMemberService: OrganizationMemberService) {
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

    async getCurrent(orgMember: OrganizationMember): Promise<OrganizationRes> {
        return new OrganizationRes(orgMember);
    }

    async updateCurrent(orgMember: OrganizationMember, dto: OrganizationUpdateReq): Promise<OrganizationRes> {
        const organization: Organization = orgMember.organization;

        if (dto.slug !== organization.slug && dto.slug && await this.organizationRepo.existsBy({slug: dto.slug})) {
            throw new BadRequestException("Slug already exists");
        }

        Object.assign(organization, {
            ...(dto.name !== undefined && {name: dto.name}),
            ...(dto.timezone !== undefined && {timezone: dto.timezone}),
            ...(dto.currency !== undefined && {currency: dto.currency}),
            ...(dto.slug !== undefined && {slug: dto.slug}),
        });

        orgMember.organization = await this.organizationRepo.save(organization);
        return new OrganizationRes(orgMember);
    }

    async getCurrentMembers(orgMember: OrganizationMember): Promise<OrganizationMembersRes> {
        const members = await this.orgMemberService.findAllMembersByOrg(orgMember.organization);
        return new OrganizationMembersRes(orgMember.organization, members);
    }

    async addMember(organization: Organization, dto: AddMemberDto): Promise<OrganizationRes> {
        if (await this.orgMemberService.existsByEmail(dto.email)) {
            throw new ConflictException("user with email already exists");
        }

        const orgMember: OrganizationMember = await this.dataSource.transaction(async (manager: EntityManager): Promise<OrganizationMember> => {
            const user: User = await this.userService.save({
                ...dto,
                passwordHash: await argon2.hash(dto.password)
            }, manager);
            return await this.orgMemberService.save({user, organization, role: dto.role}, manager);
        });

        return new OrganizationRes(orgMember);
    }

    async updateMember(id: string, orgMember: OrganizationMember, dto: UpdateMemberDto): Promise<UserDto> {
        const orgId: string = orgMember.organization?.id ?? orgMember.organizationId;
        const member = await this.orgMemberService.findMemberInOrg(id, orgId);

        if (!member) {
            throw new NotFoundException("Member not found in this organization");
        }

        if (dto.role && member.role === OrganizationRole.ORG_OWNER) {
            throw new BadRequestException("Organization owner role cannot be modified");
        }

        if (dto.email && dto.email !== member.user.email) {
            if (await this.userService.existsByEmail(dto.email)) {
                throw new ConflictException("User with this email already exists");
            }
        }

        let passwordHash: string | undefined;
        if (dto.password) {
            passwordHash = await argon2.hash(dto.password);
        }

        await this.dataSource.transaction(async (manager: EntityManager): Promise<void> => {
            if (
                dto.firstName !== undefined ||
                dto.lastName !== undefined ||
                dto.email !== undefined ||
                passwordHash !== undefined ||
                dto.status !== undefined
            ) {
                Object.assign(member.user, {
                    ...(dto.firstName !== undefined && {firstName: dto.firstName}),
                    ...(dto.lastName !== undefined && {lastName: dto.lastName}),
                    ...(dto.email !== undefined && {email: dto.email}),
                    ...(passwordHash !== undefined && {passwordHash}),
                    ...(dto.status !== undefined && {status: dto.status}),
                });
                await this.userService.save(member.user, manager);
            }

            if (dto.role !== undefined) {
                member.role = dto.role;
                await this.orgMemberService.save(member, manager);
            }
        });

        return new UserDto(member.user, member.role);
    }

    async deleteMember(id: string, orgMember: OrganizationMember): Promise<void> {
        const orgId: string = orgMember.organization?.id ?? orgMember.organizationId;
        const member = await this.orgMemberService.findMemberInOrg(id, orgId);

        if (!member) {
            throw new NotFoundException("Member not found in this organization");
        }

        await this.userService.delete(member.userId);
    }
}
