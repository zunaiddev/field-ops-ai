import {Exclude, Expose, Type} from "class-transformer";
import {ServiceReqDto} from "./service-req.dto.js";

@Exclude()
export class PaginatedServiceRequestsRes {
    @Expose()
    @Type((): typeof ServiceReqDto => ServiceReqDto)
    data: ServiceReqDto[];

    @Expose()
    total: number;

    @Expose()
    page: number;

    @Expose()
    pageSize: number;

    @Expose()
    totalPages: number;

    constructor(data: ServiceReqDto[], total: number, page: number, pageSize: number) {
        this.data = data;
        this.total = total;
        this.page = page;
        this.pageSize = pageSize;
        this.totalPages = pageSize > 0 ? Math.ceil(total / pageSize) : 0;
    }
}
