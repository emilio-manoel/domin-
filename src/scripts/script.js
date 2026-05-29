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
    for(let i = 0; i <= 6; i++){
        for(let e = i; e <= 6; e++){
            partsPlayer.push({
                sideA: i,
                sideB: e,
                type:  (i === e) ? "dupla" : "comum"
            });
        }
    }

}

let randomPiecesArray = [];
function randomPieces() {
    for(let i = 0; i < 28;i++){
    randomPiecesArray[i] = (partsPlayer[Math.floor(Math.random() * 28)]);
    }
}



createPartsStyle();
createParts();
randomPieces();

console.log(partsPlayer)
console.log(randomPiecesArray)
