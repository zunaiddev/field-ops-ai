import {ConflictException, Injectable} from '@nestjs/common';
import {Repository} from "typeorm";
import {Customer} from "./entity/customer.entity.js";
import {InjectRepository} from "@nestjs/typeorm";
import {OrganizationMember} from "../orgnization-member/entity/organization-member.entity.js";
import {CreateCustomerReq} from "./dto/add-customer-req.dto.js";

@Injectable()
export class CustomerService {
    constructor(@InjectRepository(Customer) private readonly repo: Repository<Customer>) {
    }

    async existsByEmail(email: string): Promise<boolean> {
        return await this.repo.existsBy({email});
    }

    async create(membership: OrganizationMember, dto: CreateCustomerReq): Promise<Customer> {
        if (await this.existsByEmail(dto.email)) {
            throw new ConflictException("Email already exists");
        }

        return await this.repo.save({...dto, organizationId: membership.organizationId});
    }
}