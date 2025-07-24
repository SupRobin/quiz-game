const express = require('express');
const fs = require("fs");
const router = express.Router();
const postDBFileName = "./model/questions.json";


router.get('/', function(req, res, next) {
  res.render('/views/main/selection');
});

router.get('/quiz', function(req, res, next) {
  let posts = readQuizDB();
  res.render('./views/main/compose', {posts: posts.posts});
});


router.get('/quiz/setup', (req, res) => {
    res.render('setup', { totalQuestions: quiz.questions.length });
});

router.post('/quiz/setup', (req, res) => {
    const num = parseInt(req.body.numQuestions, 10);
});

function readQuizDB() {
    let data = fs.readFileSync(postDBFileName, "utf-8");
    return JSON.parse(data);
}

module.exports = router;
