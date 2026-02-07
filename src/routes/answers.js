const express = require("express");
const router = express.Router();
const {
  getAnswersByQuestionId,
  createAnswer,
  updateAnswerById,
  deleteAnswerById,
} = require("../controllers/answers");

router.get("/question/:questionId", getAnswersByQuestionId);
router.post("/", createAnswer);
router.put("/:id", updateAnswerById);
router.delete("/:id", deleteAnswerById);

module.exports = router;
