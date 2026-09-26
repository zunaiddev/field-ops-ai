import {ConfigService} from "@nestjs/config";
import {createKeyv} from "@keyv/redis";

export default () => ({
    isGlobal: true,
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
        /*const host: string = configService.getOrThrow<string>("redis.host");
        const port: number = configService.getOrThrow<number>("redis.port");
        const username: string = configService.getOrThrow<string>("redis.username");
        const password: string = configService.getOrThrow<string>("redis.password");*/
        const url: string = configService.getOrThrow<string>("redis.url");

        return {
            // stores: [createKeyv(`redis://${host}:${port}`)]
            stores: [createKeyv(url)]
        }
    },
});