import { ConnectionOptions, getConnectionOptions } from "typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export const getConfig = async (): Promise<ConnectionOptions> => {
  const rootDir = process.env.NODE_ENV == "production" ? "build/src" : "src";
  const url = process.env.DATABASE_URL ?? process.env.TYPEORM_URL;
  const synchronize = Boolean(process.env.TYPEORM_SYNCHRONIZE) ?? false;
  const connectionOptions: PostgresConnectionOptions = {
    type: "postgres",
    url: url,
    ssl: { rejectUnauthorized: false }, 
    synchronize , 
    // ssl: process.env.DATABASE_URL ? true : false
    entities: [rootDir + "/entity/**/*.{js,ts}", rootDir + "/entity/*.{js,ts}"],
  };

  return connectionOptions;
};
