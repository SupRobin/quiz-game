const express = require('express');
const fs = require("fs");
const router = express.Router();
const postDBFileName = "./model/questions.json";
const { getQuestions } = require('../model/quizQuestions');


router.get('/index.html', (req, res) => {
    res.render('main/index');
});

router.get('/', (req, res) => {
    res.render('main/index');
});

router.post('/quiz/submit' , function(req, res) {
    res.send("Submitting...");
})

router.get('/quizgame', (req, res) => {
    const questions = getQuestions();
    res.render('main/quizgame', { questions });
});

module.exports = router;
