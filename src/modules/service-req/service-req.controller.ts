import {Controller} from '@nestjs/common';
import {ServiceReqService} from "./service-req.service.js";

@Controller('service-requests')
export class ServiceReqController {
    constructor(private readonly serviceReqService: ServiceReqService) {
    }


}
