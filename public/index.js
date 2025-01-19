cGL.initialize("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function game() {
}

function render() {
    cGL.clear();
    cGL.drawText("Hello World", 100, 100);
    cGL.renderButtons();
}

function loop(timestamp) {
    var elapsed = timestamp - lastTime;
    if (elapsed > frameInterval) {
        cGL.loop();
        game();
        render();
        lastTime = timestamp - (elapsed % frameInterval);
    }
    requestAnimationFrame(loop);
}

var lastTime = 0;
var frameInterval = 1000 / 60;

requestAnimationFrame(loop);