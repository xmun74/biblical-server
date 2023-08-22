const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");
const {
  getMeeting,
  deleteMeeting,
  getMeetings,
  postMeeting,
  postMeetingInviteLink,
  postMeetingInvite,
  getMembers,
  getMeetingInviteInfo,
} = require("../controllers/meetings");

const router = express.Router();

/* /meetings - 모임 전체 조회, 모임 생성 */
router.route("/").get(isLoggedIn, getMeetings).post(isLoggedIn, postMeeting);

/* /meetings/1 - 모임 1개 조회, 모임 탈퇴 */
router
  .route("/:meetId")
  .get(isLoggedIn, getMeeting)
  .delete(isLoggedIn, deleteMeeting);

/* /meetings/1/invite - 모임초대 링크 생성 */
router.post("/:meetId/invite", isLoggedIn, postMeetingInviteLink);
/* /meetings/1/invite/inviteLink - 모임초대 생성, 모임명 조회 */
router
  .route("/:meetId/invite/:inviteLink")
  .get(isLoggedIn, getMeetingInviteInfo)
  .post(isLoggedIn, postMeetingInvite);
/* /meetings/1/members - 모임멤버 조회 */
router.get("/:meetId/members", isLoggedIn, getMembers);

module.exports = router;
