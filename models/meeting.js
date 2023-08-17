const Sequelize = require("sequelize");

class Meeting extends Sequelize.Model {
  static initiate(sequelize) {
    Meeting.init(
      {
        name: {
          type: Sequelize.STRING(20),
          allowNull: false,
          unique: true,
        },
        introduce: {
          type: Sequelize.STRING(300),
          allowNull: false,
        },
        hostId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        members: {
          type: Sequelize.JSON,
          allowNull: true,
        },
        inviteLink: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        tags: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        address: {
          type: Sequelize.TEXT,
          allowNull: true,
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
      as: "Members",
    });
    db.Meeting.belongsToMany(db.Hashtag, {
      through: "MeetingHashtag",
    });
  }
}

module.exports = Meeting;
