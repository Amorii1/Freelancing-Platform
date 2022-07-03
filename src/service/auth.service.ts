import { auth } from "firebase-admin";
import { admin } from "./friebaseadmin";

export class AuthService {
  static async verfiyToken(token: string): Promise<auth.DecodedIdToken> {
    try {
      const decoded = await admin.auth().verifyIdToken(token);
      return decoded;
    } catch (error) {
      return null;
    }
  }

  static isCompleteUser(decoded: auth.DecodedIdToken) {
    // return error if exist , null if every things ok;
    let errors = [];
    // if (!decoded?.phone_number) errors.push("PhoneNotVerified");
    if (
      !(decoded?.firebase.sign_in_provider == "password"
        ? decoded?.email_verified
        : true)
    )
      errors.push("EmailNotVerified");

    return errors.length == 0 ? null : errors;
  }

  static isUserRegstersInDB(decoded: auth.DecodedIdToken) {
    return decoded.isreg;
  }

  static async addisregToToken(id: string) {
    admin.auth().setCustomUserClaims(id, { isreg: true });
    // return !!decoded.dbid;
  }
}
