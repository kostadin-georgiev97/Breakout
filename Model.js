function Model () {

    const BALL_SPEED = 0.9,
        PADDLE_SPEED = 0.7,
        BRICK_ROWS = 4,
        BRICKS_PER_ROW = 9;

    let boardWidth,
        boardHeight,
        paddle,
        ball,
        bricks = [];

    this.buildBoard = function (width, height) {
        boardWidth = width;
        boardHeight = height;

        paddle = new Paddle();
        paddle.x = (boardWidth / 2) - (paddle.width / 2);
        paddle.y = boardHeight - paddle.height - 20;
        paddle.speed = PADDLE_SPEED * boardWidth;

        ball = new Ball();
        ball.x = boardWidth / 2 - ball.width / 2;
        ball.y = boardHeight / 2 - ball.height / 2;
        ball.speed = BALL_SPEED * boardWidth;

        // Build 4 rows of bricks
        bricks = [];
        let brickWidth = boardWidth / BRICKS_PER_ROW,
            brickHeight = brickWidth / 2,
            bricksRow;
        for(let row = 0; row < BRICK_ROWS; row++) {
            bricksRow = [];
            for(let col = 0; col < BRICKS_PER_ROW; col++) {
                let brick = new Brick();
                brick.x = col * brickWidth;
                brick.y = row * brickHeight;
                brick.width = brickWidth;
                brick.height = brickHeight;
                bricksRow[col] = brick;
            }
            bricks.push(bricksRow);
        }

        for(let row = 0; row < BRICK_ROWS; row++) {
            for(let col = 0; col < BRICKS_PER_ROW; col++) {
                let brick = bricks[row][col];
            }
        }

    };

    this.getPaddle = function () {
        return paddle;
    };

    this.movePaddle = function (x) {
        if(x < -2) {
            paddle.xv = paddle.speed + (x * x) / 2;
        } else if(x > 2) {
            paddle.xv = -paddle.speed - (x * x) / 2;
        } else {
            paddle.xv = 0;
        }
    };

    this.updatePaddle = function (delta) {
        paddle.x += paddle.xv * delta;
        if(paddle.x < 0) { // hits left wall
            paddle.x = 0;
        } else if(paddle.x > boardWidth - paddle.width) { // hits right wall
            paddle.x = boardWidth - paddle.width;
        }
    };

    this.getBall = function () {
        return ball;
    };

    this.updateBall = function (delta) {
        ball.x += ball.xv * delta;
        ball.y += ball.yv * delta;

        // collision with walls
        if(ball.x < 0) { // left wall
            ball.x = 0;
            ball.xv = -ball.xv;
        } else if(ball.x > boardWidth - ball.width) { // right wall
            ball.x = boardWidth - ball.width;
            ball.xv = -ball.xv;
        } else if(ball.y < 0) { // top wall
            ball.y = 0;
            ball.yv = -ball.yv;
        } else if(ball.y > boardHeight + 150) { // restart game
            this.restartGame();
        }

        // collision with paddle
        if(ball.y > paddle.y - ball.height
            && ball.y < paddle.y
            && ball.x > paddle.x - ball.width / 2
            && ball.x < paddle.x + paddle.width - ball.width / 2
        ) {
            ball.y = paddle.y - ball.height;
            ball.yv = -ball.yv;
        }

        if(ball.yv === 0) {
            this.setBallOff();
        }
    };

    this.setBallOff = function () {
        // random angle between 45 and 135 degrees
        let angle = Math.random() * Math.PI / 2 + Math.PI / 4;
        model.applyBallSpeed(angle);
    };

    this.applyBallSpeed = function (angle) {
        ball.xv = ball.speed * Math.cos(angle);
        ball.yv = -(ball.speed * Math.sin(angle));
    };

    this.getBricks = function () {
        return bricks;
    };

    this.updateBricks = function (delta) {
        OUTER: for(let row = 0; row < BRICK_ROWS; row++) {
            for(let col = 0; col < BRICKS_PER_ROW; col++) {
                if(bricks[row][col] !== null
                    && ball.x > bricks[row][col].x - ball.width / 2
                    && ball.x < bricks[row][col].x + bricks[row][col].width - ball.width / 2
                    && ((ball.y < bricks[row][col].y
                        && ball.y > bricks[row][col].y - ball.height)
                        || (ball.y + ball.height > bricks[row][col].y + bricks[row][col].height
                            && ball.y < bricks[row][col].y + bricks[row][col].height))
                ) {
                    bricks[row][col] = null;
                    ball.yv = -ball.yv;
                    break OUTER;
                } else if(bricks[row][col] !== null
                    && ball.y > bricks[row][col].y - ball.height / 2
                    && ball.y < bricks[row][col].y + bricks[row][col].height - ball.height / 2
                    && ((ball.x < bricks[row][col].x
                            && ball.x > bricks[row][col].x - ball.width
                        )
                        || (ball.x + ball.width > bricks[row][col].x + bricks[row][col].width
                            && ball.x < bricks[row][col].x + bricks[row][col].width
                        )
                    )
                ) {
                    bricks[row][col] = null;
                    ball.xv = -ball.xv;
                    break OUTER;
                }
            }
        }
    };

    this.restartGame = function () {
        this.buildBoard(boardWidth, boardHeight);
    };

    this.getBrickRows = function () {
        return BRICK_ROWS;
    };

    this.getBricksPerRow = function () {
        return BRICKS_PER_ROW;
    };

}

function Paddle() {
    this.x = 0;
    this.y = 0;
    this.width = 90;
    this.height = 10;
    this.speed = 0;
    this.xv = 0;
}

function Ball() {
    this.x = 0;
    this.y = 0;
    this.width = 10;
    this.height = 10;
    this.speed = 0;
    this.xv = 0;
    this.yv = 0;
}

function Brick() {
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;

    this.intersect = function (ball) {
        let bBot = ball.y + ball.height * 0.5;
        let bLeft= ball.x - ball.width * 0.5;
        let bRight = ball.x + ball.width * 0.5;
        let bTop = ball.y - ball.height * 0.5;

        return this.x < bRight
            && bLeft < this.x + this.width
            && this.y + this.height > bTop
            && bBot > this.y;
    }
}