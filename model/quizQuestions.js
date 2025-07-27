const questions     = require('./questions.json');
const DEFAULT_COUNT = 10;

function getQuestions(count) {
    count = count || DEFAULT_COUNT;
    const copy = questions.slice();

    //shuffle the 10 questions
    for (let i = copy.length - 1; i > 0; i--)
    {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp    = copy[i];
        copy[i]       = copy[j];
        copy[j]       = tmp;
    }
    return copy.slice(0, count);
}

module.exports = { getQuestions };