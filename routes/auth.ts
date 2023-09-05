import express from "express";
import passport from "passport";
import { isNotLoggedIn, isLoggedIn } from "../middlewares";
import { signup, login, logout } from "../controllers/auth";

const router = express.Router();

router.post("/signup", isNotLoggedIn, signup);
router.post("/login", isNotLoggedIn, login);
router.get("/logout", isLoggedIn, logout);

router.get("/kakao", passport.authenticate("kakao"));
router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/?error=카카오로그인 실패",
  }),
  (req, res) => {
    res.redirect("/");
  }
);

export default router;
