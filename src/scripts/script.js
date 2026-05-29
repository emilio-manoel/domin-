DOM ={
    player1: document.getElementById("player1"),
    player2: document.getElementById("player2"),
    player3: document.getElementById("player3"),
    player4: document.getElementById("player4"),
    table: document.getElementById("table")
}

for(let i = 1; i <= 4; i++){
for(let e = 1; e <=7; e++){
    let parts = document.createElement("spam");
    DOM[`player${i}`].appendChild(parts);
    parts.className = `player${i}-spam`;
    parts.id = `number${e}`;
    }
}