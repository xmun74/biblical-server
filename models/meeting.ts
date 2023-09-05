import Sequelize, {
  BelongsToManyAddAssociationMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManySetAssociationsMixin,
  CreationOptional,
  HasManyAddAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import Post from "./post";
import User from "./user";
import Hashtag from "./hashtag";

class Meeting extends Model<
  InferAttributes<Meeting>,
  InferCreationAttributes<Meeting>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare introduce: string;
  declare hostId: number;
  declare members: CreationOptional<string>; // 임시
  declare inviteLink: CreationOptional<string>;
  declare tags: CreationOptional<string>;
  declare address: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare addPost: HasManyAddAssociationMixin<Post, number>;
  declare getPosts: HasManyGetAssociationsMixin<Post>;
  declare removePost: HasManyRemoveAssociationMixin<Post, number>;

  declare addMember: BelongsToManyAddAssociationMixin<User, number>;
  declare getMember: BelongsToManyGetAssociationsMixin<User>;
  declare removeMember: BelongsToManyRemoveAssociationMixin<User, number>;

  declare addHashtags: BelongsToManyAddAssociationsMixin<Hashtag, number>;
  declare setHashtags: BelongsToManySetAssociationsMixin<Hashtag, number>;

  static initiate(sequelize: Sequelize.Sequelize) {
    Meeting.init(
      {
        id: {
          type: Sequelize.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
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
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
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
  static associate() {
    Meeting.hasMany(Post);
    Meeting.belongsToMany(User, {
      through: "MeetingUser",
      as: "Member",
    });
    Meeting.belongsToMany(Hashtag, {
      through: "MeetingHashtag",
    });
  }
}

export default Meeting;
