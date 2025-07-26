const questions = require('./questions.json');

const DEFAULT_COUNT = 10;

function getQuestions(count) {
    count = count || DEFAULT_COUNT;

    return questions.slice(0, count);
}

module.exports = { getQuestions };