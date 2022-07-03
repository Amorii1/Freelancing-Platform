// var admin = require("firebase-admin");
import  * as _admin from "firebase-admin";
// var serviceAccount = require("../../maslahtech-828b0-firebase-adminsdk-aimlf-6d0abcbe56.json");

// _admin.initializeApp({
//   credential: _admin.credential.cert(serviceAccount)
// });

_admin.initializeApp({credential: _admin.credential.cert(
  JSON.parse(Buffer.from(process.env.GOOGLE_CONFIG_BASE64, 'base64').toString('ascii')))
});
export const admin = _admin;