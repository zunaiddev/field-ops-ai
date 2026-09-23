import {Module} from '@nestjs/common';
import {TechnicianService} from './technician.service.js';
import {TechnicianController} from './technician.controller.js';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Technician} from "./entity/technician.entity.js";
import {TechnicianAddress} from "./entity/technician-address.entity.js";
import {TechnicianAddressService} from "./technician-address.service.js";
import {Skill} from "./entity/skill.entity.js";
import {TechnicianSkill} from "./entity/technician-skill.entity.js";

@Module({
    imports: [TypeOrmModule.forFeature([Technician, TechnicianAddress, Skill
        , TechnicianSkill])],
    providers: [TechnicianService, TechnicianAddressService],
    controllers: [TechnicianController]
})
export class TechnicianModule {
}
