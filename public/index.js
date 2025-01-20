cGL.initialize("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function game() {
}

function render() {
    cGL.clear();
    cGL.importUI([{"type":"text","text":"Hello, World!","x":640,"y":400,"sizeFont":"30px Arial","color":"black","align":"center","baseline":"middle"}]);
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