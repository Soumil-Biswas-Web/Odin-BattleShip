export const clickSound = document.getElementById("click-sound");
export const fireShotSound = document.getElementById("fireShot-sound");
export const explodeSound = document.getElementById("explode-sound");
export const victorySound = document.getElementById("victory-sound");
export const defeatSound = document.getElementById("defeat-sound");

export const playSound = (sound) => {
    sound.currentTime = 0;
    sound.play();
}
