const Post = require("../models/post");
const User = require("../models/user");

exports.getMe = async (req, res, next) => {
  try {
    if (req?.user) {
      const userWithoutPwd = await User.findOne({
        where: { id: req.user?.id },
        attributes: {
          exclude: ["password", "provider"],
        },
        include: [
          {
            model: Post,
            attributes: ["id"],
          },
          { model: User, as: "Followings", attributes: ["id"] },
          { model: User, as: "Followers", attributes: ["id"] },
        ],
      });
      console.log("userWithoutPwd :", userWithoutPwd);
      return res.status(200).json(userWithoutPwd);
    } else {
      return res.status(200).json(null);
    }
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

exports.patchUser = async (req, res, next) => {
  const body = req.body;
  try {
    if (req?.user) {
      await User.update(
        { nickname: body.nickname },
        { where: { id: req.user.id } }
      );
      return res.status(200).json({ nickname: body.nickname });
    } else {
      return res.status(200).json({ error: "Unauthorized" });
    }
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    if (req?.user) {
      await User.destroy({
        where: { id: req?.user?.id },
      });
      res.clearCookie("connect.sid");
      res.clearCookie("session-cookie");
      await req.session.destroy((err) => {
        if (err) {
          return res.status(400).send("로그인하지 않았습니다.");
        }
      });
      return res.status(200).send("회원탈퇴 처리 완료");
    } else {
      return res.status(200).json({ error: "Unauthorized" });
    }
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

/**  /users/1  */
exports.getUser = async (req, res, next) => {
  try {
    const userWithoutPwd = await User.findOne({
      where: { id: req?.params.id },
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Post,
          attributes: ["id"],
        },
        { model: User, as: "Followings", attributes: ["id"] },
        { model: User, as: "Followers", attributes: ["id"] },
      ],
    });
    if (userWithoutPwd) {
      const userData = userWithoutPwd.toJSON();
      userData.Posts = userData.Posts.length;
      userData.Followers = userData.Followers.length;
      userData.Followings = userData.Followings.length;
      return res.status(200).json(userData);
    } else {
      return res.status(404).json("존재하지 않는 회원입니다.");
    }
  } catch (err) {
    console.error(err);
    return next(err);
  }
};
