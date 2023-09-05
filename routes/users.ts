import express from "express";
import { isLoggedIn } from "../middlewares";
import {
  getUser,
  deleteUser,
  getMe,
  patchNickname,
  patchUserImage,
  follow,
  unFollow,
} from "../controllers/users";
import multer from "multer";
import fs from "fs";
import path from "path";
const router = express.Router();

try {
  fs.readdirSync("uploads");
} catch (error) {
  console.error("uploads 폴더가 없으므로 uploads 폴더 생성.");
  fs.mkdirSync("uploads");
}
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads/");
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, //5MB 제한
});

/* /users 내 프로필 조회/탈퇴 */
router.route("/").get(isLoggedIn, getMe).delete(isLoggedIn, deleteUser);

/**  닉네임/이미지 수정 */
router.patch("/nickname", isLoggedIn, patchNickname);
router.patch("/image", isLoggedIn, upload.single("userImg"), patchUserImage);

/* /users/:id - 유저 조회 */
router.route("/:id").get(isLoggedIn, getUser);
router.route("/:id/follow").post(isLoggedIn, follow);
router.route("/:id/follow").delete(isLoggedIn, unFollow);

export default router;
