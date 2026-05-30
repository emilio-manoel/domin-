DOM = {
  player1: document.getElementById("player1"),
  player2: document.getElementById("player2"),
  player3: document.getElementById("player3"),
  player4: document.getElementById("player4"),
  table: document.getElementById("table"),
};

function createPartsStyle() {
  for (let i = 1; i <= 4; i++) {
    for (let e = 1; e <= 7; e++) {
      let parts = document.createElement("span");
      DOM[`player${i}`].appendChild(parts);
      parts.className = `player${i}-span`;
      parts.id = `number${e}`;
    }
  }
}

let partsPlayer = [];
function createParts() {
  for (let i = 0; i <= 6; i++) {
    for (let e = i; e <= 6; e++) {
      partsPlayer.push({
        sideA: i,
        sideB: e,
        type: i === e ? "dupla" : "comum",
      });
    }
  }
  randomPieces();
}

function randomPieces() {
  for (let i = partsPlayer.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [partsPlayer[i], partsPlayer[j]] = [partsPlayer[j], partsPlayer[i]];
  }
}

let player1Pieces = [];
let player2Pieces = [];
let player3Pieces = [];
let player4Pieces = [];
function distributePieces() {
  player1Pieces = partsPlayer.slice(0, 7);
  player2Pieces = partsPlayer.slice(7, 14);
  player3Pieces = partsPlayer.slice(14, 21);
  player4Pieces = partsPlayer.slice(21, 28);
}

function showsPiecesPlayer1() {
  for (let i = 1; i <= player1Pieces.length; i++) {
    player1view = document.querySelector(`#number${i}.player1-span`);

    let imgCreated1 = player1view.appendChild(document.createElement("img"));
    imgCreated1.className = "sideA";
    imgCreated1.src = `../src/assets/part-${player1Pieces[i - 1].sideA}.jpg`;

    let imgCreated2 = player1view.appendChild(document.createElement("img"));
    imgCreated2.className = "sideB";
    imgCreated2.src = `../src/assets/part-${player1Pieces[i - 1].sideB}.jpg`;
  }
}

function Game() {
  let round = 0;
  let player1Ready = false;
  let currentPart = null;
  let startPlayer1 = null;

  function startGame() {
    const position = Number(
      partsPlayer.findIndex((part) => part.sideA === 1 && part.sideB === 1),
    );
    if (position >= 0 && position <= 6) {
      console.log("player1 começa");
      startPlayer1 = true;
      round = 1;
    } else if (position >= 7 && position <= 13) {
      console.log("Player 2 começa");
      player2Pieces = player2Pieces.filter(
        (part) => !(part.sideA === 1 && part.sideB === 1),
      );
      round = 2;
    } else if (position >= 14 && position <= 20) {
      console.log("Player 3 começa");
      player3Pieces = player3Pieces.filter(
        (part) => !(part.sideA === 1 && part.sideB === 1),
      );
      round = 3;
    } else if (position >= 21 && position <= 27) {
      console.log("Player 4 começa");
      player4Pieces = player4Pieces.filter(
        (part) => !(part.sideA === 1 && part.sideB === 1),
      );
      round = 4;
    }
    whoplayed();
    console.log(position);
  }

  function turnPlayer1() {
    if (player1Ready) return;
    player1Ready = true;

    const spans = document.querySelectorAll(".player1-span");

    if (startPlayer1) {
      spans.forEach((span) => {
        const sideA = Number(span.querySelector(".sideA").src.slice(-5, -4));
        const sideB = Number(span.querySelector(".sideB").src.slice(-5, -4));
        if (sideA === 1 && sideB === 1) {
          span.classList.add("start-player1");
        }
      });
    }

    spans.forEach((span) => {
      span.addEventListener("click", () => {
        if (round !== 1) return;

        if (startPlayer1 && !span.classList.contains("start-player1")) return;

        span.style.visibility = "hidden";
        span.classList.remove("start-player1");

        player1Pieces.forEach((part) => {
          if (
            part.sideA ===
              Number(span.querySelector(".sideA").src.slice(-5, -4)) &&
            part.sideB ===
              Number(span.querySelector(".sideB").src.slice(-5, -4))
          ) {
            currentPart = player1Pieces.find((p) => p === part);
            console.log(currentPart);

            player1Pieces = player1Pieces.filter((p) => p !== part);
            console.log(player1Pieces);

            DOM.player1.className = "";
            startPlayer1 = false;
            round = 2;
            whoplayed();
          }
        });
      });
    });
  }

  function restPlayersTurn(player) {
    DOM[`player${player}`].className = "turn-player";

    setTimeout(() => {
      console.log(`Player ${player} jogou (bot)`);
      const span = document.querySelector(`.player${player}-span`).remove();
      whoplayed();

      DOM[`player${player}`].className = "";
    }, 3000);
  }

  function whoplayed() {
    const vencedor = [
      player1Pieces,
      player2Pieces,
      player3Pieces,
      player4Pieces,
    ].findIndex((p) => p.length === 0);

    if (vencedor !== -1) {
      window.alert(`Player ${vencedor + 1} venceu!`);
      return;
    }

    if (round === 1) {
      turnPlayer1();
      DOM.player1.className = "turn-player";
    } else if (round === 2) {
      restPlayersTurn(2);
      round = 3;
    } else if (round === 3) {
      restPlayersTurn(3);
      round = 4;
    } else if (round === 4) {
      restPlayersTurn(4);
      round = 1;
    }
  }

  startGame();
}

function execute() {
  createPartsStyle();
  createParts();
  distributePieces();
  showsPiecesPlayer1();
  Game();
}

execute();

console.log(player1Pieces);
console.log(player2Pieces);
console.log(player3Pieces);
console.log(player4Pieces);
console.log(partsPlayer);
