const express = require("express");
const router = express.Router();
const {
  getAnswersByQuestionId,
  createAnswer,
  updateAnswerById,
  deleteAnswerById,
  upvoteAnswer,
  downvoteAnswer
} = require("../controllers/answers");

router.get("/question/:questionId", getAnswersByQuestionId);
router.post("/", createAnswer);
router.put("/:id", updateAnswerById);
router.delete("/:id", deleteAnswerById);
router.put("/:id/like", upvoteAnswer);
router.put("/:id/dislike", downvoteAnswer);

module.exports = router;