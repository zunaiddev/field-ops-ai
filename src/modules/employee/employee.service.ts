import {Injectable} from "@nestjs/common";
import {EntityManager, Repository} from "typeorm";
import {Employee} from "./entity/employee.entity.js";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class EmployeeService {
    constructor(@InjectRepository(Employee) private readonly employeeRepo: Repository<Employee>,
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
}
