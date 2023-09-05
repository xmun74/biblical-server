import Sequelize from "sequelize";
import configObj from "../config/config";
import User from "./user";
import Post from "./post";
import Hashtag from "./hashtag";
import Meeting from "./meeting";
import Bible from "./bible";

const env = (process.env.NODE_ENV as "production" | "test") || "development";
const config = configObj[env];

export const sequelize = new Sequelize.Sequelize(
  config.database,
  config.username!,
  config.password,
  config
);

User.initiate(sequelize);
Post.initiate(sequelize);
Hashtag.initiate(sequelize);
Meeting.initiate(sequelize);
Bible.initiate(sequelize);

User.associate();
Post.associate();
Hashtag.associate();
Meeting.associate();
Bible.associate();

export { User, Post, Hashtag, Meeting, Bible };

/* db.sequelize = sequelize;

const basename = path.basename(__filename);
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file));
    // console.log(file, model.name);
    db[model.name] = model;
    model.initiate(sequelize);
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
*/
