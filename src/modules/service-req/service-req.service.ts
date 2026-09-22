import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {ServiceRequest} from "./entity/service-req.entity.js";
import {Repository} from "typeorm";
import {CreateServiceReq} from "./dto/create-service-request.dto.js";
import {ServiceRequestQuery} from "./dto/service-request-query.dto.js";
import {UpdateServiceReq} from "./dto/update-service-request.dto.js";
import {OrganizationMember} from "../orgnization-member/entity/organization-member.entity.js";
import {CustomerService} from "../customer/customer.service.js";
import {ServiceRequestSource, ServiceRequestStatus} from "./entity/service-req.enums.js";
import {ErrorCode} from "../../common/enums/error-code.enum.js";
import {ServiceReqDto} from "./dto/service-req.dto.js";

@Injectable()
export class ServiceReqService {
    constructor(@InjectRepository(ServiceRequest) private serviceRepo: Repository<ServiceRequest>,
                private readonly customerService: CustomerService) {
    }

    async save(serviceReq: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceRequest> {
        return await this.serviceRepo.save(serviceReq);
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
            })
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

    async findAll(query?: ServiceRequestQuery) {
        return query;
    }

    async findOne(id?: string) {
        return {id};
    }

    async update(id?: string, dto?: UpdateServiceReq) {
        return {id, ...dto};
    }

    async convertToWorkOrder(id?: string) {
        return {id};
    }
}