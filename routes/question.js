const express = require('express');
const router = express.Router();
const Question = require('../models/question');

// GET all questions
router.get('/', async (req, res) => {
    try {
        const questions = await Question.find();
        res.json(questions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

// GET one question by id
router.get('/:id',async (req, res) => {
    try {
        const questionId = req.params.id;
        const question = await Question.findById(questionId);
        res.json(question);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

// POST a new question
router.post('/', async (req, res) => {
    try {
        console.log(req.body);
        
        const question = new Question(req.body);
        const newQuestion = await question.save();
        res.status(201).json(newQuestion);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})

// DELETE a question by id
router.delete('/:id', async (req, res) => {
    try {
        const questionId = req.params.id;
        const deletedQuestion = await Question.findByIdAndDelete(questionId);
        res.json(deletedQuestion);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

module.exports = router;