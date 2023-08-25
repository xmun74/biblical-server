const express = require("express");
const { isLoggedIn } = require("../middlewares");
const Post = require("../models/post");
const User = require("../models/user");
const Meeting = require("../models/meeting");

const router = express.Router();

/** GET /posts */
router.get("/", isLoggedIn, async (req, res, next) => {
  // 특정 모임의 게시글 - 작성자 포함
  try {
    const meeting = await Meeting.findOne({ where: { id: req?.query.meetId } });
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

    // console.log("😎 게시글 전체조회 :", posts);
    res.status(200).json({ code: 200, posts });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

module.exports = router;
