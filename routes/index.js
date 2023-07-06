const express = require("express");

const router = express.Router();

// GET /
router.get("/", (req, res) => {
  res.json({ name: `get / 응답입니다` });
});

module.exports = router;
