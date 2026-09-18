import {Global, Module} from '@nestjs/common';
import {MailerModule} from "@nestjs-modules/mailer";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {HandlebarsAdapter} from "@nestjs-modules/mailer/adapters/handlebars.adapter";
import {join} from "path";
import {MailService} from './mail.service.js';

@Global()
@Module({
    imports: [MailerModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
            transport: {
                host: configService.getOrThrow<string>('mail.host'),
                port: configService.getOrThrow<string>('mail.port'),
                secure: false,
                auth: {
                    user: configService.getOrThrow<string>('mail.user'),
                    pass: configService.getOrThrow<string>('mail.pass'),
                }
            },
            defaults: {
                from: configService.getOrThrow<string>("mail.from")
            },
            template: {
                dir: join(__dirname, 'templates'),
                adapter: new HandlebarsAdapter(),
                options: {strict: true}
            }
        })
    })],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {
}