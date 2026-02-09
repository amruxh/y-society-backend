const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
      index: true,
    },

    answeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    body: {
      type: String,
      required: true,
      trim: true,
    },

    votes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        vote: {
          type: String,
          enum: ["up", "down"],
        },
      },
    ],

    upvoteCount: {
      type: Number,
      default: 0,
    },

    downvoteCount: {
      type: Number,
      default: 0,
    },

    isAccepted: {
      type: Boolean,
      default: false,
    },

    isEdited: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

answerSchema.index({ question: 1, isDeleted: 1, upvoteCount: -1 });

module.exports = mongoose.model("Answer", answerSchema);
