import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {DatabaseLifecycleService} from './database-lifecycle.service.js';
import {ConfigService} from "@nestjs/config";

@Module({
    imports: [TypeOrmModule.forRootAsync({
        inject: [ConfigService],

        useFactory: (configService: ConfigService) => ({
            type: 'postgres',

            host: configService.getOrThrow<string>('database.host'),
            port: configService.getOrThrow<number>('database.port'),
            username: configService.getOrThrow<string>('database.username'),
            password: configService.getOrThrow<string>('database.password'),
            database: configService.getOrThrow<string>('database.name'),
            ssl: configService.getOrThrow<boolean>('database.ssl'),
            autoLoadEntities: true,
            synchronize: true,
        }),
    })],
    providers: [DatabaseLifecycleService],
    exports: [TypeOrmModule]
})
export class DatabaseModule {
}