import express from "express";
import { isLoggedIn } from "../middlewares";
import User from "../models/user";
import Meeting from "../models/meeting";

const router = express.Router();

/** GET /posts */
router.get("/", isLoggedIn, async (req, res, next) => {
  // 특정 모임의 게시글 - 작성자 포함
  try {
    const meeting = await Meeting.findOne({
      where: { id: Number(req?.query.meetId) },
    });
    if (!meeting) {
      return res
        .status(404)
        .json({ code: 404, message: "존재하지 않는 모임입니다." });
    }
    const posts = await meeting.getPosts({
      limit: 10,
      order: [["createdAt", "DESC"]],
      attributes: {
        exclude: ["updatedAt"],
      },
      include: [
        {
          model: User,
          attributes: ["id", "nickname", "img"],
        },
      ],
    });
    return res.status(200).json({ code: 200, posts });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

export default router;
