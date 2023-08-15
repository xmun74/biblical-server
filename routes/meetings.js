const express = require("express");
const { isLoggedIn } = require("../middlewares");
const {
  getMeeting,
  deleteMeeting,
  getMeetings,
  postMeeting,
} = require("../controllers/meeting");

const router = express.Router();

/* /meetings - 모임 전체 조회, 모임 생성 */
router.route("/").get(isLoggedIn, getMeetings).post(isLoggedIn, postMeeting);

/* /meetings/1 - 모임 1개 조회, 모임 탈퇴 */
router
  .route("/:meetId")
  .get(isLoggedIn, getMeeting)
  .delete(isLoggedIn, deleteMeeting);

module.exports = router;
