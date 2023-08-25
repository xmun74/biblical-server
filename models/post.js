const Sequelize = require("sequelize");

class Post extends Sequelize.Model {
  static initiate(sequelize) {
    Post.init(
      {
        title: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        content: {
          type: Sequelize.STRING(140),
          allowNull: false,
        },
        views: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        tags: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        img: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Post",
        tableName: "posts",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }
  static associate(db) {
    db.Post.belongsTo(db.User, {
      targetKey: "id",
      foreignKey: "userId",
    });
    db.Post.belongsTo(db.Meeting);
    db.Post.belongsToMany(db.Hashtag, {
      through: "PostHashtag",
    });
  }
}

module.exports = Post;
