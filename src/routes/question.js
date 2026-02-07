const express = require("express");
const router = express.Router();
const {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestionById,
  deleteQuestionById,
} = require("../controllers/questions");

router.get("/", getAllQuestions);
router.get("/:id", getQuestionById);
router.post("/", createQuestion);
router.put("/:id", updateQuestionById);
router.delete("/:id", deleteQuestionById);

module.exports = router;
