const fs = require("fs");
const { sequelize } = require("./models");

const sqlFile = fs.readFileSync(`개역한글판_korHRV.sql`, "utf-8");
const dropTableQuery = "DROP TABLE IF EXISTS bible_korHRV;";
const createTableQuery =
  "CREATE TABLE bible_korHRV (book INT UNSIGNED, chapter INT UNSIGNED, verse INT UNSIGNED, content TEXT, PRIMARY KEY(book, chapter, verse));";
const insertQueries = sqlFile.match(
  /INSERT INTO bible_korHRV VALUES\([^)]+\);/g
);

const executeQueries = async () => {
  try {
    await sequelize.query(dropTableQuery);
    await sequelize.query(createTableQuery);
    for (const query of insertQueries) {
      await sequelize.query(query);
    }
  } catch (err) {
    console.error(err);
  }
};
executeQueries();
