cGL.initialize("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
cGL.gamepadNavigationMode = 2;

cGL.loadImage("A", "/images/a.png");
cGL.loadImage("B", "/images/b.png");
cGL.loadImage("Analog", "/images/analog.png");

var steamid;
var username;

fetch('/api/steamid')
    .then(response => response.json())
    .then(data => {
        steamid = data;
    })
    .catch(error => console.error('Error fetching Steam ID:', error));

fetch('/api/accountname')
    .then(response => response.json())
    .then(data => {
        username = data.account_name;
    })
    .catch(error => console.error('Error fetching Username:', error));

const uiArrayOne = [{"type":"box","x":0,"y":0,"width":9999,"height":9999,"color":"#0E141B","cornerRadius":0,"borderWidth":0,"borderColor":"black"},{"type":"box","x":-5,"y":-5,"width":190,"height":9999,"color":"#24282E","cornerRadius":0,"borderWidth":0,"borderColor":"black"},{"type":"text","text":"Classic Deck","x":0,"y":0,"sizeFont":"30px Arial","color":"white","align":"left","baseline":"top"},{"type":"text","text":"Beta 1","x":0,"y":30,"sizeFont":"15px Arial","color":"LightGrey","align":"left","baseline":"top"},{"type":"box","x":185,"y":0,"width":9999,"height":200,"color":"#2A303B","cornerRadius":0,"borderWidth":0,"borderColor":"black"},{"type":"box","x":-5,"y":760,"width":1290,"height":100,"color":"black","cornerRadius":0,"borderWidth":0,"borderColor":"black"},{"type":"text","text":"MOVE","x":50,"y":790,"sizeFont":"20px Arial","color":"white","align":"left","baseline":"bottom"},{"type":"text","text":"SELECT","x":1270,"y":790,"sizeFont":"20px Arial","color":"white","align":"right","baseline":"bottom"},{"type":"text","text":"Classic Deck News","x":732,"y":30,"sizeFont":"30px Arial","color":"white","align":"center","baseline":"alphabetic"}];
cGL.buttons = {"button5120":{"x":17,"y":55,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Home","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"white","color":"#3D4450","borderColor":"#3D4450","cornerRadius":10,"pressedTime":0,"notPressedTime":65870,"PREVIOUSPRESSED":false},"button5378":{"x":17,"y":105,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Scripts","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"white","color":"#3D4450","borderColor":"#3D4450","cornerRadius":10,"pressedTime":0,"notPressedTime":38843,"PREVIOUSPRESSED":false},"button7625":{"x":17,"y":155,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Utilities","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"white","color":"#3D4450","borderColor":"#3D4450","cornerRadius":10,"pressedTime":0,"notPressedTime":9548,"PREVIOUSPRESSED":false},"button7892":{"x":17,"y":205,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Update","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"white","color":"#3D4450","borderColor":"#3D4450","cornerRadius":10,"pressedTime":0,"notPressedTime":9548,"PREVIOUSPRESSED":false}};

function game() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (cGL.buttons.button5120.clickOff) {
        window.location.href = "/";
    }
}

function render() {
    cGL.clear();
    if (location.pathname == "/") {
        cGL.importUI(uiArrayOne);
        cGL.drawImage("Analog", 5, 760, 40, 40);
        cGL.drawImage("A", 1150, 760, 40, 40);
        cGL.drawText(username, 0, 760, "20px Arial", "white", "left", "bottom");
    }
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