const DOM = {
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
      parts.id = `player${i}-number${e}`;
      parts.dataset.player = i;
      parts.dataset.index = e;
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
  console.log(partsPlayer);
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

function getPlayerPieces(player) {
  if (player === 1) return player1Pieces;
  if (player === 2) return player2Pieces;
  if (player === 3) return player3Pieces;
  if (player === 4) return player4Pieces;
  return [];
}

function setPlayerPieces(player, pieces) {
  if (player === 1) player1Pieces = pieces;
  else if (player === 2) player2Pieces = pieces;
  else if (player === 3) player3Pieces = pieces;
  else if (player === 4) player4Pieces = pieces;
}

function showsPiecesPlayer1() {
  for (let i = 1; i <= player1Pieces.length; i++) {
    const player1view = document.querySelector(
      `[data-player="1"][data-index="${i}"]`,
    );
    if (!player1view) continue;

    const piece = player1Pieces[i - 1];
    player1view.piece = piece;

    const imgCreated1 = player1view.appendChild(document.createElement("img"));
    imgCreated1.className = "sideA";
    imgCreated1.src = `src/assets/part-${piece.sideA}.jpg`;
    imgCreated1.alt = `Peça lado A ${piece.sideA}`;

    const imgCreated2 = player1view.appendChild(document.createElement("img"));
    imgCreated2.className = "sideB";
    imgCreated2.src = `src/assets/part-${piece.sideB}.jpg`;
    imgCreated2.alt = `Peça lado B ${piece.sideB}`;
  }
}

function createTablePieceImage(value, className) {
  const img = document.createElement("img");
  img.className = className;
  img.src = `src/assets/part-${value}.jpg`;
  img.alt = `lado ${value}`;
  return img;
}

function placePieceOnTable(piece, player, side = "right", currentEnds = null) {
  if (!piece) return;
  const pieceElement = document.createElement("div");
  pieceElement.className = "table-piece";
  if (player) pieceElement.dataset.player = player;

  const leftValue = (() => {
    if (!currentEnds || side === "center") return piece.sideA;
    if (side === "left") {
      return piece.sideA === currentEnds.left ? piece.sideB : piece.sideA;
    }
    return piece.sideA === currentEnds.right ? piece.sideA : piece.sideB;
  })();

  const rightValue = (() => {
    if (!currentEnds || side === "center") return piece.sideB;
    if (side === "left") {
      return piece.sideA === currentEnds.left ? piece.sideA : piece.sideB;
    }
    return piece.sideA === currentEnds.right ? piece.sideB : piece.sideA;
  })();

  pieceElement.appendChild(createTablePieceImage(leftValue, "sideA"));
  pieceElement.appendChild(createTablePieceImage(rightValue, "sideB"));

  if (side === "left") {
    DOM.table.insertBefore(pieceElement, DOM.table.firstChild);
  } else {
    DOM.table.appendChild(pieceElement);
  }
}

function Game() {
  let round = 0;
  let currentEnds = null;
  let currentPart = null;
  let startPlayer1 = null;

  function partMatchesCurrent(part) {
    if (!currentEnds) return false;
    return (
      part.sideA === currentEnds.left ||
      part.sideB === currentEnds.left ||
      part.sideA === currentEnds.right ||
      part.sideB === currentEnds.right
    );
  }

  function updateCurrentEnds(piece, side) {
    if (!currentEnds) return;
    if (side === "left") {
      currentEnds.left =
        piece.sideA === currentEnds.left ? piece.sideB : piece.sideA;
      return;
    }
    if (side === "right") {
      currentEnds.right =
        piece.sideA === currentEnds.right ? piece.sideB : piece.sideA;
      return;
    }
  }

  function getPlacementSide(piece) {
    const matchesLeft =
      piece.sideA === currentEnds.left || piece.sideB === currentEnds.left;
    const matchesRight =
      piece.sideA === currentEnds.right || piece.sideB === currentEnds.right;

    if (matchesLeft && !matchesRight) return "left";
    if (matchesRight && !matchesLeft) return "right";
    if (matchesLeft && matchesRight) {
      return currentEnds.left === currentEnds.right ? "right" : "left";
    }
    return null;
  }

  let sideChoiceElement = null;

  function clearPlayer1Highlights() {
    document.querySelectorAll(".player1-span").forEach((span) => {
      span.classList.remove("playable-piece", "start-player1");
    });
  }

  function clearSideChoice() {
    if (sideChoiceElement) {
      sideChoiceElement.remove();
      sideChoiceElement = null;
    }
  }

  function getPlayableSides(piece) {
    if (startPlayer1) {
      return piece.sideA === 1 && piece.sideB === 1 ? ["center"] : [];
    }
    const sides = [];
    if (piece.sideA === currentEnds.left || piece.sideB === currentEnds.left) {
      sides.push("left");
    }
    if (piece.sideA === currentEnds.right || piece.sideB === currentEnds.right) {
      sides.push("right");
    }
    return sides;
  }

  function playPlayer1Piece(piece, side, span) {
    DOM.player1.classList.remove("turn-player");
    currentPart = piece;
    player1Pieces = player1Pieces.filter((p) => p !== piece);
    placePieceOnTable(currentPart, 1, side, currentEnds);
    if (side !== "center") updateCurrentEnds(piece, side);
    span.style.visibility = "hidden";
    span.classList.remove("playable-piece", "start-player1");
    startPlayer1 = false;
    clearSideChoice();
    round = 2;
    whoplayed();
  }

  function showSideChoice(piece, span) {
    clearSideChoice();
    const choices = getPlayableSides(piece);
    if (choices.length === 0) return;
    if (choices.length === 1) {
      playPlayer1Piece(piece, choices[0], span);
      return;
    }

    sideChoiceElement = document.createElement("div");
    sideChoiceElement.className = "side-choice";
    const title = document.createElement("div");
    title.className = "side-choice-title";
    title.textContent = "Escolha o lado";
    sideChoiceElement.appendChild(title);

    choices.forEach((side) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = side === "left" ? "Jogar à esquerda" : "Jogar à direita";
      button.addEventListener("click", () => playPlayer1Piece(piece, side, span));
      sideChoiceElement.appendChild(button);
    });

    document.body.appendChild(sideChoiceElement);
  }

  function setupPlayer1Clicks() {
    const spans = document.querySelectorAll(".player1-span");
    spans.forEach((span) => {
      if (span.dataset.player1Click === "true") return;
      span.dataset.player1Click = "true";

      span.addEventListener("click", () => {
        if (round !== 1) return;
        if (!span.classList.contains("playable-piece")) return;
        const piece = span.piece;
        if (!piece) return;

        const sides = getPlayableSides(piece);
        if (sides.includes("center")) {
          playPlayer1Piece(piece, "center", span);
          return;
        }

        showSideChoice(piece, span);
      });
    });
  }

  function startGame() {
    const playerWithStartPiece = [1, 2, 3, 4].find((player) =>
      getPlayerPieces(player).some(
        (part) => part.sideA === 1 && part.sideB === 1,
      ),
    );

    if (!playerWithStartPiece) {
      console.error("Peça inicial 1/1 não encontrada em nenhum jogador.");
      return;
    }

    if (playerWithStartPiece === 1) {
      startPlayer1 = true;
      currentEnds = { left: 1, right: 1 };
      currentPart = { sideA: 1, sideB: 1 };
      round = 1;
    } else {
      startPlayer1 = false;
      currentEnds = { left: 1, right: 1 };
      currentPart = getPlayerPieces(playerWithStartPiece).find(
        (part) => part.sideA === 1 && part.sideB === 1,
      );
      setPlayerPieces(
        playerWithStartPiece,
        getPlayerPieces(playerWithStartPiece).filter(
          (part) => !(part.sideA === 1 && part.sideB === 1),
        ),
      );
      placePieceOnTable(currentPart, playerWithStartPiece, "right", currentEnds);

      if (playerWithStartPiece === 2) round = 3;
      else if (playerWithStartPiece === 3) round = 4;
      else round = 1;
    }

    setupPlayer1Clicks();
    whoplayed();
  }

  function turnPlayer1() {
    setupPlayer1Clicks();
    const spans = document.querySelectorAll(".player1-span");
    let hasPlayable = false;

    spans.forEach((span) => {
      const piece = span.piece;
      if (!piece || span.style.visibility === "hidden") {
        span.classList.remove("playable-piece", "start-player1");
        return;
      }

      const canPlay = startPlayer1
        ? piece.sideA === 1 && piece.sideB === 1
        : partMatchesCurrent(piece);

      if (canPlay) {
        span.classList.add("playable-piece");
        hasPlayable = true;
        if (startPlayer1) span.classList.add("start-player1");
      } else {
        span.classList.remove("playable-piece", "start-player1");
      }
    });

    if (!hasPlayable) {
      pass(1);
      return;
    }
  }

  function restPlayersTurn(player) {
    DOM[`player${player}`].className = "turn-player";

    setTimeout(() => {
      console.log(`Player ${player} jogou (bot)`);

      const playersPieces = {
        2: player2Pieces,
        3: player3Pieces,
        4: player4Pieces,
      };
      const piecesDoJogador = playersPieces[player];

      const chosenPiece = piecesDoJogador.find(partMatchesCurrent);
      if (chosenPiece) {
        currentPart = chosenPiece;
        const side = getPlacementSide(chosenPiece);
        const updatedPieces = piecesDoJogador.filter(
          (part) => part !== chosenPiece,
        );
        setPlayerPieces(player, updatedPieces);

        placePieceOnTable(currentPart, player, side, currentEnds);
        if (side) updateCurrentEnds(chosenPiece, side);
        const spanToRemove = document.querySelector(`.player${player}-span`);
        if (spanToRemove) spanToRemove.remove();
        DOM[`player${player}`].className = "";
        round = player === 4 ? 1 : player + 1;
        whoplayed();

        console.log(`Player ${player} jogou a peça:`, currentPart, updatedPieces);
      } else {
        pass(player);
      }
    }, 3000);
  }

  function pass(player) {
    DOM[`player${player}`].className = "pass";

    setTimeout(() => {
      DOM[`player${player}`].className = "";
      round = player === 4 ? 1 : player + 1;
      whoplayed();
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

    if (round !== 1) {
      clearPlayer1Highlights();
      clearSideChoice();
    }

    if (round === 1) {
      turnPlayer1();
      DOM.player1.className = "turn-player";
    } else if (round === 2) {
      restPlayersTurn(2);
    } else if (round === 3) {
      restPlayersTurn(3);
    } else if (round === 4) {
      restPlayersTurn(4);
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

window.addEventListener("DOMContentLoaded", execute);

