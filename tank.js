import Bullet from "./bullet.js";

export default class Tank {
  rightPressed = false;
  leftPressed = false;
  upPressed = false;
  downPressed = false;
  shootPressed = false;
  constructor(
    x,
    y,
    tankWidth,
    tankHeight,
    audio,
    audioContext,
    bulletController
  ) {
    this.x = x;
    this.y = y;
    this.width = tankWidth;
    this.velocity = 8;
    this.height = tankHeight;
    this.tankImage = new Image();
    this.tankImage.src = "images/tank.png";
    this.rotation = 0;
    this.audioContext = audioContext;
    this.audio = audio;
    this.audioBuffer = this.audioContext.createBufferSource();
    this.gainNode = this.audioContext.createGain();
    this.audioBuffer.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
    this.loadAudio("audio/tankmove.mp3");
    this.bulletController = bulletController;
    this.bullets = []; // Array to store bullets
    this.bulletCooldown = 0;
  }

  loadAudio(url) {
    fetch(url)
      .then((response) => response.arrayBuffer())
      .then((buffer) => this.audioContext.decodeAudioData(buffer))
      .then((decodedBuffer) => {
        this.audioBuffer.buffer = decodedBuffer;
      })
      .catch((error) => console.error("Error loading audio:", error));
  }
  shootBullet() {
    // Add a cooldown to limit the rate of fire
    if (this.bulletCooldown <= 0) {
      const bullet = new Bullet(this.x, this.y, this.rotation);
      this.bullets.push(bullet);
      this.bulletCooldown = 20; // Set the cooldown (adjust as needed)
    }
  }

  updateBullets() {
    // Update bullet positions and remove off-screen bullets
    this.bullets = this.bullets.filter((bullet) => bullet.update(canvas));
  }

  drawBullets(ctx) {
    // Draw all bullets
    this.bullets.forEach((bullet) => bullet.draw(ctx));
  }
  drawTank(ctx) {
    if (this.shootPressed) {
      this.bulletController.shoot(this.x + this.width / 2, this.y, 4, 10);
    }
    ctx.save();

    this.move();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.rotation);
    ctx.drawImage(
      this.tankImage,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    ctx.restore();
  }

  draw(ctx) {
    this.drawTank(ctx);
  }

  move() {
    if (this.rightPressed) {
      this.x += this.velocity;
    } else if (this.leftPressed) {
      this.x += -this.velocity;
    } else if (this.upPressed) {
      this.y += -this.velocity;
    } else if (this.downPressed) {
      this.y += this.velocity;
    }
  }
  moveLeft() {
    this.rotation = -Math.PI / 2;
    this.playAudio();
    this.rightPressed = false;
    this.leftPressed = true;
  }

  moveRight() {
    this.rotation = Math.PI / 2;
    this.playAudio();
    this.leftPressed = false;
    this.rightPressed = true;
  }

  moveUp() {
    this.rotation = 0;
    this.playAudio();
    this.downPressed = false;
    this.upPressed = true;
  }

  moveDown() {
    this.rotation = Math.PI;
    this.playAudio();
    this.upPressed = false;
    this.downPressed = true;
  }

  playAudio() {
    const source = this.audioContext.createBufferSource();
    source.buffer = this.audioBuffer.buffer;

    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(1, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 2);

    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    source.start();

    this.currentSourceNode = source;
  }

  stopAudio() {
    if (this.currentSourceNode) {
      this.currentSourceNode.stop();
      this.currentSourceNode = null;
    }
  }
}
