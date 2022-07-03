import * as bcrypt from "bcryptjs";
const accountSid = "AC27719b221fa9f1c808c07dd98a614297";
const authToken = "79eab7e154af22a2141ce754a2e13ba4";
import * as twilio from "twilio";
const client = twilio(accountSid, authToken);

// /**
//  *
//  * @param res
//  * @param err
//  * @param statusCode
//  */
// const errRes = (
//   res,
//   err,
//   key = "err",
//   statusCode = 400,
//   lang = "ar",
//   errValue = ""
// ) => {
//   let response = { status: false, err: null };
//   if (typeof err === "string") {
//     err =
//       // translation(err, lang, errValue) ||
//       err;
//     let obj = {};
//     obj[key] = [err];
//     response.err = obj;
//   } else {
//     response.err = err;
//   }

//   res.statusCode = statusCode;
//   return res.json(response);
// };
//TRANSLATION
/**
 *
 * @param err
 * @param lang
 * @param value
 */
// const translation = (err, lang, value = "") => {
//   let defaultMsg = {
//     en: "Something went wrong",
//     ar: "لقد حدث خطأ ما",
//   };
//   return (
//     {
//       en: {
//         phoneInvalid: `Phone ${value} is invalid`,
//       },
//       ar: {
//         phoneInvalid: `الرقم ${value} غير صالح`,
//       },
//     }[lang][err] || defaultMsg[lang]
//   );
// };

/**
 *
 * @param res
 * @param data
 * @param statusCode
 */
const okRes = (res, data, statusCode = 200) => {
  if(data instanceof Promise){
    throw "trying return promise"; 
  }
  let response = { data };
  res.statusCode = statusCode;
  return res.json(response);
};

const getOTP = () => Math.floor(1000 + Math.random() * 9000);

/**
 *
 * @param {*} plainPassword
 */
const hashMyPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(plainPassword, salt);
  return password;
};

/**
 *
 * @param {*} plainPassword
 */
const comparePassword = async (plainPassword, hash) =>
  await bcrypt.compare(plainPassword, hash);

const paginate = (page = 1, _skip = 10) => {
  let take = _skip;
  let skip = (page - 1) * take;
  return { take, skip };
};

const sendSMS = (body: string, to: string) => {
  client.messages
    .create({ body, from: "+14152363940", to })
    .then((message) => console.log(message.sid));
};

export {
  // errRes,
  okRes,
  getOTP,
  hashMyPassword,
  comparePassword,
  paginate,
  sendSMS,
};
