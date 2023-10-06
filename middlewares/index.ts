import { RequestHandler } from "express";

const isLoggedIn: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/auth/login");
    res.status(403).send("로그인 필요");
  }
};
const isNotLoggedIn: RequestHandler = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    const localStorageKey = JSON.parse(
      localStorage.getItem("isLoggedIn") as string
    );
    if (!localStorageKey) {
      localStorage.setItem("isLoggedIn", JSON.stringify(true));
    }
    res.status(403).json({ message: "이미 로그인했습니다" });
  }
};
export { isLoggedIn, isNotLoggedIn };
