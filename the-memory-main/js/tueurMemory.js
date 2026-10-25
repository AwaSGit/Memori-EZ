const cardsContainer = document.querySelector(".cartes");
const levelDisplay = document.querySelector("#level");
const timerDisplay = document.querySelector("#timer");
const turnDisplay = document.querySelector("#turn");
const team1ScoreDisplay = document.querySelector("#team1-score");
const team2ScoreDisplay = document.querySelector("#team2-score");
const overlay = document.querySelector("#game-overlay");
const resultTitle = document.querySelector("#result-title");
const resultMessage = document.querySelector("#result-message");
const resultButton = document.querySelector("#result-button");
const restartButton = document.querySelector("#restart-button");

const rounds = [
  { pairs: 4, seconds: 60 },
  { pairs: 6, seconds: 55 },
  { pairs: 8, seconds: 50 },
];

let round = 0;
let timeLeft = rounds[round].seconds;
let team1Score = 0;
let team2Score = 0;
let currentTeam = 1;
let matchedPairs = 0;
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let gameFinished = false;
let timerId = null;
let turnTimeoutId = null;

function updateStatus() {
  levelDisplay.textContent = `Manche ${round + 1}`;
  timerDisplay.textContent = `Temps : ${timeLeft} s`;
  turnDisplay.textContent = `Au tour de l'équipe ${currentTeam}`;
  team1ScoreDisplay.textContent = `Équipe 1 : ${team1Score}`;
  team2ScoreDisplay.textContent = `Équipe 2 : ${team2Score}`;
}

function shuffle(values) {
  for (let index = values.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [values[index], values[randomIndex]] = [values[randomIndex], values[index]];
  }
  return values;
}

function createCard(imageNumber) {
  const card = document.createElement("li");
  card.className = "carte";
  card.dataset.image = String(imageNumber);
  card.innerHTML = `
    <button class="card-button" type="button" aria-label="Retourner une carte">
      <span class="card-face card-front">
        <img src="../assets/images/Question_mark.png" alt="" />
      </span>
      <span class="card-face card-back">
        <img src="../assets/images/img-${imageNumber}.png" alt="Carte mémoire ${imageNumber}" />
      </span>
    </button>
  `;
  card.querySelector("button").addEventListener("click", () => flipCard(card));
  return card;
}

function startRound(roundIndex = round) {
  clearTimeout(turnTimeoutId);
  turnTimeoutId = null;
  round = roundIndex;
  timeLeft = rounds[round].seconds;
  matchedPairs = 0;
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  gameFinished = false;
  currentTeam = 1;
  overlay.classList.add("hidden");

  const images = Array.from({ length: rounds[round].pairs }, (_, index) => index + 1);
  cardsContainer.replaceChildren(...shuffle([...images, ...images]).map(createCard));
  updateStatus();
  startTimer();
}

function startGame() {
  round = 0;
  team1Score = 0;
  team2Score = 0;
  startRound();
}

function startTimer() {
  clearInterval(timerId);
  timerId = window.setInterval(() => {
    timeLeft -= 1;
    updateStatus();
    if (timeLeft <= 0) {
      finishRound(false);
    }
  }, 1000);
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
  lockBoard = true;

  if (firstCard.dataset.image === secondCard.dataset.image) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    if (currentTeam === 1) {
      team1Score += 1;
    } else {
      team2Score += 1;
    }
    matchedPairs += 1;
    updateStatus();
    resetTurn();

    if (matchedPairs === rounds[round].pairs) {
      window.setTimeout(() => finishRound(true), 450);
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
    currentTeam = currentTeam === 1 ? 2 : 1;
    updateStatus();
    resetTurn();
  }, 850);
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function finishRound(won) {
  if (gameFinished) {
    return;
  }

  gameFinished = true;
  clearTimeout(turnTimeoutId);
  turnTimeoutId = null;
  clearInterval(timerId);
  const winner = team1Score === team2Score
    ? "Égalité !"
    : `L'équipe ${team1Score > team2Score ? "1" : "2"} gagne !`;

  resultTitle.textContent = won ? winner : "Temps écoulé !";
  resultMessage.textContent = won
    ? `Score — Équipe 1 : ${team1Score} · Équipe 2 : ${team2Score}`
    : `Score actuel — Équipe 1 : ${team1Score} · Équipe 2 : ${team2Score}`;
  resultButton.textContent = won && round < rounds.length - 1 ? "Manche suivante" : "Rejouer";
  overlay.classList.remove("hidden");
  resultButton.focus();
}

restartButton.addEventListener("click", startGame);
resultButton.addEventListener("click", () => {
  if (gameFinished && matchedPairs === rounds[round].pairs && round < rounds.length - 1) {
    startRound(round + 1);
    return;
  }
  startGame();
});

startGame();
