import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {FindOptionsWhere, Repository} from 'typeorm';
import {TechnicianAvailability} from './entity/technician-availability.entity.js';
import {Technician} from '../technician/entity/technician.entity.js';
import {OrganizationMember} from '../orgnization-member/entity/organization-member.entity.js';
import {CreateTechnicianAvailabilityDto} from './dto/create-technician-availability.dto.js';
import {UpdateTechnicianAvailabilityDto} from './dto/update-technician-availability.dto.js';
import {GetTechnicianAvailabilityQueryDto} from './dto/get-technician-availability-query.dto.js';
import {TechnicianAvailabilityRes} from './dto/technician-availability-res.dto.js';
import {ErrorCode} from '../../common/enums/error-code.enum.js';

@Injectable()
export class TechnicianAvailabilityService {
    constructor(
        @InjectRepository(TechnicianAvailability)
        private readonly availabilityRepo: Repository<TechnicianAvailability>,
        @InjectRepository(Technician)
        private readonly technicianRepo: Repository<Technician>,
    ) {}

    async save(technicianAvailability: Partial<TechnicianAvailability>): Promise<TechnicianAvailability> {
        return await this.availabilityRepo.save(technicianAvailability);
    }

    private parseTimeToSeconds(time: string): number {
        const parts = time.split(':').map(Number);
        const hours = parts[0] ?? 0;
        const minutes = parts[1] ?? 0;
        const seconds = parts[2] ?? 0;
        return hours * 3600 + minutes * 60 + seconds;
    }

    private async findTechnicianInOrg(technicianId: number, organizationId: number): Promise<Technician> {
        const technician = await this.technicianRepo.findOne({
            where: {
                id: technicianId,
                organizationId,
            },
        });

        if (!technician) {
            throw new NotFoundException({
                message: 'Technician not found',
                code: ErrorCode.TECHNICIAN_NOT_FOUND,
            });
        }

        return technician;
    }

    async create(
        technicianId: number,
        dto: CreateTechnicianAvailabilityDto,
        member: OrganizationMember,
    ): Promise<TechnicianAvailabilityRes> {
        await this.findTechnicianInOrg(technicianId, member.organizationId);

        const startSec = this.parseTimeToSeconds(dto.startTime);
        const endSec = this.parseTimeToSeconds(dto.endTime);

        if (startSec >= endSec) {
            throw new BadRequestException({
                message: 'Start time must be before end time',
                code: ErrorCode.INVALID_AVAILABILITY_TIME,
            });
        }

        const existingSlots = await this.availabilityRepo.findBy({
            technicianId,
            dayOfWeek: dto.dayOfWeek,
        });

        const hasOverlap = existingSlots.some(slot => {
            const s1 = this.parseTimeToSeconds(slot.startTime);
            const e1 = this.parseTimeToSeconds(slot.endTime);
            return startSec < e1 && s1 < endSec;
        });

        if (hasOverlap) {
            throw new ConflictException({
                message: 'Availability slot overlaps with an existing slot for this day',
                code: ErrorCode.AVAILABILITY_OVERLAP,
            });
        }

        const availability = this.availabilityRepo.create({
            technicianId,
            dayOfWeek: dto.dayOfWeek,
            startTime: dto.startTime,
            endTime: dto.endTime,
            isAvailable: dto.isAvailable ?? true,
        });

        const saved = await this.availabilityRepo.save(availability);
        return new TechnicianAvailabilityRes(saved);
    }

    async findAll(
        technicianId: number,
        member: OrganizationMember,
        query?: GetTechnicianAvailabilityQueryDto,
    ): Promise<TechnicianAvailabilityRes[]> {
        await this.findTechnicianInOrg(technicianId, member.organizationId);

        const where: FindOptionsWhere<TechnicianAvailability> = {
            technicianId,
        };

        if (query?.dayOfWeek !== undefined) {
            where.dayOfWeek = query.dayOfWeek;
        }

        if (query?.isAvailable !== undefined) {
            where.isAvailable = query.isAvailable;
        }

        const availabilities = await this.availabilityRepo.find({
            where,
            order: {
                dayOfWeek: 'ASC',
                startTime: 'ASC',
            },
        });

        return availabilities.map(a => new TechnicianAvailabilityRes(a));
    }

    async update(
        technicianId: number,
        id: number,
        dto: UpdateTechnicianAvailabilityDto,
        member: OrganizationMember,
    ): Promise<TechnicianAvailabilityRes> {
        await this.findTechnicianInOrg(technicianId, member.organizationId);

        const availability = await this.availabilityRepo.findOne({
            where: {
                id,
                technicianId,
            },
        });

        if (!availability) {
            throw new NotFoundException({
                message: 'Technician availability not found',
                code: ErrorCode.AVAILABILITY_NOT_FOUND,
            });
        }

        const targetDay = dto.dayOfWeek ?? availability.dayOfWeek;
        const targetStart = dto.startTime ?? availability.startTime;
        const targetEnd = dto.endTime ?? availability.endTime;

        const startSec = this.parseTimeToSeconds(targetStart);
        const endSec = this.parseTimeToSeconds(targetEnd);

        if (startSec >= endSec) {
            throw new BadRequestException({
                message: 'Start time must be before end time',
                code: ErrorCode.INVALID_AVAILABILITY_TIME,
            });
        }

        const existingSlots = await this.availabilityRepo.findBy({
            technicianId,
            dayOfWeek: targetDay,
        });

        const hasOverlap = existingSlots.some(slot => {
            if (slot.id === id) return false;
            const s1 = this.parseTimeToSeconds(slot.startTime);
            const e1 = this.parseTimeToSeconds(slot.endTime);
            return startSec < e1 && s1 < endSec;
        });

        if (hasOverlap) {
            throw new ConflictException({
                message: 'Availability slot overlaps with an existing slot for this day',
                code: ErrorCode.AVAILABILITY_OVERLAP,
            });
        }

        if (dto.dayOfWeek !== undefined) availability.dayOfWeek = dto.dayOfWeek;
        if (dto.startTime !== undefined) availability.startTime = dto.startTime;
        if (dto.endTime !== undefined) availability.endTime = dto.endTime;
        if (dto.isAvailable !== undefined) availability.isAvailable = dto.isAvailable;

        const saved = await this.availabilityRepo.save(availability);
        return new TechnicianAvailabilityRes(saved);
    }

    async delete(
        technicianId: number,
        id: number,
        member: OrganizationMember,
    ): Promise<void> {
        await this.findTechnicianInOrg(technicianId, member.organizationId);

        const availability = await this.availabilityRepo.findOne({
            where: {
                id,
                technicianId,
            },
        });

        if (!availability) {
            throw new NotFoundException({
                message: 'Technician availability not found',
                code: ErrorCode.AVAILABILITY_NOT_FOUND,
            });
        }

        await this.availabilityRepo.delete({id, technicianId});
    }
}
