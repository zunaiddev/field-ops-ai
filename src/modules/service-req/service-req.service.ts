import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {ServiceRequest} from "./entity/service-req.entity.js";
import {FindOptionsWhere, ILike, Repository} from "typeorm";
import {CreateServiceReq} from "./dto/create-service-request.dto.js";
import {ServiceRequestQuery} from "./dto/service-request-query.dto.js";
import {UpdateServiceReq} from "./dto/update-service-request.dto.js";
import {OrganizationMember} from "../orgnization-member/entity/organization-member.entity.js";
import {CustomerService} from "../customer/customer.service.js";
import {ServiceRequestSource, ServiceRequestStatus} from "./entity/service-req.enums.js";
import {ErrorCode} from "../../common/enums/error-code.enum.js";
import {ServiceReqDto} from "./dto/service-req.dto.js";
import {PaginatedServiceRequestsRes} from "./dto/paginated-service-req-res.dto.js";

@Injectable()
export class ServiceReqService {
    constructor(@InjectRepository(ServiceRequest) private serviceRepo: Repository<ServiceRequest>,
                private readonly customerService: CustomerService) {
    }

    async save(serviceReq: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceRequest> {
        return await this.serviceRepo.save(serviceReq);
    }

    async update(serviceReq: Partial<ServiceRequest>): Promise<ServiceRequest> {
        if (!serviceReq.id) {
            throw new Error("Service id is required while updating");
        }

        return await this.serviceRepo.save(serviceReq);
    }

    async findByIdAndOrgId(id: number, orgId: number): Promise<ServiceRequest> {
        const serviceReq = await this.serviceRepo.findOneBy({id, organizationId: orgId})
        if (!serviceReq) {
            throw new NotFoundException({
                message: "Could not find service req",
                code: ErrorCode.SERVICE_REQ_NOT_FOUND
            });
        }

        return serviceReq;
    }

    async findAllByQueryAndOrgId(query: ServiceRequestQuery, orgId: number): Promise<[ServiceRequest[], number]> {
        const where: FindOptionsWhere<ServiceRequest> = {
            organizationId: orgId,
        };

        if (query.category) {
            where.category = query.category;
        }

        if (query.priority) {
            where.priority = query.priority;
        }

        if (query.status) {
            where.status = query.status;
        }

        if (query.source) {
            where.source = query.source;
        }

        if (query.customerId) {
            where.customerId = Number(query.customerId);
        }

        let whereClause: FindOptionsWhere<ServiceRequest> | FindOptionsWhere<ServiceRequest>[] = where;

        if (query.search) {
            whereClause = [
                {...where, title: ILike(`%${query.search}%`)},
                {...where, description: ILike(`%${query.search}%`)},
            ];
        }

        const page = query.page ? Number(query.page) : 1;
        const pageSize = query.pageSize ? Number(query.pageSize) : 10;

        return await this.serviceRepo.findAndCount({
            where: whereClause,
            skip: (page - 1) * pageSize,
            take: pageSize,
        });
    }

    async create(dto: CreateServiceReq, membership: OrganizationMember) {
        const [customerExists, addressExists] = await Promise.all([
            this.customerService.existsByIdAndOrgId(dto.customerId, membership.organizationId),
            this.customerService.addressExistsByIdAndCustomerId(dto.addressId, dto.customerId)
        ]);

        if (!customerExists) {
            throw new NotFoundException({
                message: "Customer not found",
                code: ErrorCode.CUSTOMER_NOT_FOUND,
            });
        }

        if (!addressExists) {
            throw new NotFoundException({
                message: "Address not found",
                code: ErrorCode.ADDRESS_NOT_FOUND,
            });
        }

        const serviceReq: ServiceRequest = await
            this.save({
                ...dto,
                organizationId: membership.organizationId, createdBy: membership.employeeId,
                status: ServiceRequestStatus.NEW, requestedAt: new Date(),
                source: ServiceRequestSource.EMPLOYEE
            });

        return new ServiceReqDto(serviceReq);
    }

    async findAll(query: ServiceRequestQuery, membership: OrganizationMember): Promise<PaginatedServiceRequestsRes> {
        const [serviceRequests, total] = await this.findAllByQueryAndOrgId(query, membership.organizationId);
        const page = query.page ? Number(query.page) : 1;
        const pageSize = query.pageSize ? Number(query.pageSize) : 10;
        const data = serviceRequests.map(item => new ServiceReqDto(item));
        return new PaginatedServiceRequestsRes(data, total, page, pageSize);
    }

    async getServiceReq(id: number, membership: OrganizationMember): Promise<ServiceReqDto> {
        return new ServiceReqDto(await this.findByIdAndOrgId(id, membership.organizationId));
    }

    async updateServiceReq(id: number, dto: UpdateServiceReq,
                           membership: OrganizationMember): Promise<ServiceReqDto> {
        const serviceReq = await this.findByIdAndOrgId(id, membership.organizationId);

        if (dto.addressId !== serviceReq.addressId &&
            !(await this.customerService.addressExistsByIdAndCustomerId(dto.addressId, serviceReq.customerId))) {
            throw new NotFoundException({
                message: "Could not found customer address",
                code: ErrorCode.ADDRESS_NOT_FOUND,
            });
        }

        Object.assign(serviceReq, dto);
        serviceReq.addressId = dto.addressId;

        return new ServiceReqDto(await this.update(serviceReq));
    }

    async convertToWorkOrder(id?: string) {
        return {id};
    }

    async findAllByCustomer(customerId: number) {
        return await this.serviceRepo.find({where: {customerId}, order: {id: 'ASC'}});
    }

    async findByIdAndCustomerId(customerId: number, serviceId: number) {
        return await this.serviceRepo.findOneBy({customerId, id: serviceId});
    }

    async deleteById(id: number) {
        await this.serviceRepo.delete({id});
    }

    async exists(options: FindOptionsWhere<ServiceRequest>) {
        return await this.serviceRepo.existsBy(options);
    }

    async findOne(options: FindOptionsWhere<ServiceRequest>) {
        return await this.serviceRepo.findOneBy(options);
    }
}
