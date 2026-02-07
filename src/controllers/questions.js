const Question = require("../models/question");

exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    res.json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createQuestion = async (req, res) => {
  try {
    const question = new Question(req.body);
    const newQuestion = await question.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateQuestionById = async (req, res) => {
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(updatedQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteQuestionById = async (req, res) => {
  try {
    const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
    res.json(deletedQuestion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
