import {Module} from '@nestjs/common';
import {OrganizationService} from "./organization.service.js";
import {OrgnizationController} from "./orgnization.controller.js";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Organization} from "./entity/organization.entity.js";

@Module({
    imports: [TypeOrmModule.forFeature([Organization])],
    providers: [OrganizationService],
    controllers: [OrgnizationController],
    exports: [OrganizationService],
})
export class OrganisationModule {
}
