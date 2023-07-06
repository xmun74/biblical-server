require("dotenv").config();
module.exports = {
  development: {
    username: "root",
    password: process.env.SEQUELIZE_PWD,
    database: "biblical",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  test: {
    username: "root",
    password: process.env.SEQUELIZE_PWD,
    database: "biblical_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: "root",
    password: process.env.SEQUELIZE_PWD,
    database: "biblical_production",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
