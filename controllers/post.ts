import { RequestHandler } from "express";
import Hashtag from "../models/hashtag";
import Meeting from "../models/meeting";
import Post from "../models/post";
import User from "../models/user";

/**  POST /post */
const uploadPost: RequestHandler = async (req, res, next) => {
  const { title, content, tags, meetId } = req?.body;
  try {
    const meeting = await Meeting.findOne({ where: { id: meetId } });
    const post = await Post.create({
      title,
      content,
      userId: req?.user?.id,
    });
    if (meeting) {
      await meeting.addPost(post);
      if (tags) {
        const result = await Promise.all(
          tags.map((tag: string) =>
            Hashtag.findOrCreate({
              where: { title: tag.slice(1).toLowerCase() },
            })
          )
        );
        await post.addHashtags(result.map((v) => v[0]));
      }
      const postData = await Post.findOne({
        where: { id: post.id },
        attributes: {
          exclude: ["updatedAt"],
        },
        include: [
          {
            model: User, // 작성자
            attributes: ["id", "nickname", "img"],
          },
        ],
      });
      return res.status(201).json({ code: 201, data: postData });
    } else {
      return res
        .status(400)
        .json({ code: 400, message: "존재하지 않는 모임입니다." });
    }
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

/**  GET /post/1 */
const getPost: RequestHandler = async (req, res, next) => {
  try {
    const isPosted = await Post.findOne({ where: { id: req?.params.postId } });
    if (!isPosted) {
      return res
        .status(404)
        .json({ code: 404, message: "존재하지 않는 게시글입니다." });
    }
    const postData = await Post.findOne({
      where: { id: isPosted?.id },
      include: [
        {
          model: User, // 작성자
          attributes: ["id", "nickname", "img"],
        },
      ],
    });
    return res.status(200).json(postData);
  } catch (err) {
    console.error(err);
    return next(err);
  }
};
/**  PATCH /post/1 */
const patchPost: RequestHandler = async (req, res, next) => {
  const { title, content, tags } = req?.body;
  try {
    await Post.update(
      {
        title,
        content,
      },
      {
        where: { id: req?.params?.postId },
      }
    );
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (post && tags) {
      // tag 수정
      const result = await Promise.all(
        tags.map((tag: string) =>
          Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          })
        )
      );
      await post.setHashtags(result.map((v) => v[0]));
    }
    return res.status(200).json({
      code: 200,
      data: {
        postId: req.params.postId,
        title,
        content,
      },
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};
/**  DELETE /post/1 */
const deletePost: RequestHandler = async (req, res, next) => {
  try {
    const exPost = await Post.findOne({
      where: { id: req?.params.postId, userId: req?.user?.id },
    });
    const meeting = await Meeting.findOne({
      where: { id: Number(req?.query?.meetId) },
    });
    if (!exPost) {
      return res
        .status(404)
        .json({ code: 404, message: "존재하지 않는 게시글입니다." });
    }
    if (!meeting) {
      return res
        .status(404)
        .json({ code: 404, message: "존재하지 않는 모임입니다." });
    }
    await meeting.removePost(exPost);
    await Post.destroy({
      where: {
        id: req?.params.postId,
        userId: req?.user?.id,
      },
    });
    return res
      .status(200)
      .json({ code: 200, postId: parseInt(req?.params.postId) });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

export default { uploadPost, getPost, patchPost, deletePost };
