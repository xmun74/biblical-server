import express from "express";
import { isLoggedIn } from "../middlewares";
import userController from "../controllers/users";
import multer from "multer";
import fs from "fs";
// import path from "path";
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";
const router = express.Router();

try {
  fs.readdirSync("uploads");
} catch (error) {
  console.error("uploads 폴더가 없으므로 uploads 폴더 생성.");
  fs.mkdirSync("uploads");
}

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.S3_KEY_ID as string,
    secretAccessKey: process.env.S3_SECRET_KEY as string,
  },
  region: "ap-northeast-2",
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.BUCKET_NAME as string,
    key(req, file, cb) {
      const fileName = `original/${Date.now()}_${file.originalname}`;
      cb(null, fileName);
    },
    acl: "public-read",
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB 제한

  /* storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads/");
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }), */
});

/* /users 내 프로필 조회/탈퇴 */
router
  .route("/")
  .get(isLoggedIn, userController.getMe)
  .delete(isLoggedIn, userController.deleteUser);

/**  닉네임/이미지 수정 */
router.patch("/nickname", isLoggedIn, userController.patchNickname);
router.post(
  "/image",
  isLoggedIn,
  upload.single("userImg"),
  userController.uploadUserImage
);

/* /users/:id - 유저 조회 */
router.route("/:id").get(isLoggedIn, userController.getUser);
router.route("/:id/follow").post(isLoggedIn, userController.follow);
router.route("/:id/follow").delete(isLoggedIn, userController.unFollow);

export default router;
