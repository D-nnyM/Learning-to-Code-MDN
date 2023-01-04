// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// function to generate random color

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}



class Ball {
  constructor(x, y, velX, velY, color, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
  }

 // draws ball
    draw() {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.fill();
  }

 // changes velocity of ball to prevent the ball going off the
 // page
    update() {
      if((this.x + this.size) >= width) {
        this.velX = -(this.velX);
      }

      if((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
      }

      if((this.y + this.size) >= height) {
        this.velY = -(this.velY);
      }

      if((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
      }
      
      this.x += this.velX;
      this.y += this.velY;
      }
    }

    // storing balls

    const balls = [];

    // create new balls loop

    while (balls.length < 25) {
      const size = random(10, 20);
      const ball = new Ball(
        // ball position always drawn at least one ball width
        // away from the edge of the canvas to avoid drawing
        // errors
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(-7, 7),
        random(-7, 7),
        randomRGB(),
        size
      );

      balls.push(ball);

    }

  
 // recursively calls loop function via requsetAnimationFrame
 // (loop) method
    function loop() {
      // set canvas color and add transparency to allow ball trails via 4th argument in fillStyle
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(0,0, width, height);

    // loop through balls array to draw ball in a new place
    // and adjust velocity for the next frame
      for (const ball of balls) {
        ball.draw();
        ball.update();
      }

      requestAnimationFrame(loop);
    }

    loop();