const total = document.querySelectorAll('template[id^="q-"]').length;
let current = 0, score = 0, hp = total, timerId;

const playArea = document.getElementById('play-area');
const nextBtn = document.getElementById('next-btn');
const result = document.getElementById('result-box');
const healthFill= document.getElementById('health-fill');
const hpText = document.getElementById('hp-text');
const timer = document.getElementById('timer');
const timerBox = document.getElementById('timer-box');

nextBtn.addEventListener('click', () => {
    current++;
    startQuestion();
});

startQuestion();

function startQuestion() {
    clearInterval(timerId);
    updateHP();
    renderQuestion();
    if (current < total) {
        timerBox.style.display = 'block';
        startTimer();
    }
}

function renderQuestion() {
    playArea.innerHTML = '';
    nextBtn.disabled   = true;
    result.textContent = '';
    if (current >= total) {
        clearTimer();
        timerBox.style.display = 'none';
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
                btn.style.borderColor = '#00ff00';
                score++;
            } else {
                btn.style.borderColor = '#f00000';
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
    timer.textContent = timeLeft;
    timerId = setInterval(() => {
        if (--timeLeft <= 0) {
            clearInterval(timerId);
            document.querySelectorAll('.answer').forEach(b => b.disabled = true);
            result.textContent = "✗ Time's up!";
            hp--;
            updateHP();
            nextBtn.disabled = false;
        }
        timer.textContent = timeLeft;
    }, 1000);
}

function clearTimer() {
    if (timerId) clearInterval(timerId);
}