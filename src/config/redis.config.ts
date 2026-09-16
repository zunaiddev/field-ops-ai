import {ConfigService} from "@nestjs/config";
import {createKeyv} from "@keyv/redis";

export default () => ({
    isGlobal: true,
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
        const host: string = configService.getOrThrow<string>("REDIS_HOST");
        const port: number = configService.getOrThrow<number>("REDIS_PORT");

        return {
            stores: [createKeyv(`redis://${host}:${port}`)]
        }
    },
});