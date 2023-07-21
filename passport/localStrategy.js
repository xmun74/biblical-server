const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/user");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: false,
      },
      async (email, password, done) => {
        try {
          const exUser = await User.findOne({ where: { email } });
          if (exUser) {
            const isPwdMatch = await bcrypt.compare(password, exUser.password);
            if (isPwdMatch) {
              done(null, exUser);
            } else {
              done(null, false, "비밀번호가 틀렸습니다.");
            }
          } else {
            done(null, false, "존재하지 않은 이메일입니다.");
          }
        } catch (err) {
          console.error(err);
          done(err);
        }
      }
    )
  );
};
