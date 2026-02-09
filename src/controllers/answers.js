const Answer = require("../models/answer");
const Question = require("../models/question");
const { pick } = require("../utils/pick");

const ANSWER_AUTHOR_POPULATE = {
  path: "answeredBy",
  select: "full_name profile_pic role",
};

const applyAnswerVote = async (answerId, userId, vote) => {
  const answer = await Answer.findOne({
    _id: answerId,
    isDeleted: false,
  }).select("votes upvoteCount downvoteCount");

  if (!answer) {
    return { notFound: true };
  }

  const existingVoteIndex = answer.votes.findIndex(
    (v) => v.user.toString() === userId,
  );

  let update = null;
  let arrayFilters = undefined;

  if (existingVoteIndex !== -1) {
    const existingVote = answer.votes[existingVoteIndex].vote;

    if (existingVote === vote) {
      update = {
        $pull: { votes: { user: userId } },
        $inc: {
          upvoteCount: vote === "up" ? -1 : 0,
          downvoteCount: vote === "down" ? -1 : 0,
        },
      };
    } else {
      update = {
        $set: { "votes.$[vote].vote": vote },
        $inc: {
          upvoteCount: vote === "up" ? 1 : -1,
          downvoteCount: vote === "down" ? 1 : -1,
        },
      };
      arrayFilters = [{ "vote.user": userId }];
    }
  } else {
    update = {
      $push: { votes: { user: userId, vote } },
      $inc: {
        upvoteCount: vote === "up" ? 1 : 0,
        downvoteCount: vote === "down" ? 1 : 0,
      },
    };
  }

  const updateOptions = { new: true };
  if (arrayFilters) {
    updateOptions.arrayFilters = arrayFilters;
  }

  const updated = await Answer.findByIdAndUpdate(
    answerId,
    update,
    updateOptions,
  ).select("upvoteCount downvoteCount");

  return { updated };
};

exports.getAnswersByQuestionId = async (req, res) => {
  try {
    const answers = await Answer.find({
      question: req.params.questionId,
      isDeleted: false,
    })
      .populate(ANSWER_AUTHOR_POPULATE)
      .sort({ upvoteCount: -1 })
      .lean();

    res.json(answers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createAnswer = async (req, res) => {
  try {
    const { question, body, answeredBy } = req.body;

    const questionDoc = await Question.findById(question).select("isDeleted");
    if (!questionDoc || questionDoc.isDeleted) {
      return res.status(404).json({ message: "Question not found" });
    }

    const authorId = req.user?.id || answeredBy;
    if (!authorId) {
      return res.status(400).json({ message: "answeredBy is required" });
    }

    const answer = new Answer({
      question,
      body,
      answeredBy: authorId,
    });
    const newAnswer = await answer.save();

    await Question.updateOne(
      { _id: question, isDeleted: false },
      { $inc: { answersCount: 1 } },
    );

    res.status(201).json(newAnswer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateAnswerById = async (req, res) => {
  try {
    const updates = pick(req.body, ["body"]);

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const updated = await Answer.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { $set: { ...updates, isEdited: true } },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return res.status(404).json({ message: "Answer not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteAnswerById = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id).select(
      "question isAccepted isDeleted",
    );
    if (!answer || answer.isDeleted) {
      return res.status(404).json({ message: "Answer not found" });
    }

    await Answer.updateOne(
      { _id: req.params.id },
      { $set: { isDeleted: true } },
    );

    const questionUpdate = {
      $inc: { answersCount: -1 },
      $max: { answersCount: 0 },
    };
    if (answer.isAccepted) {
      questionUpdate.$set = {
        hasAcceptedAnswer: false,
        acceptedAnswer: null,
      };
    }

    await Question.updateOne(
      { _id: answer.question, isDeleted: false },
      questionUpdate,
    );

    res.json({ message: "Answer deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.upvoteAnswer = async (req, res) => {
  try {
    const userId = req.user.id;
    const answerId = req.params.id;

    const { notFound, updated } = await applyAnswerVote(
      answerId,
      userId,
      "up",
    );

    if (notFound) {
      return res.status(404).json({ message: "Answer not found" });
    }

    res.json({
      message: "Upvote updated",
      upvoteCount: updated?.upvoteCount ?? 0,
      downvoteCount: updated?.downvoteCount ?? 0,
    });
  } catch (err) {
    console.error("UPVOTE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.downvoteAnswer = async (req, res) => {
  try {
    const userId = req.user.id;
    const answerId = req.params.id;

    const { notFound, updated } = await applyAnswerVote(
      answerId,
      userId,
      "down",
    );

    if (notFound) {
      return res.status(404).json({ message: "Answer not found" });
    }

    res.json({
      message: "Downvote updated",
      upvoteCount: updated?.upvoteCount ?? 0,
      downvoteCount: updated?.downvoteCount ?? 0,
    });
  } catch (err) {
    console.error("DOWNVOTE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
