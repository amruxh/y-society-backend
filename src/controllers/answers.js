const Answer = require("../models/answer");

exports.getAnswersByQuestionId = async (req, res) => {
  try {
    const answers = await Answer.find({ question: req.params.questionId })
      .populate("answeredBy", "full_name profile_pic role")
      .sort({ createdAt: 1 });

    res.json(answers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createAnswer = async (req, res) => {
  try {
    const answer = new Answer(req.body);
    const newAnswer = await answer.save();
    res.status(201).json(newAnswer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateAnswerById = async (req, res) => {
  try {
    const updatedAnswer = await Answer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(updatedAnswer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteAnswerById = async (req, res) => {
  try {
    const deletedAnswer = await Answer.findByIdAndDelete(req.params.id);
    res.json(deletedAnswer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

