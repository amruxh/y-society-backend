const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["question", "answer"],
    required: true,
  },
  object_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  reported_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

ReportSchema.index({ object_id: 1, reported_by: 1, type: 1 }, { unique: true });

module.exports = mongoose.model("Report", ReportSchema);
