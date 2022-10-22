let canvas = document.getElementById("gameArea");
let ctx = canvas.getContext('2d');

let ballRadius = 6;
let x = canvas.width/2;
let y = canvas.height-30;
let dx = 2
let dy = -2 ;
let paddleHeight = 20;
let paddleWidth = 85;
let paddleX = (canvas.width-paddleWidth)/2;
let rightPressed = false;
let leftPressed = false;
let brickRowCount = 13;
let brickColumnCount = 6;
let brickWidth = 55;
let brickHeight = 20;
let brickPadding = 4;
let brickOffsetTop = 100;
let brickOffsetLeft = 17;
let score = 0;
let lives = 3;

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
// add a and d 
    if (e.code == 'ArrowRight'|| e.code == 'KeyA') {
        rightPressed = true;
    }
    else if (e.code == 'ArrowLeft'|| e.code == 'KeyD') {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
// add a and d 
    if (e.code == 'ArrowRight' || e.code == 'KeyA') {
        rightPressed = false;
    }
    else if (e.code == 'ArrowLeft' || e.code == 'KeyD') {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    let relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;

                    let ballTouchSound;
                    ballTouchSound = new Audio("./soundEffects/ballTouchSound.wav");
                    ballTouchSound.play();


                    if (score == brickRowCount * brickColumnCount) {
                        alert("YOU WIN, CONGRATS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#C0C0C0";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    paddle = new Image();
    paddle.src ="./images/paddleimage.png";
    ctx.drawImage(paddle, paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.closePath();
}



function drawBricks() {
    // this is a new change, create brick pictures here 
    let silverBlock = new Image();
    silverBlock.src ="./images/silver-block.png";

    let redBlock = new Image();
    redBlock.src = "./images/red-block.png";

    let yellowBlock = new Image();
    yellowBlock.src = "./images/yelllow-block.png";

    let blueBlock = new Image();
    blueBlock.src = "./images/blue-block.png";

    let magentaBlock = new Image();
    magentaBlock.src = "./images/magenta-block.png";

    let greenBlock = new Image();
    greenBlock.src = "./images/green-block.png";

  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        let brickX = r * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = c * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        switch (c) {
//draw brick pictures 
          case 0:
            ctx.beginPath();
            ctx.drawImage(silverBlock, brickX, brickY, brickWidth, brickHeight);
            ctx.closePath();
            break;

          case 1:
            ctx.beginPath();
            ctx.drawImage(redBlock, brickX, brickY, brickWidth, brickHeight);
            ctx.closePath();
            break;

          case 2:
            ctx.beginPath();
            ctx.drawImage(yellowBlock, brickX, brickY, brickWidth, brickHeight);
            ctx.closePath();
            break;

          case 3:
            ctx.beginPath();
            ctx.drawImage(blueBlock, brickX, brickY, brickWidth, brickHeight);
            ctx.closePath();
            break;

          case 4:
            ctx.beginPath();
            ctx.drawImage(magentaBlock, brickX, brickY, brickWidth, brickHeight);
            ctx.closePath();
            break;

          case 5:
            ctx.beginPath();
            ctx.drawImage(greenBlock, brickX, brickY, brickWidth, brickHeight);
            ctx.closePath();
            break;
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = "20px Nordic Light";
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 18, 30);
}

let paddleLife = new Image();
paddleLife.src ="./images/lifeSymbol.png";

function drawLives() {
    ctx.font = "20px Nordic Light";
    ctx.fillStyle = "#black";
    ctx.fillText("Lives: ", canvas.width - 185, 35);
}


function clear(){
    ctx.clearRect(0,0,c.width,c.height);
}

function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
    

    if (lives === 3) {
        ctx.drawImage(paddleLife, canvas.width - 50, 20, 40, 20);
        ctx.drawImage(paddleLife, canvas.width - 90, 20, 40, 20);
        ctx.drawImage(paddleLife, canvas.width - 130, 20, 40, 20);
    } else if (lives === 2) {
        ctx.drawImage(paddleLife, canvas.width - 90, 20, 40, 20);
        ctx.drawImage(paddleLife, canvas.width - 130, 20, 40, 20);
    } else if (lives === 1) {
        ctx.drawImage(paddleLife, canvas.width - 130, 20, 40, 20);
    } 


    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    }
    else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            lives--;

            if(!lives) {
                alert("Sorry Loser, Game over");
                document.location.reload();
            }

            else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }


    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    }
    else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }


    x += dx;
    y += dy;
    
    requestAnimationFrame(draw);
}

draw();

function startGame() {

    let startDiv = document.getElementById("start");
    let gameCanvas = document.getElementById("gameArea");
    startDiv.style.display = "none";
    gameCanvas.style.display = "block";

    
    let startSound;
    startSound = new Audio("./soundEffects/gameStartSound.wav");
    startSound.play();
    

    draw();
}



