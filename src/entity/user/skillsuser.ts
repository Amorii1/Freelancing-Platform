import {
  BaseEntity,
  Entity,
  PrimaryColumn,
} from "typeorm";


@Entity('users_skills_skills',{
    synchronize:false
})
export class SkillUser  extends BaseEntity {

  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  skillName: string;
}