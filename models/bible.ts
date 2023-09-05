import Sequelize, {
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

class Bible extends Model<
  InferAttributes<Bible>,
  InferCreationAttributes<Bible>
> {
  declare book: number;
  declare chapter: number;
  declare verse: number;
  declare content: string;

  static initiate(sequelize: Sequelize.Sequelize) {
    Bible.init(
      {
        book: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          primaryKey: true,
        },
        chapter: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          primaryKey: true,
        },
        verse: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          primaryKey: true,
        },
        content: {
          type: Sequelize.TEXT,
          allowNull: false,
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
  static associate() {}
}

export default Bible;
