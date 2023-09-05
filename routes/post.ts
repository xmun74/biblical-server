import express from "express";
import { isLoggedIn } from "../middlewares";
import postController from "../controllers/post";

const router = express.Router();

/** POST /post */
router.route("/").post(isLoggedIn, postController.uploadPost);
router
  .route("/:postId")
  /** GET /post/1 */
  .get(isLoggedIn, postController.getPost)
  /** PATCH /post/1 */
  .patch(isLoggedIn, postController.patchPost)
  /** DELETE /post/1 */
  .delete(isLoggedIn, postController.deletePost);

export default router;
