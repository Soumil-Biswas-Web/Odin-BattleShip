import { findCoords } from "./boardHelper";

let AllyBoxes = document.querySelectorAll("#player-table .box");
let OppBoxes = document.querySelectorAll("#opp-block .box");

function displayAllyShips(box, ship) {
    if (ship && ship.length) {
        box.classList.add("allyShip");
    }
    else {
        box.classList.remove("allyShip");
    }
}

function displayAllyShots(box, shots) {
    if (shots) {
        box.classList.add("allyShots");
    }
    else {
        box.classList.remove("allyShots");
    }
}

function displayAllySunk(box, ship) {
    if (ship && ship.isSunk()) {
        box.classList.add("allySunk");
    }
    else {
        box.classList.remove("allySunk");
    }
}

function displayAlly(gameBoard) {
    let i = 0;
    for (let box of AllyBoxes) {
        const coords = findCoords(i);
        const ship = gameBoard.board[coords.y][coords.x];
        displayAllyShips(box, ship);
        const shots = gameBoard.shotsRecieved()[coords.y][coords.x];
        displayAllyShots(box, shots);
        displayAllySunk(box, ship);
        i++;
    }
}

function displayOppShips(box, ship) {
    if (ship && ship.length) {
        box.classList.add("oppShip");
    }
    else {
        box.classList.remove("oppShip");
    }
}

function displayOppShots(box, shots){
    if (shots) {
        box.classList.add("oppShots");
    }
    else {
        box.classList.remove("oppShots");
    }
}

function displayOppSunk(box, ship) {
    if (ship && ship.isSunk()) {
        box.classList.add("oppSunk");
    }
    else {
        box.classList.remove("oppSunk");
    }    
}

const displayOppAdjacents = (coords, board, box) => {
    let d = 10;
    let x = coords.x;
    let y = coords.y;
    for (
        let row = Math.max(0, y - 1);
        row <= Math.min(y + 1, d - 1);
        row++
    ) {
        for (
          let col = Math.max(0, x - 1);
          col <= Math.min(x + 1, d - 1);
          col++
        ) {
          if(board[row][col] && board[row][col].isSunk()) box.classList.add("oppAdj");
        }
    }        
}

export function clearOppsAdjacents() {
    for (let box of OppBoxes) {
        box.classList.remove("oppAdj");
    }
}

function displayOpps(gameBoard) {
    let i = 0;
    for (let box of OppBoxes) {
        const coords = findCoords(i);
        const ship = gameBoard.board[coords.y][coords.x];
        const shots = gameBoard.shotsRecieved()[coords.y][coords.x];
        displayOppShips(box, ship);
        displayOppShots(box, shots);
        displayOppSunk(box, ship);
        displayOppAdjacents(coords, gameBoard.board, box)
        i++;
    }
}

export function displayShips (AllyGameBoard, OppGameBoard) {
    displayAlly(AllyGameBoard);
    displayOpps(OppGameBoard);
}