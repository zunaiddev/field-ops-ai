import {Module} from '@nestjs/common';
import {ServiceReqService} from "./service-req.service.js";
import {ServiceReqController} from "./service-req.controller.js";


@Module({
    providers: [ServiceReqService],
    controllers: [ServiceReqController]
})
export class ServiceReqModule {
}