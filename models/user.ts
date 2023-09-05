import Sequelize, {
  BelongsToManyAddAssociationMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";
import Post from "./post";
import Meeting from "./meeting";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare email: string;
  declare nickname: string;
  declare password: CreationOptional<string>;
  declare img: CreationOptional<string>;
  declare provider: CreationOptional<string>;
  declare snsId: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;

  declare Followers?: NonAttribute<User[]>;
  declare Followings?: NonAttribute<User[]>;
  declare getMember: BelongsToManyGetAssociationsMixin<Meeting>;
  declare addFollowing: BelongsToManyAddAssociationMixin<User, number>;
  declare removeFollower: BelongsToManyRemoveAssociationMixin<User, number>;

  static initiate(sequelize: Sequelize.Sequelize) {
    User.init(
      {
        id: {
          type: Sequelize.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        email: {
          type: Sequelize.STRING(40),
          allowNull: true,
          unique: true,
        },
        nickname: {
          type: Sequelize.STRING(15),
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        img: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
        provider: {
          type: Sequelize.ENUM("local", "kakao"),
          allowNull: false,
          defaultValue: "local",
        },
        snsId: {
          type: Sequelize.STRING(30),
          allowNull: true,
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
        deletedAt: Sequelize.DATE,
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "User",
        tableName: "users",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate() {
    User.hasMany(Post, {
      sourceKey: "id",
      foreignKey: "userId",
    });
    User.belongsToMany(Meeting, {
      through: "MeetingUser",
      as: "Member",
    });
    User.belongsToMany(User, {
      foreignKey: "followingId",
      as: "Followers",
      through: "Follow",
    });
    User.belongsToMany(User, {
      foreignKey: "followerId",
      as: "Followings",
      through: "Follow",
    });
  }
}

export default User;
