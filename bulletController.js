import Bullet from "./bullet.js";

export default class BulletController {
  bullets = [];
  timeTillNextBulletAllowed = 0;
  constructor(canvas) {
    this.canvas = canvas;
    this.bulletColor = "red";
  }

  draw(ctx) {
    this.bullets = this.bullets.filter(
      (bullet) => bullet.y + bullet.width > 0 && bullet.y <= this.canvas.height
    );

    this.bullets.forEach((bullet) => bullet.draw(ctx));
    if (this.timeTillNextBulletAllowed > 0) {
      this.timeTillNextBulletAllowed--;
    }
  }
  shoot(x, y, velocity, timeTillNextBulletAllowed = 0) {
    if (this.bullets.length < this.maxBulletsAtATime) {
      const bullet = new Bullet(this.canvas, x, y, velocity, this.bulletColor);
      this.bullets.push(bullet);
      if (this.soundEnabled) {
        this.shootSound.currentTime = 0;
        this.shootSound.play();
      }
      this.timeTillNextBulletAllowed = timeTillNextBulletAllowed;
    }
  }
}
