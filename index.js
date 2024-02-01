import BulletController from "./bulletController.js";
import Tank from "./tank.js";
const canvas = document.getElementById("game");
const audio = document.getElementById("audio");
const ctx = canvas.getContext("2d");
const width = (canvas.width = 1200);
const height = (canvas.height = 700);
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const bulletController = new BulletController(canvas);
const background = new Image();
const tank = new Tank(600, 600, 80, 80, audio, audioContext, bulletController);

background.src = "images/ground.jpg";

function handleKeyDown(event) {
  switch (event.code) {
    case "ArrowLeft":
      tank.moveLeft();
      break;
    case "ArrowRight":
      tank.moveRight();
      break;
    case "ArrowUp":
      tank.moveUp();
      break;
    case "ArrowDown":
      tank.moveDown();
      break;
  }
}
function handleMovment() {
  tank.rightPressed = false;
  tank.leftPressed = false;
  tank.upPressed = false;
  tank.downPressed = false;
  tank.shootPressed = false;
}
function handleKeyUp(event) {
  handleMovment();
  setTimeout(() => {
    if (
      event.code === "ArrowLeft" ||
      event.code === "ArrowRight" ||
      event.code === "ArrowUp" ||
      event.code === "ArrowDown"
    ) {
      tank.stopAudio();
    }
  }, 200);
}

function handleBullet(event) {
  if (event.key === " ") {
    tank.shootPressed = true;
  }
}
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);
document.addEventListener("keydown", handleBullet);
function gameLoop() {
  ctx.clearRect(0, 0, width, height);
  bulletController.draw(ctx);
  ctx.drawImage(background, 0, 0, width, height);
  tank.updateBullets();
  tank.drawBullets(ctx);
  tank.draw(ctx);

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
