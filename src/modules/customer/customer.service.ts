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
import {EventBusService} from "../../common/events/event-bus.service.js";
import {EventName} from "../../common/events/event.types.js";
import {ErrorCode} from "../../common/enums/error-code.enum.js";

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
                @InjectRepository(CustomerHistory) private readonly historyRepo: Repository<CustomerHistory>,
                private readonly eventBusService: EventBusService) {
    }

    private async existsByEmail(email: string): Promise<boolean> {
        return await this.customerRepo.existsBy({email});
    }

    private async findByIdAndOrgId(customerId: number, orgId: number): Promise<Customer> {
        const customer: Customer | null = await this.customerRepo
            .findOneBy({id: customerId, organizationId: orgId});
        if (!customer) {
            throw new NotFoundException({
                message: "could not found customer in current organization",
                errorCode: ErrorCode.CUSTOMER_NOT_FOUND,
            });
        }

        return customer;
    }

    private async findAllByOrgIdAndOptions(orgId: number, options?: GetCustomersOptions): Promise<[Customer[], number]> {
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

    private async deleteByIdAndOrgId(customerId: number, orgId: number, manager?: EntityManager): Promise<void> {
        const repository: Repository<Customer> = manager ?
            manager.getRepository(Customer) : this.customerRepo;

        await repository.delete({id: customerId, organizationId: orgId});
    }

    private async saveHistory(history: Omit<CustomerHistory, 'id' | 'createdAt'>, manager?: EntityManager): Promise<CustomerHistory> {
        const repository: Repository<CustomerHistory> = manager
            ? manager.getRepository(CustomerHistory) : this.historyRepo;
        return await repository.save(history);
    }

    private async findAddressByIdAndOrgId(addressId: number, organizationId: number): Promise<CustomerAddress> {
        const address: CustomerAddress | null = await this.addressRepo
            .findOne({
                where: {id: addressId, customer: {organizationId}},
                relations: {customer: true},
            });

        if (!address) {
            throw new NotFoundException({
                message: "could not find address",
                errorCode: ErrorCode.ADDRESS_NOT_FOUND,
            });
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
            throw new ConflictException({
                message: "Email already exists",
                errorCode: ErrorCode.EMAIL_ALREADY_EXISTS,
            });
        }

        const customer: Customer = await this.dataSource.transaction(async manager => {
            const customer: Customer = await this.saveCustomer({
                ...dto, status: dto.status ?? 'ACTIVE',
                organizationId: membership.organizationId
            }, manager);

            await this.saveHistory({
                action: CustomerHistoryAction.CREATED,
                createdBy: membership.employeeId,
                customer,
                organizationId: membership.organizationId,
                description: "Customer is created"
            }, manager);

            return customer;
        });

        await this.eventBusService.publish(EventName.CUSTOMER_CREATED, {
            customerId: customer.id,
            organizationId: customer.organizationId,
            userId: membership.employeeId,
        });

        return new CustomerRes(customer);
    }

    async addAddress(customerId: number, dto: CreateAddressDto,
                     membership: OrganizationMember): Promise<CustomerAddressRes> {
        const customer: Customer = await this.findByIdAndOrgId(customerId, membership.organizationId);

        const address = await this.dataSource.transaction(async manager => {
            const address: CustomerAddress = await manager.getRepository(CustomerAddress)
                .save({...dto, customer: customer});

            await this.saveHistory({
                customer, action: CustomerHistoryAction.ADDRESS_CREATED,
                description: "Address Created", createdBy: membership.employeeId,
                organizationId: membership.organizationId
            }, manager);

            return address;
        });

        await this.eventBusService.publish(EventName.CUSTOMER_ADDRESS_CREATED, {
            customerId: customer.id,
            organizationId: customer.organizationId,
            userId: membership.employeeId,
        });

        return new CustomerAddressRes(address);
    }

    async updateAddress(addressId: number, dto: UpdateAddressDto,
                        membership: OrganizationMember): Promise<CustomerAddressRes> {
        const address: CustomerAddress = await this.findAddressByIdAndOrgId(addressId, membership.organizationId);

        const updatedAddress: CustomerAddress = await this.dataSource.transaction(async manager => {
            const updated: CustomerAddress = await manager.getRepository(CustomerAddress)
                .save({...address, ...dto});

            await this.saveHistory({
                customer: address.customer,
                action: CustomerHistoryAction.ADDRESS_UPDATED,
                description: "Address Updated",
                createdBy: membership.employeeId,
                organizationId: membership.organizationId
            }, manager);

            return updated;
        });

        return new CustomerAddressRes(updatedAddress);
    }

    async deleteAddress(addressId: number, membership: OrganizationMember): Promise<void> {
        const address: CustomerAddress = await this.findAddressByIdAndOrgId(addressId, membership.organizationId);

        await this.dataSource.transaction(async manager => {
            await manager.getRepository(CustomerAddress).delete({id: addressId});

            await this.saveHistory({
                customer: address.customer,
                action: CustomerHistoryAction.ADDRESS_DELETED,
                description: `Address (${address.addressLine1}, ${address.city}) deleted`,
                createdBy: membership.employeeId,
                organizationId: membership.organizationId
            }, manager);
        });
    }

    async getCustomer(customerId: number, membership: OrganizationMember): Promise<CustomerRes> {
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

    async updateCustomer(customerId: number, dto: UpdateCustomerDto,
                         membership: OrganizationMember): Promise<CustomerRes> {
        const customer: Customer = await this.findByIdAndOrgId(customerId, membership.organizationId);

        if (!customer) {
            throw new NotFoundException({
                message: "could not find customer in current organization",
                errorCode: ErrorCode.CUSTOMER_NOT_FOUND,
            });
        }

        if (dto.email && await this.existsByEmail(dto.email)) {
            throw new ConflictException({
                message: `Customer with email ${dto.email} already exists`,
                errorCode: ErrorCode.CUSTOMER_EMAIL_ALREADY_EXISTS,
            });
        }

        const updatedCustomer: Customer = await this.dataSource.transaction(async manager => {
            const updatedCustomer: Customer = await manager.getRepository(Customer)
                .save({...customer, ...dto});

            await this.saveHistory({
                customer, action: CustomerHistoryAction.UPDATED,
                description: "Customer Updated", createdBy: membership.employeeId,
                organizationId: membership.organizationId
            }, manager);

            return updatedCustomer;
        });

        await this.eventBusService.publish(EventName.CUSTOMER_UPDATED, {
            customerId: customer.id,
            organizationId: customer.organizationId,
            userId: membership.employeeId,
        });

        return new CustomerRes(updatedCustomer);
    }

    async deleteCustomer(customerId: number, membership: OrganizationMember): Promise<void> {
        const customer = await this.findByIdAndOrgId(customerId, membership.organizationId);

        if (customer.organizationId !== membership.organizationId) {
            throw new NotFoundException({
                message: "Could not find customer in current organization",
                errorCode: ErrorCode.CUSTOMER_NOT_FOUND,
            });
        }

        await this.dataSource.transaction(async manager => {
            await this.deleteByIdAndOrgId(customerId, membership.organizationId, manager);

            await this.saveHistory({
                customer,
                action: CustomerHistoryAction.DELETED,
                description: `user named ${customer.name} and email ${customer.email} has been deleted`,
                createdBy: membership.employeeId,
                organizationId: membership.organizationId
            }, manager);
        });

        await this.eventBusService.publish(EventName.CUSTOMER_DELETED, {
            customerId: customer.id,
            organizationId: customer.organizationId,
            userId: membership.employeeId,
        });
    }

    async getAddress(customerId: number, member: OrganizationMember): Promise<CustomerAddressRes[]> {
        const addresses: CustomerAddress[] = await this.addressRepo
            .findBy({customer: {id: customerId, organizationId: member.organizationId}});

        return addresses.map(address => new CustomerAddressRes(address));
    }
}
