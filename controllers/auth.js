const bcrypt = require("bcrypt");
const passport = require("passport");
const User = require("../models/user");

exports.signup = async (req, res, next) => {
  const { email, nickname, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.redirect("/signup?error=exist");
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({ email, nickname, password: hash });
    return res.redirect("/");
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
      return res.redirect(`/?error=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect("/");
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
};
