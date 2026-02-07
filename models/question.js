const mongoose = require('mongoose');

const StatSchema = new mongoose.Schema({
    answers: {
        type: Number,
        default: 0
    },
    votes: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    timeAgo: {
        type: Date,
        default: Date.now
    }
})

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    subtitle: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: true,
        enum: ['Science', 'Philosophy', 'Society']
    },
    hasAnswer: {
        type: Boolean,
        default: false
    },
    answerPreview: {
        type: String,
        required: false
    },
    stats: StatSchema
});

module.exports = mongoose.model('Question', questionSchema);