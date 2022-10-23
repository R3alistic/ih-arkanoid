let canvas = document.getElementById("gameArea");
let ctx = canvas.getContext('2d');
//Ball Variables
let ballRadius = 6;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 1;
let dy = -1;
//Paddle Variables
let paddleHeight = 20;
let paddleWidth = 85;
let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = y;
let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let lastPaddleX = paddleX;
//Brick Variables
let brickRowCount = 13;
let brickColumnCount = 6;
let brickWidth = 55;
let brickHeight = 20;
let brickPadding = 4;
let brickOffsetTop = 100;
let brickOffsetLeft = 17;
//UI Variables
let score = 0;
let lives = 3;
//PowerUp Variables, Class and Type Object
let powerUpCount = 2;
let powerUpSpeed = 0.1;
let powerUpChance = 0.0001;
//Reset Powerups when game starts
let powerUpSuper = false;
let powerUpLife = false;
let powerUpSticky = false;
let powerUpExtension = false;
class PowerUp {
    constructor(x, y, width, height, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.yv = powerUpSpeed * height;
    }
}
const powerUpType = {
    extend: { color: "blue" },
    life: { color: "red" },
    sticky: { color: "cyan" },
    super: { color: "magenta" }
}
//Array for bricks and PowerUps
let powerUpsArray = [];
let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

//Event listeners for player pad control
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    // add a and d and 2
    if (e.code == 'ArrowRight' || e.code == 'KeyA') {
        rightPressed = true;
    }
    else if (e.code == 'ArrowLeft' || e.code == 'KeyD') {
        leftPressed = true;
    }
    else if (e.code == 'ArrowUp' || e.code == 'KeyW'){
        upPressed = true; 
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
                    //if ball is super it will not bounce
                    if (!powerUpSuper) {
                        dy = -dy;
                    }
                    b.status = 0;
                    score++;
                    //Hit collision sound
                    let ballTouchSound;
                    ballTouchSound = new Audio("./soundEffects/ballTouchSound.wav");
                    ballTouchSound.play();
                    //Win condition
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
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    //if condition for super powerup ball and sticky powerup ball
    if (powerUpSuper) {
        ctx.fillStyle = powerUpType.super.color;
    }
    else if (powerUpSticky) {
        ctx.fillStyle = powerUpType.sticky.color;
    }
    else {
        ctx.fillStyle = "silver";
    }
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    let paddle = new Image();
    //if condition for sticky power up
    paddle.src = powerUpSticky ? "./images/magnetic-pad.png" : "./images/paddle-image.png";
    ctx.drawImage(paddle, paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.closePath();
    //Power Up hit collision with player paddle
    for (let i = powerUpsArray.length - 1; i >= 0; i--) {
        if (powerUpsArray[i].x + powerUpsArray[i].width * 0.5 > paddleX - paddleWidth * 0.5
            && powerUpsArray[i].x - powerUpsArray[i].width * 0.5 < paddleX + paddleWidth * 0.5
            && powerUpsArray[i].y + powerUpsArray[i].height * 0.5 > paddleY - paddleHeight * 0.5
            && powerUpsArray[i].y + powerUpsArray[i].height * 0.5 < paddleY + paddleHeight * 0.5) {
            switch (powerUpsArray[i].type) {
                //extend power up
                case powerUpType.extend:
                    powerUpExtension = true;
                    paddleWidth = 115;

                    let extendSound;
                    extendSound = new Audio("./soundEffects/Enlarge.mp3");
                    extendSound.play();

                    break;
                //life incrementation
                case powerUpType.life:
                    lives++;

                    let lifeSound;
                    lifeSound = new Audio("./soundEffects/extraLife.mp3");
                    lifeSound.play();

                    break;
                //activate ball stickyness
                case powerUpType.sticky:
                    powerUpSticky = true;
                    powerUpSuper = false;

                    let stickySound;
                    stickySound = new Audio("./soundEffects/sticky.mp3");
                    stickySound.play();

                    break;

                //activate super ball
                case powerUpType.super:
                    powerUpSuper = true;
                    powerUpSticky = false;

                    let powerupSound;
                    powerupSound = new Audio("./soundEffects/ballTouchSound.wav");
                    powerupSound.play();

                    break;
            }
            powerUpsArray.slice(i, 1);
            //Add powerup sound here
        }
    }
}



function drawBricks() {
    // this is a new change, create brick pictures here 
    let silverBlock = new Image();
    silverBlock.src = "./images/silver-block.png";

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
            let brickX = r * (brickWidth + brickPadding) + brickOffsetLeft;
            let brickY = c * (brickHeight + brickPadding) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            //creates new PowerUp
            if (bricks[c][r].status == 0 && Math.random() < powerUpChance) {
                let px = bricks[c][r].x + brickWidth / 2;
                let py = bricks[c][r].y + brickHeight / 2;
                let pWidth = brickWidth / 2;
                let pHeight = brickHeight / 3;
                let pKeys = Object.keys(powerUpType)
                let pKey = pKeys[Math.floor(Math.random() * pKeys.length)];
                powerUpsArray.push(new PowerUp(px, py, pWidth, pHeight, powerUpType[pKey]));
            }
            //creates the bricks
            else if (bricks[c][r].status == 1) {
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

function drawPowerUps() {
    ctx.fillStyle = "cyan";
    powerUpsArray.forEach((powerUp) => {
        ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
    })
}

function updatePowerUps() {
    for (let i = powerUpsArray.length - 1; i >= 0; i--) {
        powerUpsArray[i].y += powerUpsArray[i].yv;
        // delete powerup when off canvas
        if (powerUpsArray[i].y - powerUpsArray[i].h * 0.5 > canvas.height) {
            powerUpsArray.splice(i, 1);
        }
    }
}

function drawScore() {
    ctx.font = "20px Nordic Light";
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + score, 18, 30);
}

function drawLives() {
    ctx.font = "20px Nordic Light";
    ctx.fillStyle = "#black";
    ctx.fillText("Lives: ", canvas.width - 185, 35);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
    drawPowerUps();
    updatePowerUps();

    //draw additional life icons depending on life variable
    let paddleLife = new Image();
    paddleLife.src = "./images/life-symbol.png";
    switch (lives) {
        case 1:
            ctx.drawImage(paddleLife, canvas.width - 130, 20, 40, 20);
            break;

        case 2:
            ctx.drawImage(paddleLife, canvas.width - 90, 20, 40, 20);
            ctx.drawImage(paddleLife, canvas.width - 130, 20, 40, 20);
            break;

        default:
            ctx.drawImage(paddleLife, canvas.width - 50, 20, 40, 20);
            ctx.drawImage(paddleLife, canvas.width - 90, 20, 40, 20);
            ctx.drawImage(paddleLife, canvas.width - 130, 20, 40, 20);
            break;
    }

    //bounce off canvas walls
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    }
    //bounce off player paddle
    else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            if (powerUpSticky) {
                dx = 0;
                dy = 0;
            }
            else {
                dy = -dy;
            }
            //Add magnetic noise file here?
        }
        //life decrement
        else {
            lives--;
            //game over condition
            if (!lives) {
                alert("Sorry Loser, Game over");
                document.location.reload();
            }
            //reset ball, player and powerups when life lost and not game over
            else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 1;
                dy = -1;
                paddleX = (canvas.width - paddleWidth) / 2;
                powerUpSuper = false;
                powerUpLife = false;
                powerUpSticky = false;
                powerUpExtension = false;
            }
        }
    }
    //if conditions to move player paddle AND stop pad from leaving canvas game area
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    }
    else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
    
    // move stationary ball with the paddle when sticky power up is online
    else if (dy == 0) {
        x = paddleX + paddleWidth * 0.5;
        y = paddleY - paddleHeight * 0.01;
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
    //startup sound
    let startSound;
    startSound = new Audio("./soundEffects/gameStartSound.wav");
    startSound.play();
    draw();
}