import * as express from "express";
import * as morgan from "morgan";
import * as cors from "cors";
import { createConnection } from "typeorm";
import config from "../config/index";
const app = express();
const port = config.port;
import v1 from "../route/app/v1";
import { ExceptionObject, handleException } from "../helpers/handle_error";
import { getConfig } from "./ormconfig";
// import * as uploadImg from "express-fileupload";

getConfig().then((config) => {
  createConnection(config).then(async (connection) => {
    console.log(`Connected to DB , synchronize:${connection.options.synchronize}`);
    //Middleware to give you access to uploaded files
    //   app.use(uploadImg({}));

    //  Middleware to get the json from the request
    app.use(cors({ origin: true }));
    app.use(express.json());

    //log middleware
    app.use(morgan("dev"));

    // route handler
    app.use("/v1", v1);

    //404
    app.use((req, res, next) => {
      return handleException(res, ExceptionObject.PageNotExist);
    });

    //listener
    app.listen(port, () => {
      console.log(`Running on port ${port}`);
    });
  });
});
