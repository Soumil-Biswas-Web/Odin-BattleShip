import { findCoords } from "./boardHelper";

const eventListeners = new Map(); // Store event listeners for removal later
let boxes = document.querySelectorAll("#opp-block .box");
let randomizeButton = document.querySelector("#newBoard");

// Enable opponent's boards to have on-click listeners
export function activateBoard() {
  return new Promise((resolve) => {
    let i = 0;
    // console.log(boxes);
    for (let box of boxes) {
      const coords = findCoords(i);
      // const coords = i;
      box.classList.add("activated");

      const onClickBox = () => {
        console.log("coords:");
        randomizeButton.disabled = true;
        // console.log(coords);
        resolve(coords);
      }

      // Store event listener reference
      eventListeners.set(box, onClickBox);

      box.addEventListener("click", onClickBox, { once: true });
      i++;
    }
  });
}

// Enable opponent's boards to have on-click listeners
export function deActivateBoard() {
  for (let box of boxes) {
    box.classList.remove("activated");
    if (eventListeners.has(box)) {
      box.removeEventListener("click", eventListeners.get(box));
      eventListeners.delete(box); // Remove from Map
    }
  }
}
