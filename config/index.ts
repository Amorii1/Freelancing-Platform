require("dotenv").config();

let config: any;


export default config = {
  port: process.env.PORT || 3001,
  jwtSecret: process.env.JWT_SECRET || "shhh",
  zcSecret: process.env.ZC_SECRET || "",
  zcMsisdn: process.env.ZC_MSISDN || "",
  zcProduction: process.env.ZC_PRODUCTION || false,
  zcMerchant: process.env.ZC_MERCHANT || "",
  zcRedirect: process.env.ZC_REDIRECT || "",
  imageBbUploader: process.env.IMAGE_BB_UPLOADER || "",
};
