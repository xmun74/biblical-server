exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/auth/login");
    res.status(403).send("로그인 필요");
  }
};
exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    // const msg = encodeURIComponent("이미 로그인했습니다");
    // res.redirect(`/?error=${msg}`);
    res.status(403).json({ message: "이미 로그인했습니다" });
  }
};
