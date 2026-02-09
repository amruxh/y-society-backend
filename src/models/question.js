const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: ["Science", "Philosophy", "Society", "Technology"],
      required: true,
    },

    tags: [
      {
        type: String,
        lowercase: true,
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    answersCount: {
      type: Number,
      default: 0,
    },

    views: {
      type: Number,
      default: 0,
    },

    votes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    votesCount: {
      type: Number,
      default: 0,
    },

    hasAcceptedAnswer: {
      type: Boolean,
      default: false,
    },

    acceptedAnswer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Answer",
      default: null,
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
  { timestamps: true },
);

// FULL TEXT SEARCH INDEX
questionSchema.index({ title: "text", description: "text", tags: "text" });
questionSchema.index({ isDeleted: 1, createdAt: -1 });

module.exports = mongoose.model("Question", questionSchema);
