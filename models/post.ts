import Sequelize, {
  BelongsToManyAddAssociationsMixin,
  CreationOptional,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import User from "./user";
import Meeting from "./meeting";
import Hashtag from "./hashtag";

class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare content: string;
  declare views: CreationOptional<number>;
  declare tags: CreationOptional<string>;
  declare img: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare userId: ForeignKey<User["id"]>;
  declare addHashtags: BelongsToManyAddAssociationsMixin<Hashtag, number>;
  declare setHashtags: BelongsToManyAddAssociationsMixin<Hashtag, number>;

  static initiate(sequelize: Sequelize.Sequelize) {
    Post.init(
      {
        id: {
          type: Sequelize.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        title: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        content: {
          type: Sequelize.STRING(140),
          allowNull: false,
        },
        views: {
          type: Sequelize.INTEGER.UNSIGNED,
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
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
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
  static associate() {
    Post.belongsTo(User, {
      targetKey: "id",
      foreignKey: "userId",
    });
    Post.belongsTo(Meeting);
    Post.belongsToMany(Hashtag, {
      through: "PostHashtag",
    });
  }
}
export default Post;
