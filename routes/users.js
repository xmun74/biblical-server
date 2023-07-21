const express = require("express");
const { isLoggedIn } = require("../middlewares");
const {
  getUser,
  patchUser,
  deleteUser,
  getMe,
} = require("../controllers/users");
const router = express.Router();

/* /users 내 프로필 조회/수정/탈퇴 */
router
  .route("/")
  .get(isLoggedIn, getMe)
  .patch(isLoggedIn, patchUser)
  .delete(isLoggedIn, deleteUser);

/* /users/:id - 유저 조회 */
router.route("/:id").get(isLoggedIn, getUser);

module.exports = router;
