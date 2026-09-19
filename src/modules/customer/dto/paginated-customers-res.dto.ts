import {Exclude, Expose, Type} from "class-transformer";
import {CustomerRes} from "./customer-res.dto.js";

@Exclude()
export class PaginatedCustomersRes {
    @Expose()
    @Type((): typeof CustomerRes => CustomerRes)
    data: CustomerRes[];

    @Expose()
    total: number;

    @Expose()
    page: number;

    @Expose()
    pageSize: number;

    @Expose()
    totalPages: number;

    constructor(data: CustomerRes[], total: number, page: number, pageSize: number) {
        this.data = data;
        this.total = total;
        this.page = page;
        this.pageSize = pageSize;
        this.totalPages = pageSize > 0 ? Math.ceil(total / pageSize) : 0;
    }
}
