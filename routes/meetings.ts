import express from "express";
import { isLoggedIn } from "../middlewares";
import meetController from "../controllers/meetings";

const router = express.Router();

router
  .route("/")
  /* GET /meetings - 모임 전체 조회 */
  .get(isLoggedIn, meetController.getMeetings)
  /* POST /meetings - 모임 생성 */
  .post(isLoggedIn, meetController.postMeeting);

router
  .route("/:meetId")
  /* GET /meetings/1 - 모임 1개 조회 */
  .get(isLoggedIn, meetController.getMeeting)
  /* DELELTE /meetings/1 - 모임 삭제 */
  .delete(isLoggedIn, meetController.deleteMeeting);

/* DELETE /meetings/1/withdraw - 모임 탈퇴 */
router.delete("/:meetId/withdraw", isLoggedIn, meetController.deleteWithdraw);

/* POST /meetings/1/invite - 모임초대 링크 생성 */
router.post(
  "/:meetId/invite",
  isLoggedIn,
  meetController.postMeetingInviteLink
);

router
  .route("/:meetId/invite/:inviteLink")
  /* GET /meetings/1/invite/inviteLink - 모임명 조회 */
  .get(isLoggedIn, meetController.getMeetingInviteInfo)
  /* POST /meetings/1/invite/inviteLink - 모임초대 생성 */
  .post(isLoggedIn, meetController.postMeetingInvite);

/* GET /meetings/1/members - 모임멤버 조회 */
router.get("/:meetId/members", isLoggedIn, meetController.getMembers);

export default router;
