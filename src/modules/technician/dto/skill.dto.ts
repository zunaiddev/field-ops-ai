import {Expose} from "class-transformer";
import {Skill} from "../entity/skill.entity.js";

export class SkillDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    description: string;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    constructor(skill: Skill) {
        this.id = skill.id;
        this.name = skill.name;
        this.description = skill.description;
        this.createdAt = skill.createdAt;
        this.updatedAt = skill.updatedAt;
    }
}