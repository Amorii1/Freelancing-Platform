import * as jwt from "jsonwebtoken";
import config from "../../config";
import { User } from "../../src/entity/user/user";
import {
  ExceptionObject,
  handleException,
} from "../../helpers/handle_error";
import { AuthService } from "../../src/service/auth.service";

async function verifyToken(req, res, next): Promise<object> {
  const token = req.headers.token;
  if (!token) return handleException(res, ExceptionObject.TokenRequired);
  const decoded = await AuthService.verfiyToken(token);
  if (!decoded) return handleException(res, ExceptionObject.InvaildToken);
  req.decoded = decoded;
  return next();
}

// async function verifyTokenIsCompleteUser(req, res, next): Promise<object> {
//   return verifyToken(res, res, isCompleteUser(req, res, next));
// }
 const verifyTokenIsCompleteUser = [verifyToken ,isCompleteUser ];
 const verifyTokenIsCompleteUserIsReg =
   [...verifyTokenIsCompleteUser, isUserRegsterInDB , setUserToReq ];
  // return verifyToken(
  //   res,
  //   res,
  //   isCompleteUser(req, res, isUserRegsterInDB(req, res, setUserToReq(req,res,next)))
  // );


function setUserToReq(req,res,next) :object {
      req.user  = { 
        id:req.decoded.uid,
        email:req.decoded.email,
      } as User ;
      return next();
}

function isCompleteUser(req, res, next): object {
  const errors = AuthService.isCompleteUser(req.decoded); 
  if (errors) return handleException(res, ExceptionObject.UserNotCompleted , errors);
  return next();
}

function isUserRegsterInDB(req, res, next): object {
  if (AuthService.isUserRegstersInDB(req.decoded)) {
    return next();
  } else {
    return handleException(res, ExceptionObject.UserNotRegister);
  }
}

export { verifyToken, isCompleteUser, verifyTokenIsCompleteUserIsReg,verifyTokenIsCompleteUser };
