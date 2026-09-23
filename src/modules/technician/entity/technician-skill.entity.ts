import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Technician} from "./technician.entity.js";
import {Skill} from "./skill.entity.js";

@Entity("technician_skills")
export class TechnicianSkill {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: "skill_id"})
    skillId: number;

    @Column({name: "technician_id"})
    technicianId: number;

    @ManyToOne(() => Technician, {onDelete: "CASCADE"})
    @JoinColumn({name: "technician_id"})
    technician: Technician;

    @ManyToOne(() => Skill, {onDelete: "CASCADE"})
    @JoinColumn({name: "skill_id"})
    skill: Skill;
}
