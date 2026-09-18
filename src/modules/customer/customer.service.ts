import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {Repository} from "typeorm";
import {Customer} from "./entity/customer.entity.js";
import {InjectRepository} from "@nestjs/typeorm";
import {OrganizationMember} from "../orgnization-member/entity/organization-member.entity.js";
import {CreateCustomerReq} from "./dto/create-customer.dto.js";
import {CustomerAddress} from "./entity/customer-address.entity.js";
import {CreateAddressDto} from "./dto/create-address.dto.js";
import {CustomerAddressRes} from "./dto/customer-address-res.dto.js";
import {CustomerRes} from "./dto/customer-res.dto.js";

@Injectable()
export class CustomerService {
    constructor(@InjectRepository(Customer) private readonly repo: Repository<Customer>,
                @InjectRepository(CustomerAddress) private readonly addressRepo: Repository<CustomerAddress>) {
    }

    async existsByEmail(email: string): Promise<boolean> {
        return await this.repo.existsBy({email});
    }

    async findByIdAndOrgId(customerId: string, orgId: string): Promise<Customer> {
        const customer: Customer | null = await this.repo
            .findOneBy({id: customerId, organizationId: orgId});
        if (!customer) {
            throw new NotFoundException("could not found customer in current organization");
        }

        return customer;
    }

    async create(membership: OrganizationMember, dto: CreateCustomerReq): Promise<Customer> {
        if (await this.existsByEmail(dto.email)) {
            throw new ConflictException("Email already exists");
        }

        return await this.repo.save({...dto, organizationId: membership.organizationId});
    }

    async addAddress(customerId: string, dto: CreateAddressDto,
                     membership: OrganizationMember): Promise<CustomerAddressRes> {
        const customer: Customer = await this.findByIdAndOrgId(customerId, membership.organizationId);

        const address: CustomerAddress = await this.addressRepo.save({...dto, customer: customer});
        return new CustomerAddressRes(address);
    }

    async getCustomer(customerId: string, membership: OrganizationMember): Promise<CustomerRes> {
        const customer = await this.findByIdAndOrgId(customerId, membership.organizationId);

        const addresses = await this.addressRepo.findBy({customerId: customer.id});

        return new CustomerRes(customer, addresses);
    }
}
