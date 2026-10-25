const cardsContainer = document.querySelector(".cartes");
const levelDisplay = document.querySelector("#level");
const timerDisplay = document.querySelector("#timer");
const movesDisplay = document.querySelector("#moves");
const overlay = document.querySelector("#game-overlay");
const resultTitle = document.querySelector("#result-title");
const resultMessage = document.querySelector("#result-message");
const resultButton = document.querySelector("#result-button");
const restartButton = document.querySelector("#restart-button");

const levels = [
  { pairs: 4, seconds: 60 },
  { pairs: 6, seconds: 50 },
  { pairs: 8, seconds: 40 },
];

let level = 0;
let timeLeft = levels[level].seconds;
let moves = 0;
let matchedPairs = 0;
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let timerId = null;
let turnTimeoutId = null;
let gameFinished = false;

function updateStatus() {
  levelDisplay.textContent = `Level ${level + 1}`;
  timerDisplay.textContent = `Time: ${timeLeft}s`;
  movesDisplay.textContent = `Moves: ${moves}`;
}

function createCard(imageNumber) {
  const card = document.createElement("li");
  card.className = "carte";
  card.dataset.image = String(imageNumber);
  card.innerHTML = `
    <button class="card-button" type="button" aria-label="Flip card">
      <span class="card-face card-front">
        <img src="../assets/images/Question_mark.png" alt="" />
      </span>
      <span class="card-face card-back">
        <img src="../assets/images/img-${imageNumber}.png" alt="Memory card ${imageNumber}" />
      </span>
    </button>
  `;
  card.querySelector("button").addEventListener("click", () => flipCard(card));
  return card;
}

function shuffle(values) {
  for (let index = values.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [values[index], values[randomIndex]] = [values[randomIndex], values[index]];
  }
  return values;
}

function startTimer() {
  clearInterval(timerId);
  timerId = window.setInterval(() => {
    timeLeft -= 1;
    updateStatus();
    if (timeLeft <= 0) {
      endGame(false);
    }
  }, 1000);
}

function startLevel(levelIndex = level) {
  clearTimeout(turnTimeoutId);
  turnTimeoutId = null;
  level = levelIndex;
  timeLeft = levels[level].seconds;
  moves = 0;
  matchedPairs = 0;
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  gameFinished = false;
  overlay.classList.add("hidden");

  const images = Array.from({ length: levels[level].pairs }, (_, index) => index + 1);
  const deck = shuffle([...images, ...images]);
  cardsContainer.replaceChildren(...deck.map(createCard));

  updateStatus();
  startTimer();
}

function flipCard(card) {
  if (lockBoard || gameFinished || card === firstCard || card.classList.contains("matched")) {
    return;
  }

  card.classList.add("flipped");
  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  moves += 1;
  updateStatus();
  lockBoard = true;

  if (firstCard.dataset.image === secondCard.dataset.image) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matchedPairs += 1;
    resetTurn();

    if (matchedPairs === levels[level].pairs) {
      window.setTimeout(() => endGame(true), 450);
    }
    return;
  }

  const mismatchedFirstCard = firstCard;
  const mismatchedSecondCard = secondCard;
  turnTimeoutId = window.setTimeout(() => {
    turnTimeoutId = null;
    if (gameFinished) {
      return;
    }
    mismatchedFirstCard.classList.remove("flipped");
    mismatchedSecondCard.classList.remove("flipped");
    resetTurn();
  }, 850);
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function endGame(won) {
  if (gameFinished) {
    return;
  }

  gameFinished = true;
  clearTimeout(turnTimeoutId);
  turnTimeoutId = null;
  clearInterval(timerId);
  resultTitle.textContent = won
    ? level === levels.length - 1
      ? "You won!"
      : "Level complete!"
    : "Time is up!";
  resultMessage.textContent = won
    ? `You found every pair in ${moves} moves.`
    : "Give it another try and find all the matching pairs.";
  resultButton.textContent = won && level < levels.length - 1 ? "Next level" : "Play again";
  overlay.classList.remove("hidden");
  resultButton.focus();
}

restartButton.addEventListener("click", () => startLevel());
resultButton.addEventListener("click", () => {
  if (gameFinished && matchedPairs === levels[level].pairs && level < levels.length - 1) {
    startLevel(level + 1);
    return;
  }
  startLevel();
});

startLevel();
