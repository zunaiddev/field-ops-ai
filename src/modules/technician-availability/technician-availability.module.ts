import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {TechnicianAvailability} from './entity/technician-availability.entity.js';
import {Technician} from '../technician/entity/technician.entity.js';
import {TechnicianAvailabilityController} from './technician-availability.controller.js';
import {TechnicianAvailabilityService} from './technician-availability.service.js';

@Module({
    imports: [TypeOrmModule.forFeature([TechnicianAvailability, Technician])],
    controllers: [TechnicianAvailabilityController],
    providers: [TechnicianAvailabilityService],
    exports: [TechnicianAvailabilityService],
})
export class TechnicianAvailabilityModule {}
