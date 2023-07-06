const express = require('express');
const router = express.Router();

/* /user */
router
  .route('/')
  .get((req, res) => {
    res.send(`${req.method} ${req.originalUrl}`);
  })
  .post((req, res) => {
    res.send(`${req.method} ${req.originalUrl}`);
  });

/* /user:id */
router
  .route('/:id')
  .get((req, res) => {
    // console.log(req.params, req.query);
    res.send(`${req.method} ${req.originalUrl}`);
  })
  .put((req, res) => {
    res.send(`${req.method} ${req.originalUrl}`);
  })
  .delete((req, res) => {
    res.send(`${req.method} ${req.originalUrl}`);
  });

module.exports = router;
