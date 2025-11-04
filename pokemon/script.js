const pokemonList = [
  { name: "Bulbasaur", image: "https://img.pokemondb.net/sprites/sword-shield/icon/bulbasaur.png" },
  { name: "Ivysaur", image: "https://img.pokemondb.net/sprites/sword-shield/icon/ivysaur.png" },
  { name: "Venusaur", image: "https://img.pokemondb.net/sprites/sword-shield/icon/venusaur.png" },
  { name: "Charmander", image: "https://img.pokemondb.net/sprites/sword-shield/icon/charmander.png" },
  { name: "Charmeleon", image: "https://img.pokemondb.net/sprites/sword-shield/icon/charmeleon.png" },
  { name: "Charizard", image: "https://img.pokemondb.net/sprites/sword-shield/icon/charizard.png" },
  { name: "Squirtle", image: "https://img.pokemondb.net/sprites/sword-shield/icon/squirtle.png" },
  { name: "Wartortle", image: "https://img.pokemondb.net/sprites/sword-shield/icon/wartortle.png" },
  { name: "Blastoise", image: "https://img.pokemondb.net/sprites/sword-shield/icon/blastoise.png" },
  { name: "Pikachu", image: "https://img.pokemondb.net/sprites/sword-shield/icon/pikachu.png" },
  { name: "Raichu", image: "https://img.pokemondb.net/sprites/sword-shield/icon/raichu.png" },
  { name: "Jigglypuff", image: "https://img.pokemondb.net/sprites/sword-shield/icon/jigglypuff.png" },
  { name: "Gengar", image: "https://img.pokemondb.net/sprites/sword-shield/icon/gengar.png" },
  { name: "Eevee", image: "https://img.pokemondb.net/sprites/sword-shield/icon/eevee.png" },
  { name: "Snorlax", image: "https://img.pokemondb.net/sprites/sword-shield/icon/snorlax.png" },
  { name: "Mew", image: "https://img.pokemondb.net/sprites/sword-shield/icon/mew.png" },
  { name: "Mewtwo", image: "https://img.pokemondb.net/sprites/sword-shield/icon/mewtwo.png" },
  { name: "Chikorita", image: "https://img.pokemondb.net/sprites/sword-shield/icon/chikorita.png" },
  { name: "Cyndaquil", image: "https://img.pokemondb.net/sprites/sword-shield/icon/cyndaquil.png" },
  { name: "Totodile", image: "https://img.pokemondb.net/sprites/sword-shield/icon/totodile.png" },
  { name: "Treecko", image: "https://img.pokemondb.net/sprites/sword-shield/icon/treecko.png" },
  { name: "Torchic", image: "https://img.pokemondb.net/sprites/sword-shield/icon/torchic.png" },
  { name: "Mudkip", image: "https://img.pokemondb.net/sprites/sword-shield/icon/mudkip.png" },
  { name: "Lucario", image: "https://img.pokemondb.net/sprites/sword-shield/icon/lucario.png" },
  { name: "Garchomp", image: "https://img.pokemondb.net/sprites/sword-shield/icon/garchomp.png" },
  { name: "Greninja", image: "https://img.pokemondb.net/sprites/sword-shield/icon/greninja.png" },
  { name: "Decidueye", image: "https://img.pokemondb.net/sprites/sword-shield/icon/decidueye.png" },
  { name: "Incineroar", image: "https://img.pokemondb.net/sprites/sword-shield/icon/incineroar.png" },
  { name: "Primarina", image: "https://img.pokemondb.net/sprites/sword-shield/icon/primarina.png" },
  { name: "Sobble", image: "https://img.pokemondb.net/sprites/sword-shield/icon/sobble.png" },
  { name: "Grookey", image: "https://img.pokemondb.net/sprites/sword-shield/icon/grookey.png" },
  { name: "Scorbunny", image: "https://img.pokemondb.net/sprites/sword-shield/icon/scorbunny.png" },
  { name: "Corviknight", image: "https://img.pokemondb.net/sprites/sword-shield/icon/corviknight.png" },
  { name: "Dragapult", image: "https://img.pokemondb.net/sprites/sword-shield/icon/dragapult.png" },
  { name: "Zacian", image: "https://img.pokemondb.net/sprites/sword-shield/icon/zacian.png" },
  { name: "Zamazenta", image: "https://img.pokemondb.net/sprites/sword-shield/icon/zamazenta.png" }
];

const choicesContainer = document.querySelector(".choices");
const messageEl = document.getElementById("round-message");
const imageEl = document.getElementById("pokemon-image");
const scoreEl = document.getElementById("score");
const streakEl = document.getElementById("streak");
const nextButton = document.getElementById("next-button");
const restartButton = document.getElementById("restart-button");
const timerFill = document.getElementById("timer-fill");

let currentPokemon = null;
let isRoundActive = false;
let score = 0;
let streak = 0;
let timerId = null;
const ROUND_TIME = 15; // seconds

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getRandomPokemon(excludeName) {
  const pool = excludeName
    ? pokemonList.filter((poke) => poke.name !== excludeName)
    : pokemonList;
  return pool[Math.floor(Math.random() * pool.length)];
}

function updateTimer(secondsRemaining) {
  const progress = (secondsRemaining / ROUND_TIME) * 100;
  timerFill.style.width = `${progress}%`;
  timerFill.dataset.timeRemaining = secondsRemaining;
}

function startTimer() {
  let remaining = ROUND_TIME;
  updateTimer(remaining);
  clearInterval(timerId);
  timerId = setInterval(() => {
    remaining -= 1;
    updateTimer(Math.max(remaining, 0));
    if (remaining <= 0) {
      endRound(false, "Time's up!");
    }
  }, 1000);
}

function createChoiceButton(name) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = name;
  button.addEventListener("click", () => handleGuess(name));
  return button;
}

function setupRound() {
  const pokemon = getRandomPokemon();
  currentPokemon = pokemon;
  isRoundActive = true;
  messageEl.textContent = "Click a name to guess!";
  nextButton.disabled = true;

  imageEl.src = pokemon.image;
  imageEl.alt = `Sprite of ${pokemon.name}`;

  const incorrectChoices = new Set();
  while (incorrectChoices.size < 3) {
    incorrectChoices.add(getRandomPokemon(pokemon.name).name);
  }

  const options = shuffle([pokemon.name, ...incorrectChoices]);

  choicesContainer.innerHTML = "";
  options.forEach((name) => choicesContainer.appendChild(createChoiceButton(name)));

  choicesContainer.querySelectorAll("button").forEach((button) => {
    button.disabled = false;
    button.classList.remove("correct", "incorrect");
  });

  startTimer();
}

function endRound(isCorrect, message) {
  if (!isRoundActive) return;

  isRoundActive = false;
  clearInterval(timerId);
  nextButton.disabled = false;

  messageEl.textContent = message;
  choicesContainer.querySelectorAll("button").forEach((button) => {
    button.disabled = true;
    if (button.textContent === currentPokemon.name) {
      button.classList.add("correct");
    }
  });

  if (isCorrect) {
    score += 10;
    streak += 1;
  } else {
    streak = 0;
  }

  scoreEl.textContent = score.toString();
  streakEl.textContent = streak.toString();
}

function handleGuess(name) {
  if (!isRoundActive) return;
  const isCorrect = name === currentPokemon.name;
  const message = isCorrect
    ? `Correct! It's ${currentPokemon.name}!`
    : `Oops! That was ${currentPokemon.name}.`;

  if (!isCorrect) {
    choicesContainer
      .querySelectorAll("button")
      .forEach((button) => {
        if (button.textContent === name) {
          button.classList.add("incorrect");
        }
      });
  }

  endRound(isCorrect, message);
}

function nextRound() {
  setupRound();
}

function restartGame() {
  score = 0;
  streak = 0;
  scoreEl.textContent = "0";
  streakEl.textContent = "0";
  nextRound();
}

nextButton.addEventListener("click", nextRound);
restartButton.addEventListener("click", restartGame);

document.addEventListener("keydown", (event) => {
  if (!isRoundActive) return;
  const index = parseInt(event.key, 10) - 1;
  if (index >= 0 && index < choicesContainer.children.length) {
    const button = choicesContainer.children[index];
    button.click();
  }
});

restartGame();
