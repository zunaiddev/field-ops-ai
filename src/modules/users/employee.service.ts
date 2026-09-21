import {BadRequestException, Injectable} from "@nestjs/common";
import {EntityManager, Repository} from "typeorm";
import {Employee} from "./entity/employee.entity.js";
import {InjectRepository} from "@nestjs/typeorm";
import {ErrorCode} from "../../common/enums/error-code.enum.js";

@Injectable()
export class EmployeeService {
    constructor(@InjectRepository(Employee) private readonly employeeRepo: Repository<Employee>,
    ) {
    }

    async existsByEmail(email: string): Promise<boolean> {
        return this.employeeRepo.existsBy({email});
    }

    async save(user: Partial<Employee>, entityManager?: EntityManager): Promise<Employee> {
        const repo = entityManager ? entityManager.getRepository(Employee) : this.employeeRepo;
        return await repo.save(user);
    }

    async update(user: Employee): Promise<Employee> {
        if (!user.id) {
            throw new BadRequestException({
                message: "User id must be provided while updating",
                errorCode: ErrorCode.USER_ID_REQUIRED,
            });
        }

        return await this.employeeRepo.save(user);
    }

    async findByEmail(email: string): Promise<Employee | null> {
        return await this.employeeRepo.findOneBy({email});
    }

    async findByEmailOrThrow(email: string): Promise<Employee> {
        return await this.employeeRepo.findOneByOrFail({email});
    }

    async findByIdOrFail(id: string): Promise<Employee> {
        return await this.employeeRepo.findOneByOrFail({id});
    }

    async findById(id: string): Promise<Employee | null> {
        return await this.employeeRepo.findOneBy({id});
    }

    async delete(id: string, entityManager?: EntityManager): Promise<void> {
        const repo = entityManager ? entityManager.getRepository(Employee) : this.employeeRepo;
        await repo.delete({id});
    }
}
