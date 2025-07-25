const express = require('express');
const fs = require("fs");
const router = express.Router();
const postDBFileName = "./model/questions.json";


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
    res.render('main/quizgame', {
        question: 'What is the capital of France?',
        answers: ['Paris', 'Berlin', 'Madrid', 'Rome']
    });
});

function readQuizDB() {
    let data = fs.readFileSync(postDBFileName, "utf-8");
    return JSON.parse(data);
}

module.exports = router;
