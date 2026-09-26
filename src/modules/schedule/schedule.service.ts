import {BadRequestException, ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {FindOptionsWhere, Repository} from "typeorm";
import {Schedule, ScheduleStatus} from "./entity/schedule.entity.js";
import {InjectRepository} from "@nestjs/typeorm";
import {CreateScheduleDto} from "./dto/create-schedule.dto.js";
import {OrganizationMember} from "../orgnization-member/entity/organization-member.entity.js";
import {TechnicianService} from "../technician/technician.service.js";
import {ErrorCode} from "../../common/enums/error-code.enum.js";
import {ScheduleDto} from "./dto/schedule.dto.js";
import {ServiceReqService} from "../service-req/service-req.service.js";
import {ServiceRequestStatus} from "../service-req/entity/service-req.enums.js";
import {UpdateScheduleDto} from "./dto/update-schedule.dto.js";
import {UpdateTechnicianScheduleStatusDto} from "./dto/update-technician-schedule-status.dto.js";

@Injectable()
export class ScheduleService {
    constructor(@InjectRepository(Schedule)
                private readonly scheduleRepo: Repository<Schedule>,
                private readonly technicianService: TechnicianService,
                private readonly serviceReqService: ServiceReqService) {
    }

    async create(dto: CreateScheduleDto, member: OrganizationMember): Promise<ScheduleDto> {
        const [technicianExists, serviceReq, scheduleExists] = await Promise.all([
            this.technicianService.exists({
                id: dto.technicianId,
                organizationId: member.organizationId,
            }),
            this.serviceReqService.findOne({
                id: dto.serviceRequestId,
                organizationId: member.organizationId,
            }),
            this.scheduleRepo.existsBy({
                serviceRequestId: dto.serviceRequestId,
                organizationId: member.organizationId,
            }),
        ]);

        if (!technicianExists) {
            throw new NotFoundException({
                message: "technician not found",
                code: ErrorCode.TECHNICIAN_NOT_FOUND,
            });
        }

        if (!serviceReq) {
            throw new NotFoundException({
                message: "service does not exist",
                code: ErrorCode.SERVICE_NOT_FOUND,
            });
        }

        if (scheduleExists) {
            throw new ConflictException({
                message: "schedule already exists",
                code: ErrorCode.SCHEDULE_CONFLICT,
            });
        }

        const schedule: Schedule = await this.scheduleRepo.save({
            ...dto,
            organizationId: member.organizationId,
            organization: member.organization,
        });

        await this.serviceReqService.update({
            ...serviceReq,
            status: ServiceRequestStatus.SCHEDULED,
        });

        return new ScheduleDto(schedule);
    }

    async delete(id: number, member: OrganizationMember): Promise<void> {
        const schedule = await this.scheduleRepo.findOne({
            where: {
                id,
                organizationId: member.organizationId,
            },
            relations: {serviceRequest: true},
        });

        if (!schedule) {
            throw new NotFoundException({
                message: 'Schedule not found',
                code: ErrorCode.SCHEDULE_NOT_FOUND,
            });
        }

        await this.serviceReqService.update({
            ...schedule.serviceRequest,
            status: ServiceRequestStatus.ON_HOLD,
        });

        await this.scheduleRepo.delete({id, organizationId: member.organizationId});
    }

    async findAll(member: OrganizationMember) {
        return (await this.scheduleRepo.find({
            where: {
                organizationId: member.organizationId,
            },
            relations: {
                serviceRequest: {
                    customer: true,
                    address: true,
                },
                technician: {
                    employee: true,
                },
            },
            order: {
                scheduledStart: 'ASC',
            },
        })).map(val => new ScheduleDto(val));
    }

    async findOne(id: number, member: OrganizationMember) {
        const schedule = await this.scheduleRepo.findOne({
            where: {id, organizationId: member.organizationId},
            relations: {
                serviceRequest: {
                    customer: true,
                    address: true,
                },
                technician: {
                    employee: true,
                },
            },
        });

        if (!schedule) {
            throw new NotFoundException({
                message: 'Schedule not found',
                code: ErrorCode.SCHEDULE_NOT_FOUND,
            });
        }

        return new ScheduleDto(schedule);
    }

    async update(id: number, updateScheduleDto: UpdateScheduleDto,
                 member: OrganizationMember) {
        const schedule = await this.scheduleRepo.findOneBy({id, organizationId: member.organizationId});

        if (!schedule) {
            throw new NotFoundException({
                message: 'Schedule not found',
                code: ErrorCode.SCHEDULE_NOT_FOUND,
            });
        }

        Object.assign(schedule, updateScheduleDto);
        const saved = await this.scheduleRepo.save(schedule);

        return new ScheduleDto(saved);
    }

    async findByServiceId(serviceId: number, member: OrganizationMember) {
        const schedule = await this.scheduleRepo.findOne({
            where: {
                serviceRequestId: serviceId,
                organizationId: member.organizationId,
            },
            relations: {
                serviceRequest: {
                    customer: true,
                    address: true,
                },
                technician: {
                    employee: true,
                },
            },
        });

        if (!schedule) {
            throw new NotFoundException({
                message: 'Schedule not found',
                code: ErrorCode.SCHEDULE_NOT_FOUND,
            });
        }

        return new ScheduleDto(schedule);
    }

    async findScheduleByServiceId(serviceId: number) {
        const schedule = await this.scheduleRepo.findOne({
            where: {serviceRequestId: serviceId},
            relations: {technician: {employee: true}},
        });

        if (!schedule) {
            throw new NotFoundException({
                message: 'Schedule not found',
                code: ErrorCode.SCHEDULE_NOT_FOUND,
            });
        }

        return schedule;
    }

    async findSchedulesForTechnicians(member: OrganizationMember, status?: ScheduleStatus): Promise<ScheduleDto[]> {
        const technician = await this.technicianService.findTechnician({
            organizationId: member.organizationId,
            employeeId: member.employeeId,
        });

        const where: FindOptionsWhere<Schedule> = {
            technicianId: technician.id,
            organizationId: member.organizationId,
        };

        if (status) {
            where.status = status;
        }

        const schedules = await this.scheduleRepo.find({
            where,
            relations: {
                serviceRequest: {
                    customer: true,
                    address: true,
                },
                technician: {
                    employee: true,
                },
            },
            order: {
                scheduledStart: 'ASC',
            },
        });

        return schedules.map(s => new ScheduleDto(s));
    }

    async updateScheduleStatusForTechnician(
        id: number,
        dto: UpdateTechnicianScheduleStatusDto,
        member: OrganizationMember,
    ): Promise<ScheduleDto> {
        const technician = await this.technicianService.findTechnician({
            organizationId: member.organizationId,
            employeeId: member.employeeId,
        });

        const schedule = await this.scheduleRepo.findOne({
            where: {
                id,
                technicianId: technician.id,
                organizationId: member.organizationId,
            },
            relations: {
                serviceRequest: {
                    customer: true,
                    address: true,
                },
                technician: {
                    employee: true,
                },
            },
        });

        if (!schedule) {
            throw new NotFoundException({
                message: 'Schedule not found',
                code: ErrorCode.SCHEDULE_NOT_FOUND,
            });
        }

        if (schedule.status === ScheduleStatus.CANCELLED) {
            throw new BadRequestException({
                message: 'Cannot update a cancelled schedule',
                code: ErrorCode.SCHEDULE_NOT_UPDATABLE,
            });
        }

        schedule.status = dto.status;
        if (dto.notes !== undefined) {
            schedule.notes = dto.notes;
        }

        if (schedule.serviceRequest) {
            if (dto.status === ScheduleStatus.COMPLETED) {
                await this.serviceReqService.update({
                    ...schedule.serviceRequest,
                    status: ServiceRequestStatus.RESOLVED,
                });
                schedule.serviceRequest.status = ServiceRequestStatus.RESOLVED;
            } else if (dto.status === ScheduleStatus.IN_PROGRESS) {
                await this.serviceReqService.update({
                    ...schedule.serviceRequest,
                    status: ServiceRequestStatus.IN_PROGRESS,
                });
                schedule.serviceRequest.status = ServiceRequestStatus.IN_PROGRESS;
            } else if (dto.status === ScheduleStatus.CANCELLED) {
                await this.serviceReqService.update({
                    ...schedule.serviceRequest,
                    status: ServiceRequestStatus.ON_HOLD,
                });
                schedule.serviceRequest.status = ServiceRequestStatus.ON_HOLD;
            }
        }

        const saved = await this.scheduleRepo.save(schedule);
        return new ScheduleDto(saved);
    }
}
