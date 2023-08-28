const express = require("express");
const Bible = require("../models/bible");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const { book, chapter } = req.query;
  try {
    const result = await Bible.findAll({
      where: {
        book,
        chapter,
      },
    });
    // console.log("🌏 조회 :", result);
    return res.status(200).json({ code: 200, data: result });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

module.exports = router;
