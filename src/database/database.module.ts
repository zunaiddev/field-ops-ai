import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {DatabaseLifecycleService} from './database-lifecycle.service.js';

@Module({
    imports: [TypeOrmModule.forRoot({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT as string, 10),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        autoLoadEntities: true,
        synchronize: true,
    })],
    providers: [DatabaseLifecycleService],
    exports: [TypeOrmModule]
})
export class DatabaseModule {}