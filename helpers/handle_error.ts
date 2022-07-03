import { PostgresError } from "pg-error-enum";
import { QueryFailedError } from "typeorm";

class PostgressErrorHelper {
  static isFOREIGN_KEY_VIOLATION = (code) =>
    code == PostgresError.FOREIGN_KEY_VIOLATION;
  static isUNIQUE_VIOLATION = (code) => code == PostgresError.UNIQUE_VIOLATION;
}

class ExceptionObject {
  key: string;
  statusCode: number;
  ar ?:string;
  en ?:string;


  static SubCategoryNotExist: ExceptionObject = {
    key: "SubCategoryNotExist",
    statusCode: 409,
  };

  static PickSubCategory: ExceptionObject = {
    key: "PickSubCategory",
    statusCode: 409,
  };

  static InvaildPhone: ExceptionObject = {
    key: "InvaildPhone",
    statusCode: 409,
  };

  static AlreadyExist: ExceptionObject = {
    key: "AlreadyExist",
    statusCode: 409,
  };

  static InvaildToken: ExceptionObject = {
    key: "InvaildToken",
    statusCode: 409,
  };

  static TokenRequired: ExceptionObject = {
    key: "TokenRequired",
    statusCode: 409,
  };

  static UserNotRegister: ExceptionObject = {
    key: "UserNotRegister",
    statusCode: 409,
  };

  static PageNotExist: ExceptionObject = {
    key: "PageNotExist",
    statusCode: 404,
  };

  static UserNotCompleted: ExceptionObject = {
    key: "UserNotCompleted",
    statusCode: 409,
  };

  static TitleAlreadyExist: ExceptionObject = {
    key: "TitleAlreadyExist",
    statusCode: 409,
  };

  static ServiceNotExist: ExceptionObject = {
    key: "ServiceNotExist",
    statusCode: 409,
  };

  static NotExist: ExceptionObject = {
    key: "NotExist",
    statusCode: 409,
  };

  static PackageNotExist: ExceptionObject = {
    key: "PackageNotExist",
    statusCode: 409,
  };

  static NotHavePermission: ExceptionObject = {
    key: "NotHavePermission",
    statusCode: 401,
  };

  static UsedDuplicitedPackageId: ExceptionObject = {
    key: "UsedDuplicitedPackageId",
    statusCode: 401,
  };

  static CantRateUnCompleteOrder: ExceptionObject = {
    key: "CantRateUnCompleteOrder",
    statusCode: 401,
  };

  
}



const handleException = (res, err: ExceptionObject, detals ?: any) => {
  let response = { type: "exception", err: err.key  };
  if(detals) response["detals"]=detals;
  res.statusCode = err.statusCode;
  return res.json(response);
};

const handleUnknownError = (res, err) => {
  let response = { type: "error", err: err };
  res.statusCode = 400;
  return res.json(response);
};

const handleVailditionError = (res, err) => {
  let response = { type: "vaildite_error", err: err };
  res.statusCode = 400;
  return res.json(response);
};

export {
  PostgressErrorHelper,
  handleException,
  handleUnknownError,
  handleVailditionError,
  ExceptionObject,
};
