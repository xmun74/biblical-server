const express = require("express");
const { isLoggedIn } = require("../middlewares");
const { getUser, patchUser, deleteUser } = require("../controllers/users");
const router = express.Router();

/* /users */
router
  .route("/")
  .get((req, res) => {
    res.send(`${req.method} ${req.originalUrl}`);
  })
  .post((req, res) => {
    res.send(`${req.method} ${req.originalUrl}`);
  });

/* /users:id - 프로필유저 조회/수정/탈퇴 */
router
  .route("/:id")
  .get(isLoggedIn, getUser)
  .patch(isLoggedIn, patchUser)
  .delete(isLoggedIn, deleteUser);

module.exports = router;
