const express = require('express');
const fs = require("fs");
const router = express.Router();
const postDBFileName = "./model/questions.json";


router.get('/', function(req, res, next) {
  res.render('./main/quiz');
});

router.get('/quiz', function(req, res, next) {
  let quiz = readQuizDB();
  res.render('./main/quiz', {quiz: quiz});
});

router.post('/quiz/submit' , function(req, res) {
    res.send("Submitting...");
})


router.get('/quiz/setup', (req, res) => {
    const quiz = readQuizDB();
    res.render('setup', { totalQuestions: quiz.question.length });
});


function readQuizDB() {
    let data = fs.readFileSync(postDBFileName, "utf-8");
    return JSON.parse(data);
}

module.exports = router;
