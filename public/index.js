const scriptsUrl = "https://cart1416.github.io/Classic-Deck/scripts.json";
const scriptsUrlBase = "https://cart1416.github.io/Classic-Deck/scripts/";
const latestVersionUrl = "https://cart1416.github.io/Classic-Deck/version.txt";

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

var runningInPyInstaller = false;
fetch('/compiledornot')
    .then(response => response.json())
    .then(data => {
        if (data.status == "yes") {
            runningInPyInstaller = true;
        } else {
            runningInPyInstaller = false;
        }
    })
    .catch(error => console.error('Error checking compiledornot:', error));

var addingRom = false;
var checkingForUpdates = false;

const uiArrayHome = [{"type":"box","x":0,"y":0,"width":9999,"height":9999,"color":"#0E141B","cornerRadius":0,"borderWidth":0,"borderColor":"black"},{"type":"box","x":-5,"y":-5,"width":190,"height":9999,"color":"#24282E","cornerRadius":0,"borderWidth":0,"borderColor":"black"},{"type":"text","text":"Classic Deck","x":0,"y":0,"sizeFont":"30px Arial","color":"white","align":"left","baseline":"top"},{"type":"box","x":185,"y":0,"width":9999,"height":200,"color":"#2A303B","cornerRadius":0,"borderWidth":0,"borderColor":"black"},{"type":"box","x":-5,"y":760,"width":1290,"height":100,"color":"black","cornerRadius":0,"borderWidth":0,"borderColor":"black"},{"type":"text","text":"MOVE","x":50,"y":790,"sizeFont":"20px Arial","color":"white","align":"left","baseline":"bottom"},{"type":"text","text":"SELECT","x":1270,"y":790,"sizeFont":"20px Arial","color":"white","align":"right","baseline":"bottom"},{"type":"text","text":"Classic Deck News","x":732,"y":30,"sizeFont":"30px Arial","color":"white","align":"center","baseline":"alphabetic"},{"type":"box","x":205,"y":220,"width":120,"height":180,"color":"DarkGray","cornerRadius":0,"borderWidth":3,"borderColor":"black"},{"type":"box","x":345,"y":220,"width":120,"height":180,"color":"DarkGray","cornerRadius":0,"borderWidth":3,"borderColor":"black"},{"type":"box","x":485,"y":220,"width":120,"height":180,"color":"DarkGray","cornerRadius":0,"borderWidth":3,"borderColor":"black"}];
const uiArrayConsolePage = [{"type":"box","x":0,"y":0,"width":9999,"height":9999,"color":"#0E141B","cornerRadius":0,"borderWidth":0,"borderColor":"black"},{"type":"box","x":-5,"y":-5,"width":190,"height":9999,"color":"#24282E","cornerRadius":0,"borderWidth":0,"borderColor":"black"},{"type":"text","text":"Classic Deck","x":0,"y":0,"sizeFont":"30px Arial","color":"white","align":"left","baseline":"top"},{"type":"box","x":185,"y":0,"width":9999,"height":200,"color":"#2A303B","cornerRadius":0,"borderWidth":0,"borderColor":"black"},{"type":"box","x":-5,"y":760,"width":1290,"height":100,"color":"black","cornerRadius":0,"borderWidth":0,"borderColor":"black"},{"type":"text","text":"MOVE","x":50,"y":790,"sizeFont":"20px Arial","color":"white","align":"left","baseline":"bottom"},{"type":"text","text":"SELECT","x":1270,"y":790,"sizeFont":"20px Arial","color":"white","align":"right","baseline":"bottom"}];
const uiArrayScriptsPage = [{"type":"box","x":0,"y":0,"width":9999,"height":9999,"color":"#0E141B","cornerRadius":0,"borderWidth":0,"borderColor":"black"},{"type":"box","x":-5,"y":-5,"width":190,"height":9999,"color":"#24282E","cornerRadius":0,"borderWidth":0,"borderColor":"black"},{"type":"text","text":"Classic Deck","x":0,"y":0,"sizeFont":"30px Arial","color":"white","align":"left","baseline":"top"},{"type":"box","x":185,"y":0,"width":9999,"height":200,"color":"#2A303B","cornerRadius":0,"borderWidth":0,"borderColor":"black"},{"type":"box","x":-5,"y":760,"width":1290,"height":100,"color":"black","cornerRadius":0,"borderWidth":0,"borderColor":"black"},{"type":"text","text":"MOVE","x":50,"y":790,"sizeFont":"20px Arial","color":"white","align":"left","baseline":"bottom"},{"type":"text","text":"SELECT","x":1270,"y":790,"sizeFont":"20px Arial","color":"white","align":"right","baseline":"bottom"},{"type":"text","text":"Classic Deck Scripts","x":732,"y":30,"sizeFont":"30px Arial","color":"white","align":"center","baseline":"alphabetic"}];
if (location.pathname == "/") {
    cGL.buttons = {"button5120":{"x":17,"y":55,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Home","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"black","color":"#FFFFFF","borderColor":"#FFFFFF","cornerRadius":10,"pressedTime":0,"notPressedTime":1538,"PREVIOUSPRESSED":false},"button5378":{"x":17,"y":105,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Scripts","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"white","color":"#3D4450","borderColor":"#3D4450","cornerRadius":10,"pressedTime":0,"notPressedTime":10141,"PREVIOUSPRESSED":false},"button7625":{"x":17,"y":155,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Utilities","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"white","color":"#3D4450","borderColor":"#3D4450","cornerRadius":10,"pressedTime":0,"notPressedTime":9857,"PREVIOUSPRESSED":false},"button7892":{"x":17,"y":205,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Settings","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"white","color":"#3D4450","borderColor":"#3D4450","cornerRadius":10,"pressedTime":0,"notPressedTime":8603,"PREVIOUSPRESSED":false},"button218":{"x":215,"y":230,"width":100,"height":160,"pressed":false,"hover":false,"visible":false,"text":"NES","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"black","color":"white","borderColor":"black","cornerRadius":0,"pressedTime":0,"notPressedTime":35813,"PREVIOUSPRESSED":false},"button3903":{"x":355,"y":230,"width":100,"height":160,"pressed":false,"hover":false,"visible":false,"text":"SNES","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"black","color":"white","borderColor":"black","cornerRadius":0,"pressedTime":0,"notPressedTime":35646,"PREVIOUSPRESSED":false},"button8945":{"x":495,"y":230,"width":100,"height":160,"pressed":false,"hover":false,"visible":false,"text":"N64","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"black","color":"white","borderColor":"black","cornerRadius":0,"pressedTime":0,"notPressedTime":35549,"PREVIOUSPRESSED":false},"button362":{"x":17,"y":255,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Update","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"white","color":"#3D4450","borderColor":"#3D4450","cornerRadius":10,"pressedTime":0,"notPressedTime":8909,"PREVIOUSPRESSED":false},"button9620":{"x":17,"y":680,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Restart Steam","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"white","color":"#3D4450","borderColor":"#3D4450","cornerRadius":10,"pressedTime":0,"notPressedTime":1032,"PREVIOUSPRESSED":false}};
}
if (location.pathname == "/console") {
    cGL.buttons = {"button5120":{"x":17,"y":55,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Home","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"black","color":"#FFFFFF","borderColor":"#FFFFFF","cornerRadius":10,"pressedTime":0,"notPressedTime":15101,"PREVIOUSPRESSED":false},"button5378":{"x":17,"y":105,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Scripts","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"white","color":"#3D4450","borderColor":"#3D4450","cornerRadius":10,"pressedTime":0,"notPressedTime":23704,"PREVIOUSPRESSED":false},"button7625":{"x":17,"y":155,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Utilities","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"white","color":"#3D4450","borderColor":"#3D4450","cornerRadius":10,"pressedTime":0,"notPressedTime":23420,"PREVIOUSPRESSED":false},"button7892":{"x":17,"y":205,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Settings","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"white","color":"#3D4450","borderColor":"#3D4450","cornerRadius":10,"pressedTime":0,"notPressedTime":22166,"PREVIOUSPRESSED":false},"button362":{"x":17,"y":255,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Update","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"white","color":"#3D4450","borderColor":"#3D4450","cornerRadius":10,"pressedTime":0,"notPressedTime":2057,"PREVIOUSPRESSED":false},"button7930":{"x":200,"y":215,"width":200,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Add Rom to Steam","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"white","color":"#1A9FFF","borderColor":"#1A9FFF","cornerRadius":10,"pressedTime":0,"notPressedTime":2057,"PREVIOUSPRESSED":false},"button9620":{"x":17,"y":680,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Restart Steam","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"white","color":"#3D4450","borderColor":"#3D4450","cornerRadius":10,"pressedTime":0,"notPressedTime":1032,"PREVIOUSPRESSED":false}};
}
if (location.pathname == "/scripts") {
    cGL.buttons = {"button5120":{"x":17,"y":55,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Home","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"white","color":"#3D4450","borderColor":"#3D4450","cornerRadius":10,"pressedTime":0,"notPressedTime":55344,"PREVIOUSPRESSED":false},"button5378":{"x":17,"y":105,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Scripts","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"black","color":"white","borderColor":"white","cornerRadius":10,"pressedTime":0,"notPressedTime":56501,"PREVIOUSPRESSED":false},"button7625":{"x":17,"y":155,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Utilities","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"white","color":"#3D4450","borderColor":"#3D4450","cornerRadius":10,"pressedTime":0,"notPressedTime":131340,"PREVIOUSPRESSED":false},"button7892":{"x":17,"y":205,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Settings","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"white","color":"#3D4450","borderColor":"#3D4450","cornerRadius":10,"pressedTime":0,"notPressedTime":130086,"PREVIOUSPRESSED":false},"button362":{"x":17,"y":255,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Update","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"white","color":"#3D4450","borderColor":"#3D4450","cornerRadius":10,"pressedTime":0,"notPressedTime":1032,"PREVIOUSPRESSED":false},"button7167":{"x":1080,"y":215,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Open","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"white","color":"#3D4450","borderColor":"#3D4450","cornerRadius":10,"pressedTime":0,"notPressedTime":47851,"PREVIOUSPRESSED":false},"button7501":{"x":1080,"y":275,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Open","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"white","color":"#3D4450","borderColor":"#3D4450","cornerRadius":10,"pressedTime":0,"notPressedTime":97344,"PREVIOUSPRESSED":false},"button335":{"x":1080,"y":335,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Open","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"white","color":"#3D4450","borderColor":"#3D4450","cornerRadius":10,"pressedTime":0,"notPressedTime":97322,"PREVIOUSPRESSED":false},"button2289":{"x":1080,"y":395,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Open","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"white","color":"#3D4450","borderColor":"#3D4450","cornerRadius":10,"pressedTime":0,"notPressedTime":97300,"PREVIOUSPRESSED":false},"button7286":{"x":1080,"y":455,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Open","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"white","color":"#3D4450","borderColor":"#3D4450","cornerRadius":10,"pressedTime":0,"notPressedTime":97283,"PREVIOUSPRESSED":false},"button8937":{"x":1080,"y":515,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Open","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"white","color":"#3D4450","borderColor":"#3D4450","cornerRadius":10,"pressedTime":0,"notPressedTime":97267,"PREVIOUSPRESSED":false},"button5815":{"x":1080,"y":575,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Open","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"white","color":"#3D4450","borderColor":"#3D4450","cornerRadius":10,"pressedTime":0,"notPressedTime":97241,"PREVIOUSPRESSED":false},"button9261":{"x":1080,"y":635,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Open","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"white","color":"#3D4450","borderColor":"#3D4450","cornerRadius":10,"pressedTime":0,"notPressedTime":97214,"PREVIOUSPRESSED":false},"button8868":{"x":1080,"y":695,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Open","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"white","color":"#3D4450","borderColor":"#3D4450","cornerRadius":10,"pressedTime":0,"notPressedTime":1556,"PREVIOUSPRESSED":false},"button8652":{"x":236,"y":695,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Back","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"white","color":"#3D4450","borderColor":"#3D4450","cornerRadius":10,"pressedTime":0,"notPressedTime":2176,"PREVIOUSPRESSED":false},"button9620":{"x":17,"y":680,"width":150,"height":45,"pressed":false,"hover":false,"visible":true,"text":"Restart Steam","clickOn":false,"clickOff":false,"textFont":"16px Arial","textColor":"white","color":"#3D4450","borderColor":"#3D4450","cornerRadius":10,"pressedTime":0,"notPressedTime":1032,"PREVIOUSPRESSED":false}};
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

async function runScript(url) {
    try {
        const response = await fetch(`/executeonlinescript?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        console.log('Script Running:', data);
        return data;
    } catch (error) {
        console.error('Error adding ROM to Steam:', error);
        return null;
    }
}

var page = 1;
var scriptsCurrentFolder = "/";
var scriptsJSON = {};
async function getScripts() {
    const response = await fetch(scriptsUrl);
    const data = await response.json();
    scriptsJSON = data;
}

getScripts();

var item1 = "";
var item2 = "";
var item3 = "";
var item4 = "";
var item5 = "";
var item6 = "";
var item7 = "";
var item8 = "";
var item9 = "";

var version = "";
fetch('/version')
    .then(response => response.json())
    .then(data => {
        version = data.version;
    })
    .catch(error => console.error('Error fetching Version:', error));


async function checkForUpdates() {
    try {
        const response = await fetch('/update');
        const data = await response.json();
        console.log('Update Checked:', data);
        return data;
    } catch (error) {
        console.error('Error checking for updates:', error);
        return null;
    }
}

async function restartSteam() {
    try {
        const response = await fetch('/restart-steam');
        const data = await response.json();
        console.log('Steam Restarted:', data);
        return data;
    } catch (error) {
        console.error('Error restarting Steam:', error);
        return null;
    }
}

async function game() {
    try {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
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
        if (location.pathname == "/scripts") {
            if (scriptsCurrentFolder == "/") {
                if (cGL.buttons.button7167.clickOff) {
                    scriptsCurrentFolder = item1;
                }
                if (cGL.buttons.button7501.clickOff) {
                    scriptsCurrentFolder = item2;
                }
                if (cGL.buttons.button335.clickOff) {
                    scriptsCurrentFolder = item3;
                }
                if (cGL.buttons.button2289.clickOff) {
                    scriptsCurrentFolder = item4;
                }
                if (cGL.buttons.button7286.clickOff) {
                    scriptsCurrentFolder = item5;
                }
                if (cGL.buttons.button8937.clickOff) {
                    scriptsCurrentFolder = item6;
                }
                if (cGL.buttons.button5815.clickOff) {
                    scriptsCurrentFolder = item7;
                }
                if (cGL.buttons.button9261.clickOff) {
                    scriptsCurrentFolder = item8;
                }
                if (cGL.buttons.button8868.clickOff) {
                    scriptsCurrentFolder = item9;
                }
            } else {
                if (cGL.buttons.button8652.clickOff) {
                    scriptsCurrentFolder = "/";
                }
                if (cGL.buttons.button7167.clickOff) {
                    runScript(`${scriptsUrlBase}${scriptsCurrentFolder}/${item1}`);
                }
                if (cGL.buttons.button7501.clickOff) {
                    runScript(`${scriptsUrlBase}${scriptsCurrentFolder}/${item2}`);
                }
                if (cGL.buttons.button335.clickOff) {
                    runScript(`${scriptsUrlBase}${scriptsCurrentFolder}/${item3}`);
                }
                if (cGL.buttons.button2289.clickOff) {
                    runScript(`${scriptsUrlBase}${scriptsCurrentFolder}/${item4}`);
                }
                if (cGL.buttons.button7286.clickOff) {
                    runScript(`${scriptsUrlBase}${scriptsCurrentFolder}/${item5}`);
                }
                if (cGL.buttons.button8937.clickOff) {
                    runScript(`${scriptsUrlBase}${scriptsCurrentFolder}/${item6}`);
                }
                if (cGL.buttons.button5815.clickOff) {
                    runScript(`${scriptsUrlBase}${scriptsCurrentFolder}/${item7}`);
                }
                if (cGL.buttons.button9261.clickOff) {
                    runScript(`${scriptsUrlBase}${scriptsCurrentFolder}/${item8}`);
                }
                if (cGL.buttons.button8868.clickOff) {
                    runScript(`${scriptsUrlBase}${scriptsCurrentFolder}/${item9}`);
                }
            }
        }
        if (cGL.buttons.button5120.clickOff) {
            window.location.href = "/";
        }
        if (cGL.buttons.button5378.clickOff) {
            window.location.href = "/scripts";
        }
        if (cGL.buttons.button362.clickOff) {
            checkingForUpdates = true;
            if (runningInPyInstaller) {
                await checkForUpdates();
                window.close();
                console.log("Update requested.");
            } else {
                console.log("Not running in PyInstaller.");
                alert("You must use the official release version of Classic Deck, you are currently running from source.");
                checkingForUpdates = false;
            }
            render();
        }
        if (cGL.buttons.button9620.clickOff) {
            restartSteam();
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
        cGL.drawText(version, 0, 30, "15px Arial", "LightGrey", "left", "top");
        cGL.drawImage("NES", 205, 220, 120, 180);
        cGL.drawImage("SNES", 345, 220, 120, 180);
        cGL.drawImage("N64", 485, 220, 120, 180);
    }
    if (location.pathname == "/console") {
        cGL.importUI(uiArrayConsolePage);
        cGL.drawText(version, 0, 30, "15px Arial", "LightGrey", "left", "top");
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
        cGL.drawText(username, 0, 760, "20px Arial", "white", "left", "bottom");
        cGL.drawImage("Analog", 5, 760, 40, 40);
        cGL.drawImage("A", 1150, 760, 40, 40);
    }
    if (location.pathname == "/scripts") {
        cGL.importUI(uiArrayScriptsPage);
        cGL.drawText(version, 0, 30, "15px Arial", "LightGrey", "left", "top");
        cGL.buttons.button7167.visible = false;
        cGL.buttons.button7501.visible = false;
        cGL.buttons.button335.visible = false;
        cGL.buttons.button2289.visible = false;
        cGL.buttons.button7286.visible = false;
        cGL.buttons.button8937.visible = false;
        cGL.buttons.button5815.visible = false;
        cGL.buttons.button9261.visible = false;
        cGL.buttons.button8868.visible = false;
        cGL.buttons.button7167.text = "Open";
        cGL.buttons.button7501.text = "Open";
        cGL.buttons.button335.text = "Open";
        cGL.buttons.button2289.text = "Open";
        cGL.buttons.button7286.text = "Open";
        cGL.buttons.button8937.text = "Open";
        cGL.buttons.button5815.text = "Open";
        cGL.buttons.button9261.text = "Open";
        cGL.buttons.button8868.text = "Open";
        cGL.buttons.button8652.visible = false;
        let h = 1;
        var folderToSearch = scriptsJSON.scripts;
        if (scriptsCurrentFolder != "/") {
            folderToSearch = scriptsJSON.scripts[scriptsCurrentFolder];
            cGL.buttons.button7167.text = "Run";
            cGL.buttons.button7501.text = "Run";
            cGL.buttons.button335.text = "Run";
            cGL.buttons.button2289.text = "Run";
            cGL.buttons.button7286.text = "Run";
            cGL.buttons.button8937.text = "Run";
            cGL.buttons.button5815.text = "Run";
            cGL.buttons.button9261.text = "Run";
            cGL.buttons.button8868.text = "Run";
            cGL.buttons.button8652.visible = true;
        }
        for (const scriptName in folderToSearch) {
            if (folderToSearch.hasOwnProperty(scriptName)) { //text is 237 and then add 55
                if ((h >= (page * 9 - 9)) && (h < (page * 9))) {
                    cGL.drawText(scriptName, canvas.width / 2, 237 + (55 * (h - 1)), "20px Arial", "white", "center");
                    if (h == 1) {
                        cGL.buttons["button7167"].visible = true;
                        item1 = scriptName;
                    }
                    if (h == 2) {
                        cGL.buttons["button7501"].visible = true;
                        item2 = scriptName;
                    }
                    if (h == 3) {
                        cGL.buttons["button335"].visible = true;
                        item3 = scriptName;
                    }
                    if (h == 4) {
                        cGL.buttons["button2289"].visible = true;
                        item4 = scriptName;
                    }
                    if (h == 5) {
                        cGL.buttons["button7286"].visible = true;
                        item5 = scriptName;
                    }
                    if (h == 6) {
                        cGL.buttons["button8937"].visible = true;
                        item6 = scriptName;
                    }
                    if (h == 7) {
                        cGL.buttons["button5815"].visible = true;
                        item7 = scriptName;
                    }
                    if (h == 8) {
                        cGL.buttons["button9261"].visible = true;
                        item8 = scriptName;
                    }
                    if (h == 9) {
                        cGL.buttons["button8868"].visible = true;
                        item9 = scriptName;
                    }
                    ++h;
                }
            }
        }
        cGL.drawText(username, 0, 760, "20px Arial", "white", "left", "bottom");
        cGL.drawImage("Analog", 5, 760, 40, 40);
        cGL.drawImage("A", 1150, 760, 40, 40);
    }
    if (addingRom) {
        cGL.drawBox(canvas.width / 2 - 200, canvas.height / 2 - 50, 400, 100, "white", 2, "white");
        cGL.drawText("Adding ROM to Steam", canvas.width / 2, canvas.height / 2, "30px Arial", "black", "center", "middle");
    }
    if (checkingForUpdates) {
        cGL.drawBox(canvas.width / 2 - 200, canvas.height / 2 - 50, 400, 100, "white", 2, "white");
        cGL.drawText("Updating...", canvas.width / 2, canvas.height / 2, "30px Arial", "black", "center", "middle");
        cGL.drawText("Wait a few minutes", canvas.width / 2, canvas.height / 2 + 30, "20px Arial", "black", "center", "middle");
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