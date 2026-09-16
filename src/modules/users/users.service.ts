import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./entity/user.entity.js";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async existsByEmail(email: string): Promise<boolean> {
    return this.userRepo.existsBy({ email });
  }

  async save(user: User): Promise<User> {
    return await this.userRepo.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepo.findOneBy({ email });
  }

  async findByEmailOrThrow(email: string): Promise<User> {
    return await this.userRepo.findOneByOrFail({ email });
  }

  async findById(id: string): Promise<User> {
    return await this.userRepo.findOneByOrFail({ id });
  }
}