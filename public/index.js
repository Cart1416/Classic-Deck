cGL.initialize("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
cGL.gamepadNavigationMode = 2;

cGL.loadImage("A", "/images/a.png");
cGL.loadImage("B", "/images/b.png");
cGL.loadImage("Analog", "/images/analog.png");

cGL.loadImage("NES", "/images/NES.png");
cGL.loadImage("SNES", "/images/SNES.png");
cGL.loadImage("N64", "/images/N64.png");

cGL.loadImage("NESWide", "/images/neswide.jpg");
cGL.loadImage("SNESWide", "/images/sneswide.jpg");
cGL.loadImage("N64Wide", "/images/n64wide.jpg");

const params = new URLSearchParams(window.location.search);
var system;
if (params.has('console')) {
    system = params.get('console');
}

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

var addingRom = false;

const uiArrayHome = [{"type":"box","x":0,"y":0,"width":9999,"height":9999,"color":"#0E141B","cornerRadius":0,"borderWidth":0,"borderColor":"black"},{"type":"box","x":-5,"y":-5,"width":190,"height":9999,"color":"#24282E","cornerRadius":0,"borderWidth":0,"borderColor":"black"},{"type":"text","text":"Classic Deck","x":0,"y":0,"sizeFont":"30px Arial","color":"white","align":"left","baseline":"top"},{"type":"text","text":"Beta 1","x":0,"y":30,"sizeFont":"15px Arial","color":"LightGrey","align":"left","baseline":"top"},{"type":"box","x":185,"y":0,"width":9999,"height":200,"color":"#2A303B","cornerRadius":0,"borderWidth":0,"borderColor":"black"},{"type":"box","x":-5,"y":760,"width":1290,"height":100,"color":"black","cornerRadius":0,"borderWidth":0,"borderColor":"black"},{"type":"text","text":"MOVE","x":50,"y":790,"sizeFont":"20px Arial","color":"white","align":"left","baseline":"bottom"},{"type":"text","text":"SELECT","x":1270,"y":790,"sizeFont":"20px Arial","color":"white","align":"right","baseline":"bottom"},{"type":"text","text":"Classic Deck News","x":732,"y":30,"sizeFont":"30px Arial","color":"white","align":"center","baseline":"alphabetic"},{"type":"box","x":205,"y":220,"width":120,"height":180,"color":"DarkGray","cornerRadius":0,"borderWidth":3,"borderColor":"black"},{"type":"box","x":345,"y":220,"width":120,"height":180,"color":"DarkGray","cornerRadius":0,"borderWidth":3,"borderColor":"black"},{"type":"box","x":485,"y":220,"width":120,"height":180,"color":"DarkGray","cornerRadius":0,"borderWidth":3,"borderColor":"black"}];
const uiArrayConsolePage = [{"type":"box","x":0,"y":0,"width":9999,"height":9999,"color":"#0E141B","cornerRadius":0,"borderWidth":0,"borderColor":"black"},{"type":"box","x":-5,"y":-5,"width":190,"height":9999,"color":"#24282E","cornerRadius":0,"borderWidth":0,"borderColor":"black"},{"type":"text","text":"Classic Deck","x":0,"y":0,"sizeFont":"30px Arial","color":"white","align":"left","baseline":"top"},{"type":"text","text":"Beta 1","x":0,"y":30,"sizeFont":"15px Arial","color":"LightGrey","align":"left","baseline":"top"},{"type":"box","x":185,"y":0,"width":9999,"height":200,"color":"#2A303B","cornerRadius":0,"borderWidth":0,"borderColor":"black"},{"type":"box","x":-5,"y":760,"width":1290,"height":100,"color":"black","cornerRadius":0,"borderWidth":0,"borderColor":"black"},{"type":"text","text":"MOVE","x":50,"y":790,"sizeFont":"20px Arial","color":"white","align":"left","baseline":"bottom"},{"type":"text","text":"SELECT","x":1270,"y":790,"sizeFont":"20px Arial","color":"white","align":"right","baseline":"bottom"}];
if (location.pathname == "/") {
    cGL.buttons = {"button5120":{"x":17,"y":55,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Home","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"black","color":"#FFFFFF","borderColor":"#FFFFFF","cornerRadius":10,"pressedTime":0,"notPressedTime":1538,"PREVIOUSPRESSED":false},"button5378":{"x":17,"y":105,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Scripts","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"white","color":"#3D4450","borderColor":"#3D4450","cornerRadius":10,"pressedTime":0,"notPressedTime":10141,"PREVIOUSPRESSED":false},"button7625":{"x":17,"y":155,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Utilities","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"white","color":"#3D4450","borderColor":"#3D4450","cornerRadius":10,"pressedTime":0,"notPressedTime":9857,"PREVIOUSPRESSED":false},"button7892":{"x":17,"y":205,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Settings","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"white","color":"#3D4450","borderColor":"#3D4450","cornerRadius":10,"pressedTime":0,"notPressedTime":8603,"PREVIOUSPRESSED":false},"button218":{"x":215,"y":230,"width":100,"height":160,"pressed":false,"hover":false,"visible":false,"text":"NES","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"black","color":"white","borderColor":"black","cornerRadius":0,"pressedTime":0,"notPressedTime":35813,"PREVIOUSPRESSED":false},"button3903":{"x":355,"y":230,"width":100,"height":160,"pressed":false,"hover":false,"visible":false,"text":"SNES","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"black","color":"white","borderColor":"black","cornerRadius":0,"pressedTime":0,"notPressedTime":35646,"PREVIOUSPRESSED":false},"button8945":{"x":495,"y":230,"width":100,"height":160,"pressed":false,"hover":false,"visible":false,"text":"N64","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"black","color":"white","borderColor":"black","cornerRadius":0,"pressedTime":0,"notPressedTime":35549,"PREVIOUSPRESSED":false},"button362":{"x":17,"y":255,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Update","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"white","color":"#3D4450","borderColor":"#3D4450","cornerRadius":10,"pressedTime":0,"notPressedTime":8909,"PREVIOUSPRESSED":false}};
}
if (location.pathname == "/console") {
    cGL.buttons = {"button5120":{"x":17,"y":55,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Home","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"black","color":"#FFFFFF","borderColor":"#FFFFFF","cornerRadius":10,"pressedTime":0,"notPressedTime":15101,"PREVIOUSPRESSED":false},"button5378":{"x":17,"y":105,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Scripts","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"white","color":"#3D4450","borderColor":"#3D4450","cornerRadius":10,"pressedTime":0,"notPressedTime":23704,"PREVIOUSPRESSED":false},"button7625":{"x":17,"y":155,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Utilities","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"white","color":"#3D4450","borderColor":"#3D4450","cornerRadius":10,"pressedTime":0,"notPressedTime":23420,"PREVIOUSPRESSED":false},"button7892":{"x":17,"y":205,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Settings","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"white","color":"#3D4450","borderColor":"#3D4450","cornerRadius":10,"pressedTime":0,"notPressedTime":22166,"PREVIOUSPRESSED":false},"button362":{"x":17,"y":255,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Update","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"white","color":"#3D4450","borderColor":"#3D4450","cornerRadius":10,"pressedTime":0,"notPressedTime":2057,"PREVIOUSPRESSED":false},"button7930":{"x":200,"y":215,"width":200,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Add Rom to Steam","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"white","color":"#1A9FFF","borderColor":"#1A9FFF","cornerRadius":10,"pressedTime":0,"notPressedTime":2057,"PREVIOUSPRESSED":false}};
}

async function openFilePicker() {
    try {
        const response = await fetch(`/select-rom/${system}`);
        const data = await response.json();
        console.log('ROM selected:', data);
        return data.file_path;
    } catch (error) {
        console.error('Error selecting ROM:', error);
        return "";
    }
}

async function addToSteam(romPath) {
    try {
        const gameName = prompt("Enter the name of the game: ");
        const response = await fetch(`/add-to-steam/${system}?rom=${encodeURIComponent(romPath)}&gamename=${gameName}`);
        const data = await response.json();
        console.log('ROM added to Steam:', data);
        return data;
    } catch (error) {
        console.error('Error adding ROM to Steam:', error);
        return null;
    }
}

async function addRom() {
    addingRom = true;
    const romPath = await openFilePicker();
    if (romPath) {
        const result = await addToSteam(romPath);
        if (result === "success") {
            console.log("ROM added successfully.");
        } else {
            console.error("Error adding ROM.");
        }
    }
    addingRom = false;
}

function game() {
    try {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if (cGL.buttons.button5120.clickOff) {
            window.location.href = "/";
        }
        if (location.pathname == "/") {
            if (cGL.buttons.button218.clickOff) {
                window.location.href = "/console?console=nes";
            }
            if (cGL.buttons.button3903.clickOff) {
                window.location.href = "/console?console=snes";
            }
            if (cGL.buttons.button8945.clickOff) {
                window.location.href = "/console?console=n64";
            }
        }
        if (location.pathname == "/console") {
            if (cGL.buttons.button7930.clickOff) {
                addingRom = true;
                render();
                addRom();
            }
        }
    } catch (error) {
        console.error(error);
    }
}

function render() {
    cGL.clear();
    cGL.drawBackground("#0E141B");
    if (location.pathname == "/") {
        cGL.importUI(uiArrayHome);
        cGL.drawImage("Analog", 5, 760, 40, 40);
        cGL.drawImage("A", 1150, 760, 40, 40);
        cGL.drawText(username, 0, 760, "20px Arial", "white", "left", "bottom");
        cGL.drawImage("NES", 205, 220, 120, 180);
        cGL.drawImage("SNES", 345, 220, 120, 180);
        cGL.drawImage("N64", 485, 220, 120, 180);
    }
    if (location.pathname == "/console") {
        cGL.importUI(uiArrayConsolePage);
        if (system == "nes") {
            cGL.drawImage("NESWide", 185, 0, canvas.width - 185, 200);
            cGL.drawText("NES", 732, 90, "90px Arial", "white", "center", "alphabetic");
            cGL.drawText("Emulated with RetroArch Mesen Core", 420, 238, "15px Arial", "white", "left", "middle");
        }
        if (system == "snes") {
            cGL.drawImage("SNESWide", 185, 0, canvas.width - 185, 200);
            cGL.drawText("SNES", 732, 90, "90px Arial", "white", "center", "alphabetic");
            cGL.drawText("Emulated with RetroArch bsnes HD Core", 420, 238, "15px Arial", "white", "left", "middle");
        }
        if (system == "n64") {
            cGL.drawImage("N64Wide", 185, 0, canvas.width - 185, 200);
            cGL.drawText("N64", 732, 90, "90px Arial", "white", "center", "alphabetic");
            cGL.drawText("Emulated with RetroArch Mupen64 Core", 420, 238, "15px Arial", "white", "left", "middle");
        }
        cGL.drawImage("Analog", 5, 760, 40, 40);
        cGL.drawImage("A", 1150, 760, 40, 40);
    }
    if (addingRom) {
        cGL.drawBox(canvas.width / 2 - 200, canvas.height / 2 - 50, 400, 100, "white", 2, "white");
        cGL.drawText("Adding ROM to Steam", canvas.width / 2, canvas.height / 2, "30px Arial", "black", "center", "middle");
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