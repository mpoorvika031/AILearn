const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const { message } = req.body;

  res.json({
    type: "text",
    reply: "You said: " + message
  });
});

module.exports = router;