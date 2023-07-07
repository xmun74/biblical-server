const express = require("express");
const { isNotLoggedIn, isLoggedIn } = require("../middlewares");
const { renderProfile, renderJoin, renderMain } = require("../controllers");

const router = express.Router();

// GET /
// router.get("/", (req, res) => {
//   res.json({ name: `get / 응답입니다` });
// });

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCount = 0;
  res.locals.followingCount = 0;
  res.locals.followingIdList = [];
  next();
});

router.get(`/profile`, isLoggedIn, renderProfile);
router.get(`/signup`, isNotLoggedIn, renderJoin);
router.get("/", renderMain);

module.exports = router;
