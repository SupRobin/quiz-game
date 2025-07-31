const total = document.querySelectorAll('template[id^="q-"]').length;
let current = 0, score = 0, hp = total, timerId;

const playArea = document.getElementById('play-area');
const nextBtn = document.getElementById('next-btn');
const result = document.getElementById('result-box');
const healthFill = document.getElementById('health-fill');
const hpText = document.getElementById('hp-text');
const timer = document.getElementById('timer');
const timerBox = document.getElementById('timer-box');
const backgroundTracks = [
    '/music/quiz_music.mp3',
    '/music/quiz_music2.mp3',
    '/music/quiz_music3.mp3'
];
const shareContainer = document.getElementById('share-container');
const shareTwitter   = document.getElementById('share-twitter');

const backgroundMusic = document.getElementById('background-music');
if (backgroundMusic) {
    backgroundMusic.src = backgroundTracks[Math.floor(Math.random() * backgroundTracks.length)];
    //play music if not blocked
    backgroundMusic.play().catch(err => {
        console.warn('Autoplay blocked', err);
    });
}

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
    nextBtn.disabled = true;
    result.textContent = '';
    if (current >= total) {
        clearTimer();
        timerBox.style.display = 'none';
        playArea.innerHTML = '<h3>Quiz complete!</h3>';
        result.textContent = `Your score: ${score} / ${total}`;
        nextBtn.style.display = 'none';
        document.getElementById('score-input').value = score;
        document.getElementById('score-form').submit();
        backgroundMusic.src  = '/music/quiz_finished.mp3';
        backgroundMusic.play().catch(err => {console.warn('Autoplay of final song blocked', err);});
        const message = encodeURIComponent(
            `I scored ${score}/${total} on the Quiz Game!`
        );
        shareContainer.style.display = 'block';
        //share on twitter
        document.getElementById('share-twitter').onclick = () => {
            const twitterUrl = `https://twitter.com/intent/tweet?text=${message}`;
            window.open(twitterUrl, '_blank', 'noopener');
        };
        return;
    }
    const tpl = document.getElementById(`q-${current}`);
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
        }, {once: true});
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
