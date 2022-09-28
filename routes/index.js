// routes/index.js

const express = require("express");
const router = express.Router();
const ws = require("express-ws");

router.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

module.exports = router;
