import './style.css';
import { gameDriver } from './modules/gameDriver';
import { clickSound, playSound } from './modules/sounds';

// Set Board box and Button click events
const init = () => {
    let displayText = document.querySelector(".content p");
    
    let startButton = document.querySelector("#newGame");

    startButton.addEventListener("click", () => {
        console.log("New Game Button clicked.");
        playSound(clickSound);
        console.log("pop");
        displayText.textContent = "Your Turn, Click on one of the Opponent's tiles to fire on.";
        displayText.classList.remove("oppMsg");
        gameDriver(10, displayText); // Function to actually control the game
    })
}

// Driver Code
console.log("Hello there.");

init();

// console.log("DOM created");

// Execute after DOM is initialized

