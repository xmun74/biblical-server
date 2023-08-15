const Sequelize = require("sequelize");

class Meeting extends Sequelize.Model {
  static initiate(sequelize) {
    Meeting.init(
      {
        title: {
          type: Sequelize.STRING(20),
          allowNull: false,
          unique: true,
        },
        introduce: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Meeting",
        tableName: "meetings",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }
  static associate(db) {
    db.Meeting.hasMany(db.Post);
    db.Meeting.belongsToMany(db.User, {
      through: "MeetingUser",
    });
    db.Meeting.belongsToMany(db.Hashtag, {
      through: "MeetingHashtag",
    });
  }
}

module.exports = Meeting;
