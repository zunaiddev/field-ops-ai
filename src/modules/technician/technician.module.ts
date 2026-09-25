import {Module} from '@nestjs/common';
import {TechnicianService} from './technician.service.js';
import {TechnicianController} from './technician.controller.js';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Technician} from "./entity/technician.entity.js";
import {TechnicianAddress} from "./entity/technician-address.entity.js";
import {TechnicianAddressService} from "./technician-address.service.js";
import {Skill} from "./entity/skill.entity.js";
import {TechnicianSkill} from "./entity/technician-skill.entity.js";
import {TechnicianAvailability} from "../technician-availability/entity/technician-availability.entity.js";

@Module({
    imports: [TypeOrmModule.forFeature([
        Technician,
        TechnicianAddress,
        Skill,
        TechnicianSkill,
        TechnicianAvailability,
    ])],
    providers: [TechnicianService, TechnicianAddressService],
    controllers: [TechnicianController],
    exports: [TechnicianService],
})
export class TechnicianModule {
}
