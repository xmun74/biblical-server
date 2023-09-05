import { RequestHandler } from "express";
import Post from "../models/post";
import User from "../models/user";

const getMe: RequestHandler = async (req, res, next) => {
  try {
    if (req?.user) {
      const userWithoutPwd = await User.findOne({
        where: { id: req?.user?.id },
        attributes: {
          exclude: [
            "password",
            "provider",
            "createdAt",
            "deletedAt",
            "updatedAt",
          ],
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
    } else {
      return res.status(200).json(null);
    }
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

const patchNickname: RequestHandler = async (req, res, next) => {
  const { nickname } = req.body;
  try {
    const exNick = await User.findOne({ where: { nickname } });
    if (req?.user?.nickname !== exNick?.nickname && exNick) {
      return res.status(409).send("중복된 닉네임입니다");
    }
    await User.update({ nickname: nickname }, { where: { id: req.user?.id } });
    return res.status(200).json({ nickname: nickname });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

const patchUserImage: RequestHandler = async (req, res, next) => {
  try {
    if (req.file) {
      console.log("❌", req.file?.filename);
      await User.update(
        { img: `/${req.file?.filename}` },
        { where: { id: req?.user?.id } }
      );
      return res.status(200).json({
        fileName: req.file?.filename,
        userImgUrl: `/${req.file?.filename}`,
      });
    } else {
      return res
        .status(404)
        .json({ code: 404, message: "이미지 파일이 없습니다." });
    }
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

const deleteUser: RequestHandler = async (req, res, next) => {
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
const getUser: RequestHandler = async (req, res, next) => {
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

const follow: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req?.user?.id } });
    if (user) {
      await user.addFollowing(parseInt(req.params.id, 10));
      res.send("팔로우 성공");
    } else {
      res.status(404).send("존재하지 않는 유저입니다.");
    }
  } catch (err) {
    console.error(err);
    return next(err);
  }
};
const unFollow: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.id } });
    if (user) {
      await user.removeFollower(req?.user?.id);
      return res.status(200).json({ id: parseInt(req.params.id, 10) });
    } else {
      return res.status(403).send("존재하지 않는 유저입니다.");
    }
  } catch (err) {
    console.error(err);
    return next(err);
  }
};
export default {
  getMe,
  patchNickname,
  patchUserImage,
  deleteUser,
  getUser,
  follow,
  unFollow,
};
