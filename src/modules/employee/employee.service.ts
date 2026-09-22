import {Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common";
import {EntityManager, Repository} from "typeorm";
import {Employee} from "./entity/employee.entity.js";
import {InjectRepository} from "@nestjs/typeorm";
import {isNumberString} from "class-validator";
import {ErrorCode} from "../../common/enums/error-code.enum.js";
import {OrganizationMemberService} from "../orgnization-member/organization-member.service.js";
import {EmployeeRes} from "./dto/employee-res.dto.js";

@Injectable()
export class EmployeeService {
    constructor(@InjectRepository(Employee) private readonly employeeRepo: Repository<Employee>,
                private readonly orgMemberService: OrganizationMemberService,
    ) {
    }

    async existsByEmail(email: string): Promise<boolean> {
        return this.employeeRepo.existsBy({email});
    }

    async save(user: Partial<Employee>, entityManager?: EntityManager): Promise<Employee> {
        const repo: Repository<Employee> = entityManager ? entityManager.getRepository(Employee) : this.employeeRepo;
        return await repo.save(user);
    }

    async update(user: Employee): Promise<Employee> {
        return await this.employeeRepo.save(user);
    }

    async findByEmail(email: string): Promise<Employee | null> {
        return await this.employeeRepo.findOneBy({email});
    }

    async findById(id: number): Promise<Employee | null> {
        return await this.employeeRepo.findOneBy({id});
    }

    async delete(id: number, entityManager?: EntityManager): Promise<void> {
        const repo = entityManager ? entityManager.getRepository(Employee) : this.employeeRepo;
        await repo.delete({id});
    }

    async getEmployee(sub: string) {
        if (!isNumberString(sub)) {
            throw new UnauthorizedException({
                message: "Invalid Jwt sub",
                code: ErrorCode.INVALID_TOKEN
            });
        }

        const organizationMember = await this.orgMemberService.findMemberById(Number(sub));

        if (!organizationMember) {
            throw new NotFoundException({
                message: "employee not found",
                code: ErrorCode.MEMBER_NOT_FOUND
            });
        }

        return new EmployeeRes(organizationMember);
    }
}
