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
          { model: User, as: "Followings", attributes: ["id", "nickname"] },
          { model: User, as: "Followers", attributes: ["id", "nickname"] },
        ],
      });
      // console.log("userWithoutPwd :", userWithoutPwd);
      return res.status(200).json(userWithoutPwd);
    } else {
      return res.status(200).json(null);
    }
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

exports.patchNickname = async (req, res, next) => {
  const { nickname } = req.body;
  try {
    const exNick = await User.findOne({ where: { nickname } });
    if (req?.user?.nickname !== exNick?.nickname && exNick) {
      return res.status(409).send("중복된 닉네임입니다");
    }
    await User.update({ nickname: nickname }, { where: { id: req.user.id } });
    return res.status(200).json({ nickname: nickname });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

exports.patchUserImage = async (req, res, next) => {
  try {
    if (req.file) {
      await User.update(
        { img: `/${req.file.filename}` },
        { where: { id: req.user.id } }
      );
      return res.status(200).json({
        fileName: req.file.filename,
        userImgUrl: `/${req.file.filename}`,
      });
    } else {
      return res.status(200).json({ error: "이미지 파일이 없습니다." });
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
        { model: User, as: "Followings", attributes: ["id", "nickname"] },
        { model: User, as: "Followers", attributes: ["id", "nickname"] },
      ],
    });
    return res.status(200).json(userWithoutPwd);
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

exports.follow = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      await user.addFollowings(parseInt(req.params.id, 10));
      res.send("팔로우 성공");
    } else {
      res.statue(404).send("존재하지 않는 유저입니다.");
    }
  } catch (error) {
    console.error(err);
    return next(err);
  }
};
exports.unFollow = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.id } });
    if (user) {
      await user.removeFollowers(req.user.id);
      return res.status(200).json({ id: parseInt(req.params.id, 10) });
    } else {
      return res.statue(403).send("존재하지 않는 유저입니다.");
    }
  } catch (error) {
    console.error(err);
    return next(err);
  }
};
