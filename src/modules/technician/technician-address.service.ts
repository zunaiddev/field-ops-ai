import {InjectRepository} from "@nestjs/typeorm";
import {TechnicianAddress} from "./entity/technician-address.entity.js";
import {EntityManager, Repository} from "typeorm";
import {TechnicianAddressDto} from "./dto/technician-address.dto.js";

export class TechnicianAddressService {
    constructor(
        @InjectRepository(TechnicianAddress)
        private readonly addressRepo: Repository<TechnicianAddress>) {
    }

    async save(dto: TechnicianAddressDto, manager?: EntityManager): Promise<TechnicianAddress> {
        const repo: Repository<TechnicianAddress> = manager?.getRepository(TechnicianAddress) ?? this.addressRepo;

        return await repo.save(dto);
    }
}