let view = new View(),
    model = new Model(),
    controller = null;

function Controller () {

    let timeDelta, timeLast;

    this.init = function () {
        model.buildBoard(view.getWidth(), view.getHeight());
        view.drawPaddle(model.getPaddle().x, model.getPaddle().y, model.getPaddle().width, model.getPaddle().height);
        view.drawBall(model.getBall().x, model.getBall().y, model.getBall().width, model.getBall().height);
        let bricks = model.getBricks();
        for(let row = 0; row < model.getBrickRows(); row++) {
            for (let col = 0; col < model.getBricksPerRow(); col++) {
                let brick = bricks[row][col];
                if(brick !== null) {
                    view.drawBrick(brick.x, brick.y, brick.width, brick.height, row);
                }
            }
        }

        /*if(window.DeviceOrientationEvent) {
            window.addEventListener("deviceorientation", function (event) {
                model.movePaddle(event.alpha);
            });
        }*/

        if (window.DeviceMotionEvent){
            window.addEventListener("devicemotion", function(event){
                var x = event.accelerationIncludingGravity.x, y=event.accelerationIncludingGravity.y, z=event.accelerationIncludingGravity.z, pitch, roll;

                pitch = Math.atan(y/z) * 180 / Math.PI;
                roll = Math.atan( -x / Math.sqrt(y*y + z*z)) * 180 / Math.PI;
                model.movePaddle(roll);
            });
        }

        requestAnimationFrame(controller.gameLoop);
    };

    this.repaint = function (timeDelta) {
        model.updatePaddle(timeDelta);
        model.updateBall(timeDelta);
        model.updateBricks(timeDelta);
        view.clearCanvas();
        view.drawPaddle(model.getPaddle().x, model.getPaddle().y, model.getPaddle().width, model.getPaddle().height);
        view.drawBall(model.getBall().x, model.getBall().y, model.getBall().width, model.getBall().height);
        let bricks = model.getBricks();
        for(let row = 0; row < model.getBrickRows(); row++) {
            for (let col = 0; col < model.getBricksPerRow(); col++) {
                let brick = bricks[row][col];
                if(brick !== null) {
                    view.drawBrick(brick.x, brick.y, brick.width, brick.height, row);
                }
            }
        }
    };

    this.gameLoop = function (timeNow) {
        if(!timeLast) {
            timeLast = timeNow;
        }

        timeDelta = (timeNow - timeLast) / 1000;
        timeLast = timeNow;

        controller.repaint(timeDelta);

        requestAnimationFrame(controller.gameLoop);
    };

}

controller = new Controller();
window.addEventListener("load", controller.init);