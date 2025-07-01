const express = require("express");
const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ status: "ok", message: "API de mensagens está ativa." });
});

module.exports = router;
