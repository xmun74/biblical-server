require("dotenv").config();
module.exports = {
  development: {
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PWD,
    database: "biblical",
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
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
};
