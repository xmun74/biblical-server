const express = require("express");
const Bible = require("../models/bible");

const router = express.Router();

/** GET /bible - 성경 조회 */
router.get("/", async (req, res, next) => {
  const { book, chapter } = req.query;
  try {
    const bible = await Bible.findAll({
      where: {
        book,
        chapter,
      },
    });
    return res.status(200).json({
      code: 200,
      data: bible,
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

// 해당 book의 max chapter
router.get("/count/chapter", async (req, res, next) => {
  try {
    let count = [];
    for (let i = 1; i <= 66; i++) {
      const result = await Bible.findOne({
        where: { book: i },
        order: [["chapter", "DESC"]],
        attributes: ["book", "chapter"],
      });
      count.push(result);
    }

    return res.status(200).json({ code: 200, chapterCount: count });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

// 해당 book, chapter의 max verse
router.get("/count/verse", async (req, res, next) => {
  const { book, chapter } = req.query;
  try {
    const result = await Bible.findOne({
      where: { book, chapter },
      order: [["verse", "DESC"]],
      attributes: ["book", "chapter", "verse"],
    });

    return res.status(200).json({ code: 200, verseCount: result });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

module.exports = router;
