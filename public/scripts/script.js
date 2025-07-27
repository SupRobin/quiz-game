const total = document.querySelectorAll('template[id^="q-"]').length;
let current = 0, score = 0, hp = total, timerId;

const playArea   = document.getElementById('play-area');
const nextBtn    = document.getElementById('next-btn');
const result     = document.getElementById('result-box');
const healthFill = document.getElementById('health-fill');
const hpText     = document.getElementById('hp-text');
const timerEl    = document.getElementById('timer');

nextBtn.addEventListener('click', () => {
    current++;
    startQuestion();
});

startQuestion();

function startQuestion() {
    clearInterval(timerId);
    updateHP();
    renderQuestion();
    startTimer();
}

function renderQuestion() {
    playArea.innerHTML = '';
    nextBtn.disabled   = true;
    result.textContent = '';

    if (current >= total) {
        playArea.innerHTML = '<h3>Quiz complete!</h3>';
        result.textContent = `Your score: ${score} / ${total}`;
        nextBtn.style.display = 'none';
        return;
    }
    const tpl   = document.getElementById(`q-${current}`);
    const clone = tpl.content.cloneNode(true);
    playArea.appendChild(clone);

    const correct = tpl.dataset.correct;

    document.querySelectorAll('.answer').forEach(btn => {
        btn.disabled = false;
        btn.addEventListener('click', () => {
            clearInterval(timerId);
            document.querySelectorAll('.answer').forEach(b => b.disabled = true);

            if (btn.dataset.letter === correct) {
                btn.style.borderColor = '#0f0';
                score++;
            } else {
                btn.style.borderColor = '#f00';
                hp--;
                updateHP();
            }

            nextBtn.disabled = false;
        }, { once: true });
    });
}

function updateHP() {
    const pct = (hp / total) * 100;
    healthFill.style.width = pct + '%';
    hpText.textContent = `HP: ${hp} / ${total}`;
}

function startTimer() {
    let timeLeft = 10;
    timerEl.textContent = timeLeft;
    timerId = setInterval(() => {
        if (--timeLeft <= 0) {
            clearInterval(timerId);
            document.querySelectorAll('.answer').forEach(b => b.disabled = true);
            result.textContent = "✗ Time's up!";
            hp--;
            updateHP();
            nextBtn.disabled = false;
        }
        timerEl.textContent = timeLeft;
    }, 1000);
}

function clearTimer() {
    if (timerId) clearInterval(timerId);
}