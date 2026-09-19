import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {DataSource, EntityManager, FindOptionsWhere, ILike, Repository} from "typeorm";
import {Customer} from "./entity/customer.entity.js";
import {InjectDataSource, InjectRepository} from "@nestjs/typeorm";
import {OrganizationMember} from "../orgnization-member/entity/organization-member.entity.js";
import {CreateCustomerReq} from "./dto/create-customer.dto.js";
import {CustomerAddress} from "./entity/customer-address.entity.js";
import {CreateAddressDto} from "./dto/create-address.dto.js";
import {UpdateAddressDto} from "./dto/update-address.dto.js";
import {CustomerAddressRes} from "./dto/customer-address-res.dto.js";
import {CustomerRes} from "./dto/customer-res.dto.js";
import {PaginatedCustomersRes} from "./dto/paginated-customers-res.dto.js";
import {UpdateCustomerDto} from "./dto/update-customer.dto.js";
import {CustomerHistory, CustomerHistoryAction} from "./entity/customer-history.js";

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
    constructor(@InjectRepository(Customer) private readonly customerRepo: Repository<Customer>,
                @InjectDataSource() private readonly dataSource: DataSource,
                @InjectRepository(CustomerAddress) private readonly addressRepo: Repository<CustomerAddress>,
                @InjectRepository(CustomerHistory) private readonly historyRepo: Repository<CustomerHistory>) {
    }

    private async existsByEmail(email: string): Promise<boolean> {
        return await this.customerRepo.existsBy({email});
    }

    private async findByIdAndOrgId(customerId: string, orgId: string): Promise<Customer> {
        const customer: Customer | null = await this.customerRepo
            .findOneBy({id: customerId, organizationId: orgId});
        if (!customer) {
            throw new NotFoundException("could not found customer in current organization");
        }

        return customer;
    }

    private async findAllByOrgIdAndOptions(orgId: string, options?: GetCustomersOptions): Promise<[Customer[], number]> {
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

        return await this.customerRepo.findAndCount({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
    }

    private async deleteByIdAndOrgId(customerId: string, orgId: string, manager?: EntityManager): Promise<void> {
        const repository: Repository<Customer> = manager ?
            manager.getRepository(Customer) : this.customerRepo;

        await repository.delete({id: customerId, organizationId: orgId});
    }

    private async saveHistory(history: Omit<CustomerHistory, 'id' | 'createdAt'>, manager?: EntityManager): Promise<CustomerHistory> {
        const repository: Repository<CustomerHistory> = manager
            ? manager.getRepository(CustomerHistory) : this.historyRepo;
        return await repository.save(history);
    }

    private async findAddressByIdAndOrgId(addressId: string, organizationId: string): Promise<CustomerAddress> {
        const address: CustomerAddress | null = await this.addressRepo
            .findOne({
                where: {id: addressId, customer: {organizationId}},
                relations: {customer: true},
            });

        if (!address) {
            throw new NotFoundException("could not find address");
        }

        return address;
    }

    private async saveCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>,
                               manager?: EntityManager): Promise<Customer> {
        const repository: Repository<Customer> = manager
            ? manager.getRepository(Customer) : this.customerRepo;

        return await repository.save(customer);
    }

    async create(membership: OrganizationMember, dto: CreateCustomerReq): Promise<CustomerRes> {
        if (await this.existsByEmail(dto.email)) {
            throw new ConflictException("Email already exists");
        }

        const customer: Customer = await this.dataSource.transaction(async manager => {
            const customer: Customer = await this.saveCustomer({
                ...dto, status: dto.status ?? 'ACTIVE',
                organizationId: membership.organizationId
            }, manager);

            await this.saveHistory({
                action: CustomerHistoryAction.CREATED,
                createdBy: membership.userId,
                customer,
                organizationId: membership.organizationId,
                description: "Customer is created"
            }, manager);

            return customer;
        });

        return new CustomerRes(customer);
    }

    async addAddress(customerId: string, dto: CreateAddressDto,
                     membership: OrganizationMember): Promise<CustomerAddressRes> {
        const customer: Customer = await this.findByIdAndOrgId(customerId, membership.organizationId);

        const address = await this.dataSource.transaction(async manager => {
            const address: CustomerAddress = await manager.getRepository(CustomerAddress)
                .save({...dto, customer: customer});

            await this.saveHistory({
                customer, action: CustomerHistoryAction.ADDRESS_CREATED,
                description: "Address Created", createdBy: membership.userId,
                organizationId: membership.organizationId
            }, manager);

            return address;
        });

        return new CustomerAddressRes(address);
    }

    async updateAddress(addressId: string, dto: UpdateAddressDto,
                        membership: OrganizationMember): Promise<CustomerAddressRes> {
        const address: CustomerAddress = await this.findAddressByIdAndOrgId(addressId, membership.organizationId);

        const updatedAddress: CustomerAddress = await this.dataSource.transaction(async manager => {
            const updated: CustomerAddress = await manager.getRepository(CustomerAddress)
                .save({...address, ...dto});

            await this.saveHistory({
                customer: address.customer,
                action: CustomerHistoryAction.ADDRESS_UPDATED,
                description: "Address Updated",
                createdBy: membership.userId,
                organizationId: membership.organizationId
            }, manager);

            return updated;
        });

        return new CustomerAddressRes(updatedAddress);
    }

    async deleteAddress(addressId: string, membership: OrganizationMember): Promise<void> {
        const address: CustomerAddress = await this.findAddressByIdAndOrgId(addressId, membership.organizationId);

        await this.dataSource.transaction(async manager => {
            await manager.getRepository(CustomerAddress).delete({id: addressId});

            await this.saveHistory({
                customer: address.customer,
                action: CustomerHistoryAction.ADDRESS_DELETED,
                description: `Address (${address.addressLine1}, ${address.city}) deleted`,
                createdBy: membership.userId,
                organizationId: membership.organizationId
            }, manager);
        });
    }

    async getCustomer(customerId: string, membership: OrganizationMember): Promise<CustomerRes> {
        const customer: Customer = await this.findByIdAndOrgId(customerId, membership.organizationId);

        const addresses: CustomerAddress[] = await this.addressRepo.findBy({customerId: customer.id});

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

        const updatedCustomer: Customer = await this.dataSource.transaction(async manager => {
            const updatedCustomer: Customer = await manager.getRepository(Customer)
                .save({...customer, ...dto});

            await this.saveHistory({
                customer, action: CustomerHistoryAction.UPDATED,
                description: "Customer Updated", createdBy: membership.userId,
                organizationId: membership.organizationId
            }, manager);

            return updatedCustomer;
        });

        return new CustomerRes(updatedCustomer);
    }

    async deleteCustomer(customerId: string, membership: OrganizationMember): Promise<void> {
        const customer = await this.findByIdAndOrgId(customerId, membership.organizationId);

        if (customer.organizationId !== membership.organizationId) {
            throw new NotFoundException("Could not find customer in current organization");
        }

        await this.dataSource.transaction(async manager => {
            await this.deleteByIdAndOrgId(customerId, membership.organizationId, manager);

            await this.saveHistory({
                customer,
                action: CustomerHistoryAction.DELETED,
                description: `user named ${customer.name} and email ${customer.email} has been deleted`,
                createdBy: membership.userId,
                organizationId: membership.organizationId
            }, manager);
        });
    }

    async getAddress(customerId: string, member: OrganizationMember): Promise<CustomerAddressRes[]> {
        const addresses: CustomerAddress[] = await this.addressRepo
            .findBy({customer: {id: customerId, organizationId: member.organizationId}});

        return addresses.map(address => new CustomerAddressRes(address));
    }
}