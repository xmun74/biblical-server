import dotenv from "dotenv";
dotenv.config();

interface Config {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: "mysql";
  timezone?: string;
  dialectOptions?: {
    charset?: string;
    dateStrings?: boolean;
    typeCast?: boolean;
  };
  logging?: boolean;
}

export default {
  development: {
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PWD,
    database: "biblical",
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
    timezone: "Asia/Seoul",
    dialectOptions: {
      charset: "utf8mb4",
      dateStrings: true,
      typeCast: true,
    },
  },
  test: {
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PWD,
    database: "biblical_test",
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
  },
  production: {
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PWD,
    database: "biblical_production",
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
    logging: false,
  },
} as Record<string, Config>;
