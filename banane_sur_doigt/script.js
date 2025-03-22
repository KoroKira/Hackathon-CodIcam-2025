const banana = document.getElementById('banana');
const finger = document.getElementById('finger');
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over');
const finalScoreDisplay = document.getElementById('final-score');

let bananaX = 125;
let bananaY = -100;
let bananaSpeed = 0.5; // Vitesse initiale
let score = 0;
let gameActive = true;

function updateBananaPosition() {
    if (!gameActive) return;

    bananaY += bananaSpeed;
    banana.style.top = bananaY + 'px';

    // Vérifier si la banane touche le doigt
    const bananaRect = banana.getBoundingClientRect();
    const fingerRect = finger.getBoundingClientRect();

    if (
        bananaRect.bottom >= fingerRect.top &&
        bananaRect.left >= fingerRect.left &&
        bananaRect.right <= fingerRect.right
    ) {
        score++;
        scoreDisplay.textContent = `Score : ${score}`;
        increaseBananaSpeed(); // Augmenter la vitesse
        resetBanana();
    } else if (bananaY + bananaRect.height >= gameContainer.offsetHeight) {
        endGame();
    } else {
        requestAnimationFrame(updateBananaPosition);
    }
}

function increaseBananaSpeed() {
    // Augmenter la vitesse en fonction du score
    bananaSpeed += 0.1; 
}

function resetBanana() {
    bananaY = -100;
    bananaX = Math.random() * (gameContainer.offsetWidth - banana.offsetWidth);
    banana.style.left = bananaX + 'px';
    updateBananaPosition();
}

function endGame() {
    gameActive = false;
    finalScoreDisplay.textContent = score;
    gameOverScreen.classList.remove('hidden');
}

function resetGame() {
    gameActive = true;
    score = 0;
    bananaSpeed = 1; // Réinitialiser la vitesse
    scoreDisplay.textContent = `Score : ${score}`;
    gameOverScreen.classList.add('hidden');
    resetBanana();
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' && bananaX > 0) {
        bananaX -= 10;
    } else if (event.key === 'ArrowRight' && bananaX < gameContainer.offsetWidth - banana.offsetWidth) {
        bananaX += 10;
    }
    banana.style.left = bananaX + 'px';
});

resetBanana();