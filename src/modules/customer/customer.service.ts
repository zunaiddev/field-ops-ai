import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {FindOptionsWhere, ILike, Repository} from "typeorm";
import {Customer} from "./entity/customer.entity.js";
import {InjectRepository} from "@nestjs/typeorm";
import {OrganizationMember} from "../orgnization-member/entity/organization-member.entity.js";
import {CreateCustomerReq} from "./dto/create-customer.dto.js";
import {CustomerAddress} from "./entity/customer-address.entity.js";
import {CreateAddressDto} from "./dto/create-address.dto.js";
import {CustomerAddressRes} from "./dto/customer-address-res.dto.js";
import {CustomerRes} from "./dto/customer-res.dto.js";
import {PaginatedCustomersRes} from "./dto/paginated-customers-res.dto.js";
import {UpdateCustomerDto} from "./dto/update-customer.dto.js";

export interface CustomerSearchOptions {
    email?: string;
    name?: string;
}

export interface GetCustomersOptions {
    page?: number;
    pageSize?: number;
    search?: CustomerSearchOptions;
}

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

    async findAllByOrgIdAndOptions(orgId: string, options?: GetCustomersOptions): Promise<[Customer[], number]> {
        const where: FindOptionsWhere<Customer> = {
            organizationId: orgId,
        };

        if (options?.search?.name) {
            where.name = ILike(`%${options.search.name}%`);
        }

        if (options?.search?.email) {
            where.email = ILike(`%${options.search.email}%`);
        }

        const page = options?.page ?? 1;
        const pageSize = options?.pageSize ?? 10;

        return await this.repo.findAndCount({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
    }

    async deleteByIdAndOrgId(customerId: string, orgId: string): Promise<void> {
        await this.repo.delete({id: customerId, organizationId: orgId});
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

    async getCustomers(
        membership: OrganizationMember,
        {
            page = 1,
            pageSize = 10,
            search = {email: '', name: ''}
        }: GetCustomersOptions = {}): Promise<PaginatedCustomersRes> {
        const [customers, total] = await this.findAllByOrgIdAndOptions(membership.organizationId, {
            page,
            pageSize,
            search,
        });

        const customerResponses = customers.map(customer => new CustomerRes(customer));
        return new PaginatedCustomersRes(customerResponses, total, page, pageSize);
    }

    async updateCustomer(customerId: string, dto: UpdateCustomerDto,
                         membership: OrganizationMember): Promise<CustomerRes> {
        const customer: Customer = await this.findByIdAndOrgId(customerId, membership.organizationId);

        if (!customer) {
            throw new NotFoundException("could not find customer in current organization");
        }

        if (dto.email && await this.existsByEmail(dto.email)) {
            throw new ConflictException(`Customer with email ${dto.email} already exists`);
        }

        const updatedCustomer: Customer = await this.repo.save({...customer, ...dto});

        return new CustomerRes(updatedCustomer);
    }

    async deleteCustomer(customerId: string, membership: OrganizationMember): Promise<void> {
        const customer = await this.findByIdAndOrgId(customerId, membership.organizationId);

        if (customer.organizationId !== membership.organizationId) {
            throw new NotFoundException("Could not find customer in current organization");
        }

        await this.deleteByIdAndOrgId(customerId, membership.organizationId);
    }
}
