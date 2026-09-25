import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleController } from './schedule.controller.js';
import { ScheduleService } from './schedule.service.js';
import { Schedule } from './entity/schedule.entity.js';
import { TechnicianModule } from '../technician/technician.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Schedule]),
    TechnicianModule,
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService],
  exports: [ScheduleService],
})
export class ScheduleModule {}
