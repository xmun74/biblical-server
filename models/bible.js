const Sequelize = require("sequelize");

class Bible extends Sequelize.Model {
  static initiate(sequelize) {
    Bible.init(
      {
        book: {
          type: Sequelize.NUMERIC,
          allowNull: false,
          primaryKey: true,
        },
        chapter: {
          type: Sequelize.NUMERIC,
          allowNull: false,
          primaryKey: true,
        },
        verse: {
          type: Sequelize.NUMERIC,
          allowNull: false,
          primaryKey: true,
        },
        content: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "Bible_korHRV",
        tableName: "bible_korHRV",
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {}
}

module.exports = Bible;
