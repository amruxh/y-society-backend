const Question = require("../models/question");
const { getPagination } = require("../utils/pagination");
const { escapeRegex } = require("../utils/escapeRegex");
const { pick } = require("../utils/pick");

const QUESTION_CREATOR_POPULATE = {
  path: "createdBy",
  select: "full_name profile_pic",
};

const buildQuestionsQuery = (search) => {
  const query = { isDeleted: false };
  if (!search) return query;

  const safe = escapeRegex(search.trim());
  if (!safe) return query;

  const regex = new RegExp(safe, "i");
  query.$or = [{ title: regex }, { description: regex }, { tags: regex }];
  return query;
};

// ================= GET ALL QUESTIONS =================
// pagination + search + filter deleted
exports.getAllQuestions = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const search =
      typeof req.query.search === "string" ? req.query.search : "";

    const query = buildQuestionsQuery(search);

    const [questions, total] = await Promise.all([
      Question.find(query)
        .populate(QUESTION_CREATOR_POPULATE)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Question.countDocuments(query),
    ]);

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      questions,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET QUESTION BY ID =================
// increase views + populate answers
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { $inc: { views: 1 } },
      { new: true },
    )
      .populate(QUESTION_CREATOR_POPULATE)
      .populate("acceptedAnswer")
      .lean();

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= CREATE QUESTION =================
exports.createQuestion = async (req, res) => {
  try {
    const { title, description, category, tags } = req.body;

    const question = new Question({
      title,
      description,
      category,
      tags,
      createdBy: req.user.id, // from auth middleware
    });

    const saved = await question.save();

    res.status(201).json({
      message: "Question created",
      question: saved,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ================= UPDATE QUESTION =================
exports.updateQuestionById = async (req, res) => {
  try {
    const updates = pick(req.body, [
      "title",
      "description",
      "category",
      "tags",
    ]);

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const question = await Question.findById(req.params.id).select(
      "createdBy isDeleted",
    );

    if (!question || question.isDeleted) {
      return res.status(404).json({ message: "Question not found" });
    }

    // only owner or admin can edit
    if (
      question.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await Question.findByIdAndUpdate(
      req.params.id,
      { $set: { ...updates, isEdited: true } },
      { new: true, runValidators: true },
    );

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ================= DELETE QUESTION (SOFT DELETE) =================
exports.deleteQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).select(
      "createdBy isDeleted",
    );

    if (!question || question.isDeleted) {
      return res.status(404).json({ message: "Question not found" });
    }

    // only owner or admin
    if (
      question.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Question.updateOne(
      { _id: req.params.id },
      { $set: { isDeleted: true } },
    );

    res.json({ message: "Question deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.voteQuestion = async (req, res) => {
  try {
    const userId = req.user.id;
    const questionId = req.params.id;

    const question = await Question.findOne({
      _id: questionId,
      isDeleted: false,
    }).select("votes votesCount");

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // check if user already voted
    const hasVoted = question.votes.some((id) => id.toString() === userId);

    const update = hasVoted
      ? { $pull: { votes: userId }, $inc: { votesCount: -1 } }
      : { $addToSet: { votes: userId }, $inc: { votesCount: 1 } };

    const updated = await Question.findByIdAndUpdate(questionId, update, {
      new: true,
    }).select("votesCount");

    res.json({
      message: "Vote updated",
      votesCount: updated?.votesCount ?? question.votesCount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
