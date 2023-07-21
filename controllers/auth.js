const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/user");
const Post = require("../models/post");

exports.signup = async (req, res, next) => {
  const { email, nickname, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    const exNick = await User.findOne({ where: { nickname } });
    if (exUser) {
      return res.status(409).send("중복된 이메일");
    }
    if (exNick) {
      return res.status(409).send("중복된 닉네임");
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({ email, nickname, password: hash });
    return res.status(201).send("회원가입 성공");
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

exports.login = (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.status(400).json(info);
    }
    return req.login(user, async (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      const userWithoutPwd = await User.findOne({
        where: { id: user?.id },
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
      return res.status(200).json(userWithoutPwd);
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.clearCookie("session-cookie");
    res.clearCookie("connect.sid");
    res.json({ message: "SUCCESS" });
  });
};
