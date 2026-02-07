const express = require("express");
const router = express.Router();
const {
  getAnswersByQuestionId,
  updateAnswerById,
} = require("../controllers/answers");

router.get("/question/:questionId", getAnswersByQuestionId);
router.put("/:id", updateAnswerById);

module.exports = router;
