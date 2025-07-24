var express = require('express');
const fs = require("fs");

var router = express.Router();

const quiz = "./model/questions.json";
router.get('/quiz', (req, res) => {
    res.render('quiz', { quiz });
});

// POST /quiz/submit — grade the quiz
router.post('/quiz/submit', (req, res) => {
    // answers will be an object like { '0': 'paris', '1': 'mars', … }
    const answers = req.body.answers || {};

    // Build a results array
    const results = quiz.questions.map((q, i) => {
        const selected = answers[i];
        const correct = selected === q.correctAnswer;
        return {
            question:     q.question,
            selected,
            correctAnswer: q.correctAnswer,
            correct
        };
    });

    // Compute score
    const score = results.filter(r => r.correct).length;
    const total = quiz.questions.length;

    // Render a results view (create results.ejs as needed)
    res.render('results', { results, score, total });
});

module.exports = router;


function readUserDB() {
    let data = fs.readFileSync(quiz, "utf-8");
    console.log(data);
    return JSON.parse(data);
}


module.exports = router;