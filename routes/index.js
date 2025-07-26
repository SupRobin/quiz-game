const express = require('express');
const fs = require("fs");
const router = express.Router();
const postDBFileName = "./model/questions.json";
const { getQuestions } = require('../model/quizQuestions');


router.get('/', function(req, res, next) {
  res.render('./main/quiz-setup');
});

router.get('/quiz', function(req, res, next) {
  let quiz = readQuizDB();
  res.render('./main/quiz', {quiz: quiz});
});

router.post('/quiz/submit' , function(req, res) {
    res.send("Submitting...");
})

router.get('/quizgame', (req, res) => {
    const questions = getQuestions();
    res.render('main/quizgame', {
        questions
    });
});

function readQuizDB() {
    let data = fs.readFileSync(postDBFileName, "utf-8");
    return JSON.parse(data);
}

module.exports = router;
