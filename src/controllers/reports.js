const Report = require("../models/reports");
const Question = require("../models/question");
const Answer = require("../models/answer");

exports.addReport = async (req, res) => {
  try {
    const { type, object_id, reason } = req.body;
    const reported_by = req.user.id;

    if (!["question", "answer"].includes(type)) {
      return res.status(400).json({ message: "Invalid report type" });
    }

    // check if object exists
    let content;
    if (type === "question") {
      content = await Question.findById(object_id);
    } else {
      content = await Answer.findById(object_id);
    }

    if (!content || content.isDeleted) {
      return res.status(404).json({ message: "Content not found" });
    }

    // prevent duplicate report by same user
    const existingReport = await Report.findOne({
      reported_by,
      object_id,
      type,
    });

    if (existingReport) {
      return res
        .status(400)
        .json({ message: "You already reported this content" });
    }

    // save report
    const report = await Report.create({
      type,
      object_id,
      reason,
      reported_by,
    });

    // count total reports
    const totalReports = await Report.countDocuments({
      object_id,
      type,
    });

    // auto-delete after threshold
    if (totalReports >= 5) {
      content.isDeleted = true;
      await content.save();
    }

    res.json({
      message: "Report submitted",
      report,
      totalReports,
    });

  } catch (err) {
    console.error("REPORT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
