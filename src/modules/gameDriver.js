import { activateBoard, deActivateBoard } from "./activateBoard";
import { displayShips, clearOppsAdjacents } from "./displayShips";
import { gameBoard } from "./gameBoard";
import { player } from "./player";
import { clickSound, defeatSound, explodeSound, fireShotSound, playSound, victorySound } from "./sounds";

// Initializes and drives the game forward, until the win condition is met for either player
export function gameDriver(size = 10, displayText) {

    let randomizeButton = document.querySelector("#newBoard");
    randomizeButton.disabled = false;

    // Clear All displayed adjacent blocks if left over from previous game
    clearOppsAdjacents();

    // create players
    let player1 = player(gameBoard(size));    // Player
    let player2 = player(gameBoard(size), true);    // CPU, for now

    // Place ships on both sides
    player1.board.placeRandom();
    player2.board.placeRandom();

    // Set the current Player
    let currentPlayer = player1;
    let currentOpp = player2;
    let winner = null;

    const playTurn = (currentPlayer, currentOpp, coords) => {
        let isHit = false;
        // Write function for what happens on hit
        isHit = currentOpp.board.recieveAttack(coords.x,coords.y);
        console.log("Received attack at ["+coords.x+","+coords.y+"]");
        playSound(fireShotSound);
    
        // // If all ships for opponent are sunk, declare winner.
        if (currentOpp.board.loss()) {
            winner = currentPlayer;
            // Display all ships on the player's side
            displayShips(player1.board, player2.board);            
            if (winner === player1) {
                displayText.textContent = "Congratulations! You won!";
                playSound(victorySound);
                displayText.classList.remove("oppMsg");
            }
            if (winner === player2) {
                displayText.textContent = "The opponent won. Better luck next time!";
                playSound(defeatSound);
                displayText.classList.add("oppMsg");
            }

            return winner;
        }

        // If hit a ship, player get's a free turn. Otherwise, it is the other player's turn
        if (!isHit) {
            let temp;
            temp = currentPlayer;
            currentPlayer = currentOpp;            
            currentOpp = temp;
            if (currentPlayer.isCPU) displayText.textContent = "Adversary's Turn. The Opponent is Thinking...";
            displayText.classList.add("oppMsg");
        }
        else {
            console.log("Hit enemy ship!")
            if(currentOpp.isCPU){
                setTimeout(() => {                
                    displayText.textContent = "You hit an Enemy Ship! You get a free turn!";
                    playSound(explodeSound);
                    displayText.classList.remove("oppMsg");
                }, 100)
            }
            else {
                setTimeout(() => {                
                    displayText.textContent = "The Enemy hit a ship! A free turn for them!";
                    playSound(explodeSound);
                    displayText.classList.add("oppMsg");
                }, 100)
            }
        };
        
        pickTurn(currentPlayer, currentOpp);    // Go next turn.
    }

    const pickTurn = async (currentPlayer, currentOpp) => {
        
        // Display all ships on the player's side
        displayShips(player1.board, player2.board);

        // Wait for a hit
        let coords = { x: null, y: null };
        // If CPU's turn hit should happen automatically
        if (currentPlayer.isCPU) {
            setTimeout(() => {                
                console.log("CPU's turn");
                displayText.textContent = "Adversary's Turn. The Opponent is Thinking...";
                displayText.classList.add("oppMsg");
                let success = false;
                while (!success) {
                    coords = cpuTakeShot(coords);
                    console.log(coords);
                    try {                        
                        playTurn(currentPlayer, currentOpp, coords);
                        success = true;
                    } catch (error) {
                        // Do nothing for errors. Let the function try again.
                    }
                }
            }, 2000);
        }
        // If player, ask for hit coords
        else {
            console.log("Player's turn");
            displayText.textContent = "Your Turn, Click on one of the Opponent's tiles to fire on.";
            displayText.classList.remove("oppMsg");
            let success = false;
            while (!success) {
                deActivateBoard();
                coords = await activateBoard();
                console.log(coords);
                try {                        
                    playTurn(currentPlayer, currentOpp, coords);
                    success = true;
                } catch (error) {
                    console.error(error);
                    displayText.textContent = "You Cannot click on the same Tile Twice! Try Again.";
                    displayText.classList.remove("oppMsg");
                }
            }            
        }
        // else {
        //     let input = prompt("Enter coords (x,y): ");
            
        //     if (input) {
        //         let [x,y] = input.split(",").map(num => parseInt(num.trim(), 10));
        //         if (!isNaN(x) && !isNaN(y)) coords = {x,y};     // set the value of coords from input
        //         else alert("Invalid input. Please enter Coordinates in the format `x,y`.")
        //     }
        // }

    }

    const cpuTakeShot = (coords) => {
        coords.x = Math.floor(Math.random() * size);
        coords.y = Math.floor(Math.random() * size);
        return coords;
    }   
    
    // Play the first turn
    pickTurn(currentPlayer, currentOpp);

    // Re-randomize ships for the player
    randomizeButton.addEventListener("click", () => {
        player1.board.placeRandom();
        displayShips(player1.board, player2.board);
        playSound(clickSound);
        // console.log("pop");
    })

    return {
        player1,
        player2,
        currentPlayer,
        winner,
    }
}