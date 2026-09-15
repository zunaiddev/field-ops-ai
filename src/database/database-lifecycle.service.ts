import {Injectable, Logger, OnModuleDestroy, OnModuleInit} from '@nestjs/common';
import {InjectDataSource} from "@nestjs/typeorm";
import {DataSource} from "typeorm";

@Injectable()
export class DatabaseLifecycleService implements OnModuleInit, OnModuleDestroy{
    private readonly logger: Logger = new Logger(DatabaseLifecycleService.name);

    constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

    onModuleInit() {
        if (this.dataSource.isInitialized) {
            this.logger.log("Connected to Database");
            this.setupDriverListeners();
        }
    }

    onModuleDestroy() {
        this.logger.warn('NestJS is disconnecting from the database...');
    }

    private setupDriverListeners():void {
        const driver = this.dataSource.driver as any;

        if (driver.master?.on) {
            driver.master.on('error', (err: any) => {
                this.logger.error(`Critical database pool error: ${err.message}`);
            });
        }
    }

}
