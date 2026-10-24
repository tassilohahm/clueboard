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

const players = ["Team 1", "Team 2", "Team 3"];
const scores = [0, 0, 0];
const usedClues = new Set();
const scoreStrip = document.querySelector("#score-strip");
const stage = document.querySelector("#game-stage");
const newGameButton = document.querySelector("#new-game");
const soundToggle = document.querySelector("#sound-toggle");
const thinkingAudio = document.querySelector("#thinking-audio");

let activeClue = null;
let answerRevealed = false;
let scoredFor = null;
let previousTile = null;
let soundEnabled = true;

thinkingAudio.volume = 0.22;

function playThinkingSound() {
  if (!soundEnabled) return;
  thinkingAudio.currentTime = 0;
  thinkingAudio.play().catch(() => {});
}

function stopThinkingSound() {
  thinkingAudio.pause();
  thinkingAudio.currentTime = 0;
}

function updateSoundToggle() {
  soundToggle.setAttribute("aria-pressed", String(soundEnabled));
  soundToggle.textContent = soundEnabled ? "♫ Sound on" : "♫ Sound off";
  soundToggle.title = soundEnabled ? "Turn clue sound off" : "Turn clue sound on";
}

const money = (amount) => `$${amount.toLocaleString("en-US")}`;

function renderScores() {
  scoreStrip.innerHTML = players.map((player, index) => `
    <div class="score-card">
      <div class="score-person">
        <span class="score-name">${player}</span>
        <strong class="score-value">${money(scores[index])}</strong>
      </div>
    </div>
  `).join("");
}

function renderBoard() {
  stopThinkingSound();
  activeClue = null;
  answerRevealed = false;
  scoredFor = null;
  renderScores();

  const allPlayed = usedClues.size === gameData.length * 5;
  const leaders = scores
    .map((score, index) => ({ score, player: players[index] }))
    .filter((entry) => entry.score === Math.max(...scores))
    .map((entry) => entry.player);
  const completion = allPlayed
    ? `<div class="completion-banner" role="status">Round complete · ${leaders.join(" and ")} ${leaders.length === 1 ? "leads" : "are tied"} at ${money(Math.max(...scores))}</div>`
    : "";

  stage.innerHTML = `
    <div class="stage-heading">
      <h1>PICK A CATEGORY AND VALUE</h1>
      <p>${30 - usedClues.size} clues remaining</p>
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
    ${completion}
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
      playThinkingSound();
      renderClue();
    });
  });
}

function renderClue() {
  renderScores();
  stage.innerHTML = `
    <section class="clue-screen" aria-label="Selected clue">
      <div class="clue-panel">
        <button class="close-clue" type="button" aria-label="Close clue and return to board">×</button>
        <p class="clue-meta">${activeClue.category} <span aria-hidden="true">·</span> ${money(activeClue.value)}</p>
        <p class="clue-text">${activeClue.clue}</p>
        <p class="answer-text" ${answerRevealed ? "" : "hidden"}>${activeClue.response}</p>
        ${answerRevealed ? `
          <section class="score-decision" aria-live="polite">
            ${scoredFor === null ? `
              <p class="score-question">Who got it?</p>
              <div class="score-awards">
                ${players.map((player, index) => `<button class="score-award" type="button" data-player="${index}">Award ${money(activeClue.value)} to ${player}</button>`).join("")}
              </div>
              <p class="score-help">If no one got it, continue without awarding points.</p>
            ` : `<p class="score-confirmation">${players[scoredFor]} earned ${money(activeClue.value)}.</p>`}
          </section>
        ` : ""}
        <button class="primary-action" type="button">${answerRevealed ? "Continue" : "Show Answer"}</button>
      </div>
    </section>
  `;

  stage.querySelector(".close-clue").addEventListener("click", closeClue);
  stage.querySelectorAll(".score-award").forEach((button) => {
    button.addEventListener("click", () => {
      if (scoredFor !== null) return;
      scoredFor = Number(button.dataset.player);
      scores[scoredFor] += activeClue.value;
      usedClues.add(activeClue.id);
      renderScores();
      renderClue();
      stage.querySelector(".primary-action").focus();
    });
  });
  stage.querySelector(".primary-action").addEventListener("click", () => {
    if (!answerRevealed) {
      stopThinkingSound();
      answerRevealed = true;
      renderClue();
      stage.querySelector(".primary-action").focus();
      return;
    }
    usedClues.add(activeClue.id);
    renderBoard();
    previousTile?.focus();
  });
}

function closeClue() {
  stopThinkingSound();
  if (scoredFor !== null) usedClues.add(activeClue.id);
  renderBoard();
  previousTile?.focus();
}

soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  updateSoundToggle();
  if (activeClue && !answerRevealed && soundEnabled) playThinkingSound();
  else stopThinkingSound();
});

newGameButton.addEventListener("click", () => {
  if (!window.confirm("Start a new round? Scores and used clues will reset.")) return;
  scores.fill(0);
  usedClues.clear();
  renderBoard();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && activeClue) closeClue();
});

renderBoard();
updateSoundToggle();
