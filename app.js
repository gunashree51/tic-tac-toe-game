let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset");

let playerXInput = document.querySelector("#playerX");
let playerOInput = document.querySelector("#playerO");

let turnText = document.querySelector("#turnText");

let winnerCard = document.querySelector("#winnerCard");
let winnerText = document.querySelector("#winnerText");
let newGameBtn = document.querySelector("#newGame");

let scoreX = document.querySelector("#scoreX");
let scoreO = document.querySelector("#scoreO");

let startBtn = document.querySelector("#startGame");

let modeAI = document.querySelector("#modeAI");
let mode2P = document.querySelector("#mode2P");

let playerInputsDiv = document.querySelector("#playerInputs");
let modeSelectDiv = document.querySelector("#modeSelect");

let xScore = 0;
let oScore = 0;

let turno = true;
let gameStarted = false;
let isAI = false;

const winPatterns = [
[0,1,2],[0,3,6],[0,4,8],
[1,4,7],[2,5,8],[2,4,6],
[3,4,5],[6,7,8]
];

/* ================= MODE SELECTION ================= */

modeAI.addEventListener("click", () => {
isAI = true;

/* show inputs */
playerInputsDiv.classList.remove("hide");

/* hide player O */
playerOInput.style.display = "none";

/* rename placeholder */
playerXInput.placeholder = "Your Name";

/* hide mode buttons */
modeSelectDiv.classList.add("hide");
});

mode2P.addEventListener("click", () => {
isAI = false;

playerInputsDiv.classList.remove("hide");

/* show both */
playerOInput.style.display = "block";

playerXInput.placeholder = "Player X Name";
playerOInput.placeholder = "Player O Name";

modeSelectDiv.classList.add("hide");
});

/* ================= START GAME ================= */

startBtn.addEventListener("click", () => {
gameStarted = true;
turno = true;

/* clear board */
boxes.forEach(box => {
box.innerText = "";
box.disabled = false;
box.classList.remove("x","o");
box.style.background = "";
});

/* set turn */
turnText.innerText = playerXInput.value || "Player X";

/* set scores */
scoreX.innerText = `${playerXInput.value || "Player X"} : ${xScore}`;
if (isAI) {
scoreO.innerText = `AI : ${oScore}`;
} else {
scoreO.innerText = `${playerOInput.value || "Player O"} : ${oScore}`;
}
});

/* ================= CLICK ================= */

boxes.forEach(box => {
box.addEventListener("click", () => {
if (!gameStarted) return;
if (box.innerText !== "") return;

/* PLAYER X */
if (turno) {
box.innerText = "X";
box.classList.add("x");
turno = false;
checkWinner();

/* AI MODE */
if (isAI) {
turnText.innerText = "AI Thinking...";
setTimeout(aiMove, 500);
}
/* 2 PLAYER MODE */
else {
turnText.innerText = playerOInput.value || "Player O";
}
}

/* PLAYER O (only in 2-player) */
else if (!isAI) {
box.innerText = "O";
box.classList.add("o");
turno = true;
turnText.innerText = playerXInput.value || "Player X";
checkWinner();
}
});
});

/* ================= AI MOVE ================= */

function aiMove() {
if (winnerCard.classList.contains("show")) return;
let emptyBoxes = [];
boxes.forEach((box, index) => {
if (box.innerText === "") {
emptyBoxes.push(index);
}
});

if (emptyBoxes.length === 0) return;
let randomIndex = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
let box = boxes[randomIndex];
box.innerText = "O";
box.classList.add("o");
turno = true;
turnText.innerText = playerXInput.value || "Player X";
checkWinner();
}

/* ================= CHECK WINNER ================= */

function checkWinner() {
for (let pattern of winPatterns) {
let pos1 = boxes[pattern[0]].innerText;
let pos2 = boxes[pattern[1]].innerText;
let pos3 = boxes[pattern[2]].innerText;
if (pos1 && pos2 && pos3 && pos1 === pos2 && pos2 === pos3) {
let winnerName;
if (pos1 === "X") {
winnerName = playerXInput.value || "Player X";
xScore++;
scoreX.innerText = `${playerXInput.value || "Player X"} : ${xScore}`;
} else {
winnerName = isAI ? "AI" : (playerOInput.value || "Player O");
oScore++;
scoreO.innerText = isAI 
? `AI : ${oScore}` 
: `${playerOInput.value || "Player O"} : ${oScore}`;
}

/* highlight */
pattern.forEach(i => {
boxes[i].style.background = "#fff3b0";
});
winnerText.innerHTML = `
<div class="line1">🔥 Nice Game</div>
<div class="line2">${winnerName} Wins!</div>
`;
winnerCard.classList.remove("hide");
winnerCard.classList.add("show");
winnerCard.classList.remove("draw");
createBlast();
launchFireworks();
return;
}
}

/* DRAW */
let isDraw = true;
boxes.forEach(box => {
if (box.innerText === "") isDraw = false;
});

if (isDraw) {
winnerText.innerHTML = `
<div class="draw-title">🤝 It's a Draw!</div>
<div class="draw-sub">Good match! Try again 😄</div> `;
winnerCard.classList.remove("hide");
winnerCard.classList.add("show");
winnerCard.classList.add("draw");
return;
}
}

/* ================= RESET ================= */

function resetGame() {
boxes.forEach(box => {
box.innerText = "";
box.classList.remove("x","o");
box.style.background = "";
});
turno = true;
gameStarted = true;
winnerCard.classList.remove("show");
winnerCard.classList.add("hide");
turnText.innerText = playerXInput.value || "Player X";
}
resetBtn.addEventListener("click", resetGame);
newGameBtn.addEventListener("click", resetGame);

/* ================= ANIMATIONS ================= */

function createBlast() {
let blast = document.getElementById("blast");
for (let i = 0; i < 120; i++) {
let particle = document.createElement("div");
particle.classList.add("particle");
particle.style.left = "50%";
particle.style.top = "50%";
let x = (Math.random() - 0.5) * window.innerWidth + "px";
let y = (Math.random() - 0.5) * window.innerHeight + "px";
particle.style.setProperty("--x", x);
particle.style.setProperty("--y", y);
let colors = ["#ff4d6d","#f9c74f","#90dbf4","#c77dff","#00f5d4","#ffffff"];
particle.style.background = colors[Math.floor(Math.random() * colors.length)];
particle.style.animationDuration = (Math.random()*0.5 + 0.8) + "s";
blast.appendChild(particle);

setTimeout(() => {
particle.remove();
}, 1200);
}
}

function launchFireworks() {
for (let i = 0; i < 120; i++) {
let fw = document.createElement("div");
fw.classList.add("firework");

let x = (Math.random() - 0.5) * window.innerWidth + "px";
let y = (Math.random() - 0.5) * window.innerHeight + "px";

fw.style.setProperty("--x", x);
fw.style.setProperty("--y", y);
let colors = ["#ff4d6d","#f9c74f","#90dbf4","#c77dff","#00f5d4","#ffffff"];
fw.style.background = colors[Math.floor(Math.random()*colors.length)];
fw.style.animationDuration = (Math.random()*0.5 + 0.6) + "s";
document.body.appendChild(fw);
setTimeout(() => {
fw.remove();
}, 1000);
}
}