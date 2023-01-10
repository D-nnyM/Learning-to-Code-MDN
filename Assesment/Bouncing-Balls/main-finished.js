// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const body = document.querySelector('body');
const ballCountDisplay = document.querySelector('.ballCount');

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

class Shape {
    constructor (x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    }
}

class EvilCircle extends Shape {
    constructor (x, y, color) {
        super(x, y, 15, 15);
        this.size = 10;
        this.color = color;

        window.addEventListener("keydown", (e) => {
            switch (e.key) {
              case "a":
                this.x -= this.velX;
                break;
              case "d":
                this.x += this.velX;
                break;
              case "w":
                this.y -= this.velY;
                break;
              case "s":
                this.y += this.velY;
                break;
            }
          });
    }

    //draws evil circle
    draw() {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    checkBounds() {
        if ((this.x + this.size) >= width) {
          this.x = this.x - 10;
        }
  
        if ((this.x - this.size) <= 0) {
          this.x = this.x + 10;
        }
  
        if ((this.y + this.size) >= height) {
          this.y = this.y - 10;
        }
  
        if ((this.y - this.size) <= 0) {
          this.y = this.y + 10;
        }
        
    }

    collisionDetect() {
        for (const ball of balls) {
          if (ball.exists) {
            const dx = this.x - ball.x;
            const dy = this.y - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + ball.size) {
              ball.exists = false;
              ballCount--;
              ballCountDisplay.textContent = `Ball count: ${ballCount}`;
              body.appendChild(ballCountDisplay);
            }

          }
        }
     }
}


class Ball extends Shape {
  constructor (x, y, velX, velY, color, size) {
    super(x, y, velX, velY);
    this.color = color;
    this.size = size;
    this.exists = true;
  }

    // draws ball
    draw() {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.fill();
    }

    // changes velocity of ball to prevent the ball going off the page
    update() {
      if ((this.x + this.size) >= width) {
        this.velX = -(Math.abs(this.velX));
      }

      if ((this.x - this.size) <= 0) {
        this.velX = (Math.abs(this.velX));
      }

      if ((this.y + this.size) >= height) {
        this.velY = -(Math.abs(this.velY));
      }

      if ((this.y - this.size) <= 0) {
        this.velY = (Math.abs(this.velY));
      }
      
      this.x += this.velX;
      this.y += this.velY;
    }

    // check area of the current ball being looped through against balls in the array to see if they overlap, if so, change color
    collisionDetect() {
        for (const ball of balls) {
        if (!(this === ball) && ball.exists) {
            const dx = this.x - ball.x;
            const dy = this.y - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + ball.size) {
              ball.color = this.color = randomRGB();
            }
          }
        }
    }

}



const balls = [];
let evilCircle = new EvilCircle(width * .25, height * .25, 'cyan');
let ballCount = 0;

// create new balls loop
while (balls.length < 25) {
    const size = random(10, 20);

    const ball = new Ball(
    // ball position always drawn at least one ball width away from the edge of the canvas to avoid drawing errors
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size,
    );

    balls.push(ball);
    ballCount++;
    ballCountDisplay.textContent = `Ball count: ${ballCount}`;
    body.appendChild(ballCountDisplay);

}

  
// recursively calls loop function via requsetAnimationFrame(loop) method
function loop() {
    // set canvas color and add transparency to allow ball trails via 4th argument in fillStyle
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(0,0, width, height);

    // loop through balls array to draw ball in a new place, adjust velocity for the next frame, check if balls collide
    for (const ball of balls) {
        if (ball.exists) {
            ball.draw();
            ball.update();
            ball.collisionDetect();
        }
    }

    evilCircle.draw();
    evilCircle.checkBounds();
    evilCircle.collisionDetect();


    requestAnimationFrame(loop);
}

loop();