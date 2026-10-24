const gameData = [
  {
    category: "Around the World",
    clues: [
      { value: 200, clue: "This European capital is home to the Eiffel Tower.", response: "What is Paris?" },
      { value: 400, clue: "The Great Pyramid of Giza stands in this modern-day country.", response: "What is Egypt?" },
      { value: 600, clue: "The ancient city of Petra, famous for buildings carved into rose-colored rock, is in this country.", response: "What is Jordan?" },
      { value: 800, clue: "The Atacama, one of the driest places on Earth, lies mainly in this South American country.", response: "What is Chile?" },
      { value: 1000, clue: "This country is made up of more than 17,000 islands and includes Java and Sumatra.", response: "What is Indonesia?" },
    ],
  },
  {
    category: "Everyday Science",
    clues: [
      { value: 200, clue: "At sea level, water freezes at this temperature on the Celsius scale.", response: "What is zero degrees?" },
      { value: 400, clue: "This force keeps your feet on the ground and the Moon in orbit around Earth.", response: "What is gravity?" },
      { value: 600, clue: "Plants use sunlight to turn water and carbon dioxide into sugars in this process.", response: "What is photosynthesis?" },
      { value: 800, clue: "This is the name for the path light takes when it bends as it enters water or glass.", response: "What is refraction?" },
      { value: 1000, clue: "Measured in ohms, this property describes how strongly a material resists electric current.", response: "What is electrical resistance?" },
    ],
  },
  {
    category: "Words & Phrases",
    clues: [
      { value: 200, clue: "A word that means the opposite of its own meaning, like 'cleave,' is this kind of word.", response: "What is a contronym?" },
      { value: 400, clue: "This punctuation mark joins two independent clauses when a comma alone is not enough.", response: "What is a semicolon?" },
      { value: 600, clue: "A phrase such as 'the classroom was a zoo' is this figure of speech.", response: "What is a metaphor?" },
      { value: 800, clue: "This word for a word that imitates a sound includes examples like 'buzz' and 'splash.'", response: "What is onomatopoeia?" },
      { value: 1000, clue: "A word formed from the initial letters of a phrase and pronounced as a word, like NASA, is this.", response: "What is an acronym?" },
    ],
  },
  {
    category: "History",
    clues: [
      { value: 200, clue: "This 1776 document announced that thirteen American colonies were separating from Britain.", response: "What is the Declaration of Independence?" },
      { value: 400, clue: "This ancient Roman city was buried when Mount Vesuvius erupted in AD 79.", response: "What is Pompeii?" },
      { value: 600, clue: "The first woman to fly solo across the Atlantic did so in 1932; her name was this.", response: "Who is Amelia Earhart?" },
      { value: 800, clue: "This trade route linked China with the Mediterranean world, carrying silk and other goods.", response: "What is the Silk Road?" },
      { value: 1000, clue: "This 1648 series of treaties helped end the Thirty Years' War in Europe.", response: "What is the Peace of Westphalia?" },
    ],
  },
  {
    category: "Nature",
    clues: [
      { value: 200, clue: "This is the largest mammal on Earth.", response: "What is the blue whale?" },
      { value: 400, clue: "A caterpillar changes into this winged insect during its life cycle.", response: "What is a butterfly?" },
      { value: 600, clue: "This is the name for animals that are most active at dawn and dusk, such as many deer.", response: "What are crepuscular animals?" },
      { value: 800, clue: "Unlike most mammals, this egg-laying Australian animal has a bill and webbed feet.", response: "What is a platypus?" },
      { value: 1000, clue: "This biome, found around the equator, has the greatest variety of terrestrial species.", response: "What is a tropical rainforest?" },
    ],
  },
  {
    category: "Arts & Entertainment",
    clues: [
      { value: 200, clue: "This Dutch painter created 'The Starry Night.'", response: "Who is Vincent van Gogh?" },
      { value: 400, clue: "In Shakespeare's play, this Danish prince says, 'To be, or not to be.'", response: "Who is Hamlet?" },
      { value: 600, clue: "This composer wrote the ballet 'The Nutcracker.'", response: "Who is Pyotr Ilyich Tchaikovsky?" },
      { value: 800, clue: "This 1927 film by Fritz Lang imagines a futuristic city divided by class.", response: "What is Metropolis?" },
      { value: 1000, clue: "This Japanese filmmaker directed 'Seven Samurai' and 'Rashomon.'", response: "Who is Akira Kurosawa?" },
    ],
  },
];

let players = [];
let scores = [];
let selectedPlayerCount = 2;
const usedClues = new Set();
const clueLimit = 20;
const scoreStrip = document.querySelector("#score-strip");
const stage = document.querySelector("#game-stage");
const newGameButton = document.querySelector("#new-game");
const soundToggle = document.querySelector("#sound-toggle");
const tickingAudio = document.querySelector("#ticking-audio");

let activeClue = null;
let answerRevealed = false;
let scoredFor = null;
let correctPlayer = null;
let boardChooser = 0;
let buzzersOpen = false;
let buzzedPlayer = null;
const lockedOutPlayers = new Set();
let previousTile = null;
let soundEnabled = true;

tickingAudio.volume = 0.22;

function startClueAudio() {
  if (!soundEnabled) return;
  tickingAudio.currentTime = 0;
  tickingAudio.play().catch(() => {});
}

function stopClueAudio() {
  tickingAudio.pause();
  tickingAudio.currentTime = 0;
}

function updateSoundToggle() {
  soundToggle.setAttribute("aria-pressed", String(soundEnabled));
  soundToggle.textContent = soundEnabled ? "♫ Sound on" : "♫ Sound off";
  soundToggle.title = soundEnabled ? "Turn clue sound off" : "Turn clue sound on";
}

const money = (amount) => `$${amount.toLocaleString("en-US")}`;

function renderScores() {
  scoreStrip.style.display = "grid";
  scoreStrip.style.gridTemplateColumns = `repeat(${players.length}, minmax(0, 1fr))`;
  scoreStrip.innerHTML = players.map((player, index) => `
    <div class="score-card">
      <div class="score-person">
        <span class="score-name">${player}</span>
        <strong class="score-value">${money(scores[index])}</strong>
      </div>
    </div>
  `).join("");
}

function renderSetup() {
  stopClueAudio();
  activeClue = null;
  answerRevealed = false;
  scoredFor = null;
  correctPlayer = null;
  buzzersOpen = false;
  buzzedPlayer = null;
  lockedOutPlayers.clear();
  scoreStrip.innerHTML = "";
  scoreStrip.style.display = "none";
  newGameButton.hidden = true;

  stage.innerHTML = `
    <section class="setup-screen" aria-labelledby="setup-title">
      <div class="setup-card">
        <p class="setup-kicker">ROUND ONE</p>
        <h1 id="setup-title">How many players are playing?</h1>
        <p class="setup-copy">Choose between two and four players. The game ends after 20 clues.</p>
        <div class="player-count-options" role="group" aria-label="Number of players">
          ${[2, 3, 4].map((count) => `
            <button class="player-count-option${count === selectedPlayerCount ? " selected" : ""}" type="button" data-player-count="${count}" aria-pressed="${count === selectedPlayerCount}">
              <strong>${count}</strong>
              <span>${count === 1 ? "player" : "players"}</span>
            </button>
          `).join("")}
        </div>
        <button class="primary-action start-round" type="button">Start Round</button>
      </div>
    </section>
  `;

  stage.querySelectorAll(".player-count-option").forEach((button) => {
    button.addEventListener("click", () => {
      selectedPlayerCount = Number(button.dataset.playerCount);
      stage.querySelectorAll(".player-count-option").forEach((option) => {
        const isSelected = option === button;
        option.classList.toggle("selected", isSelected);
        option.setAttribute("aria-pressed", String(isSelected));
      });
    });
  });

  stage.querySelector(".start-round").addEventListener("click", () => {
    players = Array.from({ length: selectedPlayerCount }, (_, index) => `Player ${index + 1}`);
    scores = Array(players.length).fill(0);
    usedClues.clear();
    boardChooser = 0;
    newGameButton.hidden = false;
    renderBoard();
  });
}

function renderBoard() {
  newGameButton.hidden = false;
  stopClueAudio();
  activeClue = null;
  answerRevealed = false;
  scoredFor = null;
  renderScores();

  if (usedClues.size >= clueLimit) {
    renderFinalScores();
    return;
  }

  stage.innerHTML = `
    <div class="stage-heading">
      <h1>${players[boardChooser].toUpperCase()}, CHOOSE A CLUE</h1>
      <p>${clueLimit - usedClues.size} clues until final scores</p>
    </div>
    <section class="board" aria-label="Round one clue board">
      ${gameData.map((column, categoryIndex) => `
        <div class="category-column">
          <div class="category-title">${column.category}</div>
          ${column.clues.map((clue, clueIndex) => {
            const id = `${categoryIndex}-${clueIndex}`;
            const isUsed = usedClues.has(id);
            return `<button class="clue-tile${isUsed ? " used" : ""}" type="button" data-clue="${id}" ${isUsed ? "disabled aria-label=\"Used clue\"" : `aria-label="${column.category}, ${money(clue.value)}"`}>
              ${isUsed ? "✓" : money(clue.value)}
            </button>`;
          }).join("")}
        </div>
      `).join("")}
    </section>
  `;

  stage.querySelectorAll(".clue-tile:not(.used)").forEach((tile) => {
    tile.addEventListener("click", () => {
      previousTile = tile;
      const [categoryIndex, clueIndex] = tile.dataset.clue.split("-").map(Number);
      activeClue = {
        ...gameData[categoryIndex].clues[clueIndex],
        category: gameData[categoryIndex].category,
        id: tile.dataset.clue,
      };
      scoredFor = null;
      correctPlayer = null;
      buzzersOpen = false;
      buzzedPlayer = null;
      lockedOutPlayers.clear();
      startClueAudio();
      renderClue();
    });
  });
}

function renderFinalScores() {
  const highestScore = Math.max(...scores);
  const winners = players.filter((_, index) => scores[index] === highestScore);
  const standings = players
    .map((player, index) => ({ player, score: scores[index] }))
    .sort((a, b) => b.score - a.score);

  stage.innerHTML = `
    <section class="final-screen" aria-labelledby="final-title">
      <div class="final-card">
        <p class="setup-kicker">${usedClues.size} CLUES PLAYED</p>
        <h1 id="final-title">Game complete</h1>
        <p class="final-winner">${winners.length === 1 ? `${winners[0]} wins` : `${winners.join(" and ")} tie for the win`}</p>
        <ol class="final-standings" aria-label="Final scores">
          ${standings.map(({ player, score }, index) => `
            <li><span><span class="final-rank">${index + 1}</span>${player}</span><strong>${money(score)}</strong></li>
          `).join("")}
        </ol>
      </div>
    </section>
  `;
}

function renderClue() {
  renderScores();
  const availablePlayers = players
    .map((player, index) => ({ player, index }))
    .filter(({ index }) => !lockedOutPlayers.has(index));
  const buzzerControls = !answerRevealed
    ? buzzedPlayer !== null
      ? `
        <p class="buzzer-status">${players[buzzedPlayer]} buzzed in. Did they get it?</p>
        <div class="host-rulings">
          <button class="ruling-button correct-response" type="button">Correct</button>
          <button class="ruling-button incorrect-response" type="button">Incorrect</button>
        </div>
      `
      : !buzzersOpen
        ? `
          <p class="buzzer-status">Read the clue aloud, then open the buzzers.</p>
          <button class="ruling-button open-buzzers" type="button">Open Buzzers</button>
        `
        : `
          <p class="buzzer-status">Buzzers are open${lockedOutPlayers.size ? ". Players who already missed this clue are locked out." : "."}</p>
          ${availablePlayers.length ? `
            <div class="player-buzzers">
              ${availablePlayers.map(({ player, index }) => `<button class="buzzer-button" type="button" data-buzzer-player="${index}">Buzz in · ${player}</button>`).join("")}
            </div>
          ` : `<p class="buzzer-status">No players left to try.</p>`}
          <button class="reveal-answer-button" type="button">No correct response · Show Answer</button>
        `
    : "";

  stage.innerHTML = `
    <section class="clue-screen" aria-label="Selected clue">
      <div class="clue-panel">
        <button class="close-clue" type="button" aria-label="Close clue and return to board">×</button>
        <p class="clue-meta">${activeClue.category} <span aria-hidden="true">·</span> ${money(activeClue.value)}</p>
        <p class="clue-text">${activeClue.clue}</p>
        <p class="answer-text" ${answerRevealed ? "" : "hidden"}>${activeClue.response}</p>
        ${!answerRevealed ? `<section class="buzzer-controls" aria-live="polite">${buzzerControls}</section>` : `
          <section class="score-decision" aria-live="polite">
            ${correctPlayer !== null ? scoredFor === null ? `
              <p class="score-question">Award the points?</p>
              <div class="score-awards">
                <button class="score-award" type="button">Award ${money(activeClue.value)} to ${players[correctPlayer]}</button>
              </div>
            ` : `<p class="score-confirmation">${players[scoredFor]} earned ${money(activeClue.value)}.</p>` : `<p class="score-help">No points awarded for this clue.</p>`}
          </section>
        `}
        ${answerRevealed ? `<button class="primary-action" type="button">Continue</button>` : ""}
      </div>
    </section>
  `;

  stage.querySelector(".close-clue").addEventListener("click", closeClue);
  stage.querySelector(".open-buzzers")?.addEventListener("click", () => {
    buzzersOpen = true;
    stage.querySelectorAll(".buzzer-button").forEach((button) => { button.disabled = false; });
    renderClue();
    stage.querySelector(".buzzer-button")?.focus();
  });
  stage.querySelectorAll(".buzzer-button").forEach((button) => {
    button.addEventListener("click", () => {
      if (!buzzersOpen || buzzedPlayer !== null) return;
      buzzedPlayer = Number(button.dataset.buzzerPlayer);
      renderClue();
      stage.querySelector(".correct-response").focus();
    });
  });
  stage.querySelector(".correct-response")?.addEventListener("click", () => {
    if (buzzedPlayer === null) return;
    correctPlayer = buzzedPlayer;
    boardChooser = correctPlayer;
    usedClues.add(activeClue.id);
    answerRevealed = true;
    buzzedPlayer = null;
    stopClueAudio();
    renderClue();
    stage.querySelector(".score-award")?.focus();
  });
  stage.querySelector(".incorrect-response")?.addEventListener("click", () => {
    if (buzzedPlayer === null) return;
    lockedOutPlayers.add(buzzedPlayer);
    buzzedPlayer = null;
    renderClue();
    stage.querySelector(".buzzer-button")?.focus();
  });
  stage.querySelector(".reveal-answer-button")?.addEventListener("click", () => {
    answerRevealed = true;
    usedClues.add(activeClue.id);
    stopClueAudio();
    renderClue();
    stage.querySelector(".primary-action").focus();
  });
  stage.querySelector(".score-award")?.addEventListener("click", () => {
    if (scoredFor !== null || correctPlayer === null) return;
    scoredFor = correctPlayer;
    scores[scoredFor] += activeClue.value;
    renderScores();
    renderClue();
    stage.querySelector(".primary-action").focus();
  });
  stage.querySelector(".primary-action")?.addEventListener("click", () => {
    usedClues.add(activeClue.id);
    renderBoard();
    if (usedClues.size < clueLimit) previousTile?.focus();
  });
}

function closeClue() {
  stopClueAudio();
  if (correctPlayer !== null || answerRevealed) usedClues.add(activeClue.id);
  renderBoard();
  previousTile?.focus();
}

soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  updateSoundToggle();
  if (activeClue && !answerRevealed && soundEnabled) startClueAudio();
  else stopClueAudio();
});

newGameButton.addEventListener("click", () => {
  if (!window.confirm("Start a new round? Scores and used clues will reset.")) return;
  selectedPlayerCount = players.length || selectedPlayerCount;
  renderSetup();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && activeClue) closeClue();
});

renderSetup();
updateSoundToggle();
