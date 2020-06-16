function View () {

    let canvas = document.getElementById("gameCanvas"),
        ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    this.clearCanvas = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    this.drawPaddle = function (x, y, width, height) {
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.fillStyle = "orange";
        ctx.fill();
        ctx.closePath();
    };

    this.drawBall = function (x, y, width, height) {
        ctx.beginPath();
        ctx.arc(x + width / 2, y + width / 2, width / 2, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();
    };

    this.drawBrick = function (x, y, width, height, row) {
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        switch(row) {
            case 0:
                ctx.fillStyle = "red";
                break;
            case 1:
                ctx.fillStyle = "blue";
                break;
            case 2:
                ctx.fillStyle = "green";
                break;
            case 3:
                ctx.fillStyle = "yellow";
                break;
        }
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    };

    this.getWidth = function () {
        return canvas.width;
    };

    this.getHeight = function () {
        return canvas.height;
    };

}