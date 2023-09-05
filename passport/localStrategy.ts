import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import User from "../models/user";

export default () => {
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
              done(null, false, { message: "비밀번호가 틀렸습니다." });
            }
          } else {
            done(null, false, { message: "존재하지 않은 이메일입니다." });
          }
        } catch (err) {
          console.error(err);
          done(err);
        }
      }
    )
  );
};
