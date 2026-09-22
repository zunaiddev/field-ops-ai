import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {ServiceRequest} from "./entity/service-req.entity.js";
import {Repository} from "typeorm";

@Injectable()
export class ServiceReqService {
    constructor(@InjectRepository(ServiceRequest) private serviceRepo: Repository<ServiceRequest>) {

    }
}
