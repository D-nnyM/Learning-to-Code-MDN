// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const body = document.querySelector('body');
const player1Score = document.querySelector('.player1Score');
const player2Score = document.querySelector('.player2Score')
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
    constructor (x, y, color, controlKeys) {
        super(x, y, 10, 10);
        this.size = 10;
        this.color = color;
        this.controlKeys = controlKeys; // list of 4 items designating keys for left, right, down and up movement, in that order
        this.controlKeysPressed = []; // list with valid keys being pressed at the moment
        this.score = 0; // balls eaten
    }

    //draws evil circle
    draw() {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    // prevent players from going off the edge
    checkBounds() {
        if ((this.x + this.size) >= width) {
          this.x = width - (this.size + 3);
        }
  
        if ((this.x - this.size) <= 0) {
          this.x = this.size + 3;
        }
  
        if ((this.y + this.size) >= height) {
          this.y = height - (this.size + 3);
        }
  
        if ((this.y - this.size) <= 0) {
          this.y = this.y + (this.size + 3);
        }
        
    }

    // update player movement
    movement() {
        for (let i = 0; i < this.controlKeysPressed.length; i++) {
            let key = this.controlKeysPressed[i];

            switch (key) {
                case this.controlKeys[0]:
                    this.x -= this.velX;
                    break;
                case this.controlKeys[1]:
                    this.x += this.velX;
                    break;
                case this.controlKeys[2]:
                    this.y += this.velY;
                    break;
                case this.controlKeys[3]:
                    this.y -= this.velY;
                    break;
            }

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
              this.score++;
              player1Score.textContent = `Player 1: ${player1.score} `;
              body.appendChild(player1Score);
              player2Score.textContent = `Player 2: ${player2.score}`;
              body.appendChild(player2Score);
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


let player1 = new EvilCircle(width * .25, height * .25, 'cyan', ['a', 'd', 's', 'w']);
let player2 = new EvilCircle(width * .75, height * .75, 'rgb(255, 10, 168)', ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp']);

// lists available movement options for each player
const allControlKeys = player1.controlKeys.concat(player2.controlKeys);

// keep a list of control keys both players are pressing using event listeners
let allControlKeysPressed = [];

// test if key press is a valid movement control and make sure the same key isn't already in the pressed key array
window.addEventListener('keydown', (e) => {
    let key = e.key;
    if (allControlKeys.includes(key) && !(allControlKeysPressed.includes(key))) {
        allControlKeysPressed.push(key);
    }
});

// remove valid keys when they are released
window.addEventListener('keyup', (e) => {
    let key = e.key;
    if (allControlKeysPressed.includes(key)) {
        allControlKeysPressed = allControlKeysPressed.filter(item => item != key);
    }
});

// stores bouncing balls
const balls = [];

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

    player1.draw();
    player1.checkBounds();
    player1.collisionDetect();

    player2.draw();
    player2.checkBounds();
    player2.collisionDetect();

    if (allControlKeysPressed.length > 0) {
        // seperates all keys pressed into respective player1 and player2 controls
        let player1List = [];
        let player2List = [];


        for (let i = 0; i < allControlKeysPressed.length; i++) {

            let key = allControlKeysPressed[i];

            if (player1.controlKeys.includes(key)) {
                player1List.push(key);
                } else if (player2.controlKeys.includes(key)) {
                player2List.push(key);
                }

        
        }
        // apply specific movements to players
        player1.controlKeysPressed = player1List;
        player1.movement();
        player2.controlKeysPressed = player2List;
        player2.movement();
    }


    requestAnimationFrame(loop);
}

loop();