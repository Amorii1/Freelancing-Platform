import { getConnection, InsertResult } from "typeorm";
import {
  ExceptionObject,
  PostgressErrorHelper,
} from "../../helpers/handle_error";
import { Skills } from "../entity/user/skills";
import { User } from "../entity/user/user";

export class UserService {
  static async getById(id: string) {
    const active = true;
    let whereObj = { active, id };

    let user = await User.findOne({
      where: whereObj,
      relations: ["services", "portfiloItems", "skills"], //TODO:: query builder
    });
    user?.hiddenSensitiveInfo();

    return user;
  }

  static async addListOfSkills(
    user: User,
    skills: string[]
  ): Promise<Skills[]> {
    try {
      let resInsert = await getConnection()
        .createQueryBuilder()
        .insert()
        .into("users_skills_skills")
        .values(
          skills.map((skill) => {
            return { skillName: skill, userId: user.id };
          })
        )
        .onConflict(`("skillName","userId") DO NOTHING`)
        .execute();
      return resInsert.identifiers.map((val) => ({ name: val.skillName })) as Skills[];
    } catch (error) {
      if (PostgressErrorHelper.isFOREIGN_KEY_VIOLATION(error.code))
        throw ExceptionObject.NotExist;

      if (PostgressErrorHelper.isUNIQUE_VIOLATION(error.code))
        throw ExceptionObject.AlreadyExist;
      throw error;
    }
  }
}
