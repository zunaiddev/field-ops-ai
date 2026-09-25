import {CustomerService} from "./customer.service.js";
import {ServiceReqService} from "../service-req/service-req.service.js";
import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {Customer} from "./entity/customer.entity.js";
import {CustomerRes} from "./dto/customer-res.dto.js";
import {OrganizationService} from "../orgnization/organization.service.js";
import {CreateServiceReq} from "../service-req/dto/create-service-request.dto.js";
import {ErrorCode} from "../../common/enums/error-code.enum.js";
import {ServiceRequestSource, ServiceRequestStatus} from "../service-req/entity/service-req.enums.js";
import {ServiceReqDto} from "../service-req/dto/service-req.dto.js";
import {UpdateServiceReq} from "../service-req/dto/update-service-request.dto.js";
import {UpdatePublicCustomer} from "./dto/update-public-customer.js";
import {CustomerAddressRes} from "./dto/customer-address-res.dto.js";
import {CreateAddressDto} from "./dto/create-address.dto.js";
import {UpdateAddressDto} from "./dto/update-address.dto.js";
import {ScheduleService} from "../schedule/schedule.service.js";
import {CustomerScheduleRes} from "./dto/customer-schedule-res.dto.js";

@Injectable()
export class PublicCustomerService {
    constructor(private readonly customerService: CustomerService,
                private readonly orgService: OrganizationService,
                private readonly serviceReqService: ServiceReqService,
                private readonly scheduleService: ScheduleService) {
    }

    async getFullCustomer(customer: Customer) {
        const organization = await this.orgService.findById(customer.id);

        return new CustomerRes(customer, undefined, organization);
    }

    async createServiceReq(customer: Customer, dto: CreateServiceReq) {
        const exists = await
            this.customerService.addressExistsByIdAndCustomerId(dto.addressId, customer.id);

        if (!exists) {
            throw new NotFoundException({
                message: "Address not found",
                code: ErrorCode.ADDRESS_NOT_FOUND
            });
        }

        return new ServiceReqDto(await this.serviceReqService.save({
            addressId: dto.addressId,
            customerId: customer.id,
            organizationId: customer.organizationId,
            source: ServiceRequestSource.CUSTOMER,
            requestedAt: new Date(),
            status: ServiceRequestStatus.NEW,
            createdBy: customer.id,
            priority: dto.priority,
            category: dto.category,
            description: dto.description,
            title: dto.title,
        }));
    }

    async getServices(customer: Customer): Promise<ServiceReqDto[]> {
        return (await this.serviceReqService.findAllByCustomer(customer.id))
            .map(service => new ServiceReqDto(service));
    }

    async deleteService(customer: Customer, id: number) {
        const service = await this.serviceReqService.findByIdAndCustomerId(customer.id, id);

        if (!service) {
            throw new NotFoundException({
                message: "Service not found",
                code: ErrorCode.SERVICE_NOT_FOUND
            });
        }

        console.log(service.status)
        if (service.status !== ServiceRequestStatus.NEW) {
            throw new BadRequestException({
                message: "Service can't be deleted",
                code: ErrorCode.SERVICE_NOT_DELETABLE
            });
        }

        await this.serviceReqService.deleteById(service.id);
    }

    async updateService(id: number, customer: Customer, dto: UpdateServiceReq) {
        const service = await this.serviceReqService.findByIdAndCustomerId(customer.id, id);

        if (!service) {
            throw new NotFoundException({
                message: "Service not found",
                code: ErrorCode.SERVICE_NOT_FOUND
            });
        }

        if (service.status !== ServiceRequestStatus.NEW) {
            throw new BadRequestException({
                message: "Service can't be updated",
                code: ErrorCode.SERVICE_NOT_UPDATABLE
            })
        }

        if (service.addressId !== dto.addressId
            && !(await this.customerService.addressExistsByIdAndCustomerId(dto.addressId, customer.id))) {
            throw new NotFoundException({
                message: "Address not found",
                code: ErrorCode.ADDRESS_NOT_FOUND
            });
        }

        service.addressId = dto.addressId;
        service.title = dto.title;
        service.description = dto.description;
        service.category = dto.category;
        service.priority = dto.priority;

        return new ServiceReqDto(await this.serviceReqService.save(service));
    }

    async updateCustomer(customer: Customer, dto: UpdatePublicCustomer) {
        Object.assign(customer, dto);
        return new CustomerRes(await this.customerService.update(customer));
    }

    async getAddresses(customer: Customer) {
        const addresses = await this.customerService.findAddressesByCustomer(customer.id);
        return addresses.map(address => new CustomerAddressRes(address));
    }

    async addAddress(customer: Customer, dto: CreateAddressDto) {
        const address = await this.customerService.saveAddress({
            ...dto,
            customerId: customer.id,
            customer: customer,
        });


        return new CustomerAddressRes(address);
    }

    async updateAddress(customer: Customer, addressId: number, dto: UpdateAddressDto) {
        const address =
            await this.customerService.findAddressByCustomerAndAddress(customer.id, addressId);

        if (!address) {
            throw new NotFoundException({
                message: "Address not found",
                code: ErrorCode.ADDRESS_NOT_FOUND
            });
        }

        Object.assign(address, dto);

        return new CustomerAddressRes(await this.customerService.saveAddress(address));
    }

    async deleteAddress(customer: Customer, addressId: number) {
        const address =
            await this.customerService.findAddressByCustomerAndAddress(customer.id, addressId);

        if (!address) {
            throw new NotFoundException({
                message: "Address not found",
                code: ErrorCode.ADDRESS_NOT_FOUND
            });
        }

        await this.customerService.deleteAddressById(address.id);
    }

    async getSchedule(serviceId: number, customer: Customer): Promise<CustomerScheduleRes> {
        const serviceReq = await this.serviceReqService.findOne({
            id: serviceId,
            customerId: customer.id
        });

        if (!serviceReq) {
            throw new NotFoundException({
                message: "Service not found",
                code: ErrorCode.SERVICE_NOT_FOUND
            });
        }

        const schedule =
            await this.scheduleService.findScheduleByServiceId(serviceReq.id);

        return new CustomerScheduleRes(schedule);
    }
}
