var canvas;
var ctx;
var canvasWidth = 0;
var canvasHeight = 0;
var canvasCenterHorizontal = 0;
var canvasCenterVertical = 0;

var cGL = {
    images: {},
    keysDown: {},
    gamepadMappingFirefox: {
        buttons: [
            "a",
            "b",
            "y",
            "x",
            "l1",
            "r1",
            "l2",
            "r2",
            "select",
            "start",
            "guide",
            "l3",
            "r3"
        ],
        axes: [
            "lx",
            "ly",
            "lt",
            "rx",
            "ry",
            "rt",
            "dpadx",
            "dpady"
        ]
    },
    gamepadMappingChrome: {
        buttons: [
            "a",
            "b",
            "x",
            "y",
            "l1",
            "r1",
            "l2",
            "r2",
            "select",
            "start",
            "l3",
            "r3",
            "up",
            "down",
            "left",
            "right",
            "guide"
        ],
        axes: [
            "lx",
            "ly",
            "lt",
            "rx",
            "ry",
            "rt",
            "dpadx",
            "dpady"
        ]
    },
    gamepads: [
        {
            buttons: {
                a: false,
                b: false,
                x: false,
                y: false,
                left: false,
                right: false,
                up: false,
                down: false,
                guide: false,
                start: false,
                select: false,
                l1: false,
                r1: false,
                l2: false,
                r2: false,
                l3: false,
                r3: false
            },
            axes: {
                lx: 0,
                ly: 0,
                rx: 0,
                ry: 0,
                lt: 0,
                rt: 0
            },
            connected: false,
            vendor: "Generic" // sony xbox nintendo or generic
        },
        {
            buttons: {
                a: false,
                b: false,
                x: false,
                y: false,
                left: false,
                right: false,
                up: false,
                down: false,
                guide: false,
                start: false,
                select: false,
                l1: false,
                r1: false,
                l2: false,
                r2: false,
                l3: false,
                r3: false
            },
            axes: {
                lx: 0,
                ly: 0,
                rx: 0,
                ry: 0,
                lt: 0,
                rt: 0
            },
            connected: false,
            vendor: "Generic"
        },
        {
            buttons: {
                a: false,
                b: false,
                x: false,
                y: false,
                left: false,
                right: false,
                up: false,
                down: false,
                guide: false,
                start: false,
                select: false,
                l1: false,
                r1: false,
                l2: false,
                r2: false,
                l3: false,
                r3: false
            },
            axes: {
                lx: 0,
                ly: 0,
                rx: 0,
                ry: 0,
                lt: 0,
                rt: 0
            },
            connected: false,
            vendor: "Generic"
        },
        {
            buttons: {
                a: false,
                b: false,
                x: false,
                y: false,
                left: false,
                right: false,
                up: false,
                down: false,
                guide: false,
                start: false,
                select: false,
                l1: false,
                r1: false,
                l2: false,
                r2: false,
                l3: false,
                r3: false
            },
            axes: {
                lx: 0,
                ly: 0,
                rx: 0,
                ry: 0,
                lt: 0,
                rt: 0
            },
            connected: false,
            vendor: "Generic"
        }
    ],
    joyStickToDPad: false,
    gamepadNavigationMode: 0, // 0 is normal gamepad, 1 will be ui navigation with dpad and a (not supported yet and might be buggy)
    // 2 is cursor navigation with joystick and A
    virtualCursor: {x: -50, y: -50}, // note: only p1 gets a cursor
    keyDown: false,
    objectGroups: {},
    buttons: {},
    soundInitialized: false,
    backgroundMusic: [],
    backgroundMusicInitialized: false,
    touched: false,
    playVideo: false,
    mousePos: {x: 0, y: 0},
    mouseDown: false,
    startedClicking: false,
    stoppedClicking: false,
    clickTime: 0,
    notClickTime: 3,
    mobile: false,
    userAgent: "",

    initialize: function(canvasid) {
        this.userAgent = navigator.userAgent;
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(this.userAgent)) {
            this.mobile = true;
        } else {
            this.mobile = false;
        }
        canvas = document.getElementById(canvasid);
        if (canvas.getContext) {
            ctx = canvas.getContext('2d');

            ctx.textAlign = "center";
            canvasWidth = canvas.offsetWidth;
            canvasHeight = canvas.offsetHeight;
            canvasCenterHorizontal = canvasWidth / 2;
            canvasCenterVertical = canvasHeight / 2;

            ctx.font = "30px Arial";
            ctx.fillText("cartGameLibrary has been Loaded", canvasWidth / 2, 50);
            ctx.textAlign = "left";
            setTimeout(() => {
                canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
                canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
                canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));

                // Add touch event listeners
                canvas.addEventListener("touchstart", this.handleTouchStart.bind(this), { passive: true });
                canvas.addEventListener("touchend", this.handleTouchEnd.bind(this), { passive: true });
                canvas.addEventListener("touchmove", this.handleTouchMove.bind(this), { passive: true });
            }, 1000);
        } else {
            console.log('Canvas is not supported in your browser.');
        }
    },

    handleMouseDown: function(event) {
        if (event.button == 0) {
            this.mouseDown = true;
            //this.handleButtonPress(event.offsetX, event.offsetY);
            //this.handleButtonPress();
            if (!this.backgroundMusicInitialized) {
                music = new Audio();
        	    this.backgroundMusic.push(music);
        	    this.backgroundMusicInitialized = true;
            }
            this.touched = true;
        }
    },

    handleMouseUp: function(event) {
        if (event.button == 0) {
            this.mouseDown = false;
            //this.handleButtonRelease(event.offsetX, event.offsetY);
            //this.handleButtonRelease();
            this.touched = false;
        }
    },

    handleMouseMove: function(event) {
        this.mousePos.x = event.offsetX;
        this.mousePos.y = event.offsetY;
    },

    // Function to check if the device is mobile
    isMobile: function() {
        return /Mobi|Android/i.test(navigator.userAgent);
    },

    handleTouchStart: function(event) {
        if (!this.isMobile()) return; // Only run if on mobile
        event.preventDefault();
        this.mouseDown = true;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;  // Scaling factor for width
        const scaleY = canvas.height / rect.height; // Scaling factor for height

        console.log("Touch start:", event.touches);  // Debugging log

        for (let i = 0; i < event.touches.length; i++) {
            const touch = event.touches[i];
            const x = (touch.clientX - rect.left) * scaleX;
            const y = (touch.clientY - rect.top) * scaleY;

            this.mousePos.x = x;
            this.mousePos.y = y;

            // Handle button press here if needed
            // this.handleButtonPress(x, y);
        }

        if (!this.backgroundMusicInitialized) {
            let music = new Audio();
            this.backgroundMusic.push(music);
            this.backgroundMusicInitialized = true;
        }
        this.touched = true;
    },

    handleTouchEnd: function(event) {
        if (!this.isMobile()) return; // Only run if on mobile
        event.preventDefault();

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;  // Scaling factor for width
        const scaleY = canvas.height / rect.height; // Scaling factor for height

        console.log("Touch end:", event.changedTouches);  // Debugging log

        for (let i = 0; i < event.changedTouches.length; i++) {
            const touch = event.changedTouches[i];
            const x = (touch.clientX - rect.left) * scaleX;
            const y = (touch.clientY - rect.top) * scaleY;

            this.mousePos.x = x;
            this.mousePos.y = y;

            // Handle button release here if needed
            // this.handleButtonRelease(x, y);
        }

        this.mouseDown = false; // Reset mouseDown after handling releases
        this.touched = false;
    },

    handleTouchMove: function(event) {
        if (!this.isMobile()) return; // Only run if on mobile
        event.preventDefault();

        const touch = event.touches[0];
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;  // Scaling factor for width
        const scaleY = canvas.height / rect.height; // Scaling factor for height

        const x = (touch.clientX - rect.left) * scaleX;
        const y = (touch.clientY - rect.top) * scaleY;

        this.mousePos.x = x;
        this.mousePos.y = y;

        console.log("Touch move:", this.mousePos);  // Debugging log

        // Handle hover state and update pressed state if necessary
        this.handleButtonHover(this.mousePos.x, this.mousePos.y);
    },

    handleButtonPress: function(x = this.mousePos.x, y = this.mousePos.y) {
        for (var buttonid in this.buttons) {
            var button = this.buttons[buttonid];
            if (x >= button.x && x <= button.x + button.width &&
                y >= button.y && y <= button.y + button.height) {
                if (!button.pressed) { // Only set clickOn if not already pressed
                    button.pressed = true;
                    button.clickOn = true; // Register click immediately
                    console.log("Button pressed:", buttonid);  // Debugging log
                }
            }
        }
    },

    handleButtonRelease: function(x = this.mousePos.x, y = this.mousePos.y) {
        for (var buttonid in this.buttons) {
            var button = this.buttons[buttonid];
            if (x >= button.x && x <= button.x + button.width &&
                y >= button.y && y <= button.y + button.height) {
                if (button.pressed) { // Only set clickOff if it was pressed
                    button.pressed = false;
                    button.clickOff = true; // Register release immediately
                    console.log("Button released:", buttonid);  // Debugging log
                }
            } else {
                // Ensure buttons not under the touch are released
                if (button.pressed) {
                    button.pressed = false;
                    button.clickOff = true; // Register release immediately
                }
            }
        }
    },

    handleButtonHover: function(x, y) {
        for (var buttonid in this.buttons) {
            var button = this.buttons[buttonid];
            button.hover = (x >= button.x && x <= button.x + button.width &&
                            y >= button.y && y <= button.y + button.height);
        }
    },

    updateGamepads: function() {
        const gamepads = navigator.getGamepads();
        const isFirefox = navigator.userAgent.includes("Firefox");
        const gamepadMapping = isFirefox ? this.gamepadMappingFirefox : this.gamepadMappingChrome;
        function getVendorFromId(id) {
            id = id.toLowerCase();
            if (id.includes("sony")) return "Sony";
            if (id.includes("xbox")) return "Xbox";
            if (id.includes("nintendo")) return "Nintendo";
            return "Generic";
        }
        for (let i = 0; i < gamepads.length; i++) {
            const gamepad = gamepads[i];
            if (gamepad) {
                this.gamepads[i].connected = true;
                this.gamepads[i].vendor = getVendorFromId(gamepad.id);
                for (let j = 0; j < gamepadMapping.buttons.length; j++) {
                    const button = gamepadMapping.buttons[j];
                    if (gamepad.buttons[j]) {
                        this.gamepads[i].buttons[button] = gamepad.buttons[j].pressed;
                    }
                }
                for (let k = 0; k < gamepadMapping.axes.length; k++) {
                    const axis = gamepadMapping.axes[k];
                    this.gamepads[i].axes[axis] = gamepad.axes[k];
                }
                if (isFirefox) {
                    const dpadxIndex = gamepadMapping.axes.indexOf("dpadx");
                    const dpadyIndex = gamepadMapping.axes.indexOf("dpady");
                    if (dpadxIndex !== -1 && dpadyIndex !== -1) {
                        this.gamepads[i].buttons.left = gamepad.axes[dpadxIndex] < -0.5;
                        this.gamepads[i].buttons.right = gamepad.axes[dpadxIndex] > 0.5;
                        this.gamepads[i].buttons.up = gamepad.axes[dpadyIndex] < -0.5;
                        this.gamepads[i].buttons.down = gamepad.axes[dpadyIndex] > 0.5;
                    }
                }
                if (this.joyStickToDPad) {
                    if (this.gamepads[i].axes.lx < -0.5) {
                        this.gamepads[i].buttons.left = true;
                    }
                    if (this.gamepads[i].axes.lx > 0.5) {
                        this.gamepads[i].buttons.right = true;
                    }
                    if (this.gamepads[i].axes.ly < -0.5) {
                        this.gamepads[i].buttons.up = true;
                    }
                    if (this.gamepads[i].axes.ly > 0.5) {
                        this.gamepads[i].buttons.down = true;
                    }
                }
            } else {
                this.gamepads[i].connected = false;
            }
        }
        if (gamepads.length == 0) {
            for (let i = 0; i < this.gamepads.length; i++) {
                this.gamepads[i].connected = false;
            }
        }
    },

    loop: function() {
        if (this.gamepadNavigationMode == 0) {
            this.virtualCursor = {x: -50, y: -50};
        } else if (this.gamepadNavigationMode == 1) {
            this.virtualCursor = {x: -50, y: -50};
        } else if (this.gamepadNavigationMode == 2) {
            if (this.gamepads[0].connected) {
                if (this.virtualCursor.x < 0) {
                    this.virtualCursor.x = 0;
                }
                if (this.virtualCursor.x > canvas.width) {
                    this.virtualCursor.x = canvas.width;
                }
                if (this.virtualCursor.y < 0) {
                    this.virtualCursor.y = 0;
                }
                if (this.virtualCursor.y > canvas.height) {
                    this.virtualCursor.y = canvas.height;
                }
                if (this.gamepads[0].axes.lx > 0.2 || this.gamepads[0].axes.lx < -0.2) {
                    this.virtualCursor.x += this.gamepads[0].axes.lx * 10;
                    this.mousePos.x = this.virtualCursor.x;
                }
                if (this.gamepads[0].axes.ly > 0.2 || this.gamepads[0].axes.ly < -0.2) {
                    this.virtualCursor.y += this.gamepads[0].axes.ly * 10;
                    this.mousePos.y = this.virtualCursor.y;
                }
                this.mouseDown = this.gamepads[0].buttons.a;
            }
        }
        // mouse code
        if (this.mouseDown) {
            ++this.clickTime;
            this.notClickTime = 0;
        } else {
            ++this.notClickTime;
            this.clickTime = 0;
        }
        if (this.clickTime == 1) {
            this.startedClicking = true;
        } else {
            this.startedClicking = false;
        }
        if (this.notClickTime == 1) {
            this.stoppedClicking = true;
        } else {
            this.stoppedClicking = false;
        }
        // button code
        for (var buttonid in this.buttons) {
            var button = this.buttons[buttonid];
            const isHovering = this.mousePos.x >= button.x && this.mousePos.x <= button.x + button.width &&
                               this.mousePos.y >= button.y && this.mousePos.y <= button.y + button.height;

            // Manage button states
            if (!isHovering && button.pressed) {
                button.pressed = false;
            }

            if (button.pressedTime == 1) {
                button.clickOn = true;
            } else {
                button.clickOn = false;
            }

            if (button.notPressedTime == 1) {
                button.clickOff = true;
            } else {
                button.clickOff = false;
            }

            if (isHovering && this.mouseDown) {
                button.pressed = true;
                //button.clickOn = true;
                ++button.pressedTime;
                button.notPressedTime = 0;
            } else if (button.pressed && !this.mouseDown) {
                button.pressed = false;
                //button.clickOff = true;
                button.pressedTime = 0;
                //setTimeout(function() {
                    //button.clickOff = false;
                //}, 1);
            }

            if (!(isHovering && this.mouseDown)) {
                ++button.notPressedTime;
            }
        }
        this.handleButtonHover(this.mousePos.x, this.mousePos.y);
        try {
            this.updateGamepads();
        } catch(e) {};
    },

    drawText: function(text = "Hello, World!", x = 0, y = 0, sizeFont = "30px Arial", color = "black", align = "left", baseline = "alphabetic") {
        ctx.font = sizeFont;
        ctx.fillStyle = color;
        ctx.textAlign = align;
        ctx.textBaseline = baseline;
        ctx.fillText(text, x, y);
    },

    drawBox: function(x, y, width, height, color = "black", cornerRadius = 0, borderWidth = 0, borderColor = "DarkGray") {
        const radius = Math.min(cornerRadius, width / 2, height / 2); // Clamp the radius

        ctx.fillStyle = color;

        // Draw rounded rectangle
        ctx.beginPath();
        ctx.moveTo(x + radius, y); // Top-left corner
        ctx.lineTo(x + width - radius, y); // Top edge
        ctx.arcTo(x + width, y, x + width, y + height, radius); // Top-right corner
        ctx.lineTo(x + width, y + height - radius); // Right edge
        ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius); // Bottom-right corner
        ctx.lineTo(x + radius, y + height); // Bottom edge
        ctx.arcTo(x, y + height, x, y + height - radius, radius); // Bottom-left corner
        ctx.lineTo(x, y + radius); // Left edge
        ctx.arcTo(x, y, x + radius, y, radius); // Top-left corner
        ctx.closePath();
        ctx.fill();

        if (borderWidth > 0) {
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = borderWidth;

            // Draw rounded rectangle outline
            ctx.beginPath();
            ctx.moveTo(x + radius, y); // Top-left corner
            ctx.lineTo(x + width - radius, y); // Top edge
            ctx.arcTo(x + width, y, x + width, y + height, radius); // Top-right corner
            ctx.lineTo(x + width, y + height - radius); // Right edge
            ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius); // Bottom-right corner
            ctx.lineTo(x + radius, y + height); // Bottom edge
            ctx.arcTo(x, y + height, x, y + height - radius, radius); // Bottom-left corner
            ctx.lineTo(x, y + radius); // Left edge
            ctx.arcTo(x, y, x + radius, y, radius); // Top-left corner
            ctx.closePath();
            ctx.stroke();
        }
    },

    drawOutline: function(x, y, width, height, color = "black", borderWidth = 1, cornerRadius = 0) {
        const radius = Math.min(cornerRadius, width / 2, height / 2); // Clamp the radius

        ctx.strokeStyle = color;
        ctx.lineWidth = borderWidth;

        // Draw rounded rectangle outline
        ctx.beginPath();
        ctx.moveTo(x + radius, y); // Top-left corner
        ctx.lineTo(x + width - radius, y); // Top edge
        ctx.arcTo(x + width, y, x + width, y + height, radius); // Top-right corner
        ctx.lineTo(x + width, y + height - radius); // Right edge
        ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius); // Bottom-right corner
        ctx.lineTo(x + radius, y + height); // Bottom edge
        ctx.arcTo(x, y + height, x, y + height - radius, radius); // Bottom-left corner
        ctx.lineTo(x, y + radius); // Left edge
        ctx.arcTo(x, y, x + radius, y, radius); // Top-left corner
        ctx.closePath();
        ctx.stroke();
    },

    drawCircle: function(centerX, centerY, radius = 50, color = "red", fill = false, opacity = 1) {
        ctx.save();

        // Set global opacity using globalAlpha
        ctx.globalAlpha = Math.max(0, Math.min(1, opacity)); // Ensure opacity is between 0 and 1

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);

        // Set the fill or stroke color
        if (fill) {
            ctx.fillStyle = color;
            ctx.fill();
        } else {
            ctx.strokeStyle = color;
            ctx.stroke();
        }

        // Restore the previous state (reset globalAlpha)
        ctx.restore();
    },

    clear: function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    },

    loadImage: function(id, src) {
        var image = new Image();
        image.src = src;

        this.images[id] = {
            image: image,
            loaded: false
        };

        image.onload = () => {
            this.images[id].loaded = true;
        };
    },

    drawImage: function(id, x, y, width, height, opacity = 1.0, centered = false) {
        ctx.globalAlpha = opacity;
        var imageObj = this.images[id];
        if (imageObj && imageObj.loaded) {
            var image = imageObj.image;
            if (width && height) {
                if (centered) {
                    ctx.drawImage(image, x - (width / 2), y - (height / 2), width, height);
                } else {
                    ctx.drawImage(image, x, y, width, height);
                }
            } else {
                ctx.drawImage(image, x, y);
            }
            return "success";
        } else {
            console.error('Image with id ' + id + ' not initialized or loaded.');
            return "fail";
        }
        ctx.globalAlpha = 1.0;
    },

    drawBar: function(percentage, x, y, width, height, direction = "leftToRight", color = "black", borderColor = "white", borderWidth = 2) {
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = borderWidth;
        ctx.fillStyle = color;

        var filledWidth = width * (percentage / 100);
        var filledHeight = height * (percentage / 100);
        var barX, barY, barWidth, barHeight;

        switch(direction) {
            case "rtl": // right to left
                barX = x + width - filledWidth;
                barY = y;
                barWidth = filledWidth;
                barHeight = height;
                break;
            case "ttb": // top to bottom
                barX = x;
                barY = y;
                barWidth = width;
                barHeight = filledHeight;
                break;
            case "btt": // bottom to top
                barX = x;
                barY = y + height - filledHeight;
                barWidth = width;
                barHeight = filledHeight;
                break;
            case "ltr": // left to right (default)
            default:
                barX = x;
                barY = y;
                barWidth = filledWidth;
                barHeight = height;
                break;
        }

        ctx.strokeRect(x, y, width, height);
        ctx.fillRect(barX, barY, barWidth, barHeight);
    },

    moveObject: function(object) {
        object.x += object.hv;
        object.y += object.vv;

        if (object.x < 0) {
            object.x = 0;
            object.hv = -object.hv;
        } else if (object.x + object.width > canvas.width) {
            object.x = canvas.width - object.width;
            object.hv = -object.hv;
        }

        if (object.y < 0) {
            object.y = 0;
            object.vv = -object.vv;
        } else if (object.y + object.height > canvas.height) {
            object.y = canvas.height - object.height;
            object.vv = -object.vv;
        }
    },

    checkWrapAround: function(object) {
        if (object.x + object.width < 0) {
            object.x = canvas.width;
        } else if (object.x > canvas.width) {
            object.x = -object.width;
        }

        if (object.y + object.height < 0) {
            object.y = canvas.height;
        } else if (object.y > canvas.height) {
            object.y = -object.height;
        }
    },

    checkCollision: function(object1, object2) {
        object1.width = object1.width || 1;
        object1.height = object1.height || 1;
        object2.width = object2.width || 1;
        object2.height = object2.height || 1;

        if (object1.x < object2.x + object2.width &&
            object1.x + object1.width > object2.x &&
            object1.y < object2.y + object2.height &&
            object1.y + object1.height > object2.y) {
            return true;
        }
        return false;
    },

    //moves object 1 to object 2
    moveToObject: function(object1, object2, speed = 0) {
        let dx = object2.x - object1.x;
        let dy = object2.y - object1.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let defaultSpeed = Math.sqrt(object1.hv * object1.hv + object1.vv * object1.vv);
        speed = speed || defaultSpeed;
        if (distance > 0) {
            let ratio = speed / distance;
            object1.x += dx * ratio;
            object1.y += dy * ratio;
        }
    },

    makeObjectGroup: function(groupid) {
        this.objectGroups[groupid] = [];
    },

    appendToObjectGroup: function(object, groupid) {
        if (this.objectGroups[groupid]) {
            this.objectGroups[groupid].push(object);
        } else {
            console.error("Object group '" + groupid + "' does not exist.");
        }
    },

    removeFromObjectGroup: function(object, groupid) {
        if (this.objectGroups[groupid]) {
            var index = this.objectGroups[groupid].indexOf(object);
            if (index !== -1) {
                this.objectGroups[groupid].splice(index, 1);
            }
        } else {
            console.error("Object group '" + groupid + "' does not exist.");
        }
    },

    deleteObjectGroup: function(groupid) {
        delete this.objectGroups[groupid];
    },

    getObjectFromObjectGroup: function(objectName, groupid) {
        if (this.objectGroups[groupid]) {
            for (var i = 0; i < this.objectGroups[groupid].length; i++) {
                if (this.objectGroups[groupid][i].name === objectName) {
                    return this.objectGroups[groupid][i];
                }
            }
            console.error("Object with name '" + objectName + "' not found in group '" + groupid + "'.");
            return null;
        } else {
            console.error("Object group '" + groupid + "' does not exist.");
            return null;
        }
    },

    rng: function(min, max) {
        const randomNumber = Math.random();
        const scaledNumber = randomNumber * (max - min + 1);
        const result = Math.floor(scaledNumber) + min;
        return result;
    },

    //Returns string "right" if object1 is to the right of object2 and "left" otherwise
    horizontalDirection: function(object1, object2) {
    	var horizontal = object1.x - object2.x;
    	var horizontalobject1;
    	if (horizontal > 0) {
    		horizontalobject1 = "right";
    	}
    	else if (horizontal < 0) {
    		horizontalobject1 = "left";
    	}
    	else if (horizontal == 0) {
    		horizontalobject1 = "equal";
    	}
    	return horizontalobject1;
    },

    //Returns string "top" if object1 is above object2 and "bottom" otherwise
    verticalDirection: function(object1, object2) {
    	var vertical = object1.y - object2.y;
    	var verticalobject1;
    	if (vertical > 0) {
    		verticalobject1 = "top";
    	}
    	else if (vertical < 0) {
    		verticalobject1 = "bottom";
    	}
    	return verticalobject1;
    },

    //Returns 1 if object1 is to the right of object2 and 0 otherwise but if equal return 2
    horizontalDirection2: function(object1, object2) {
    	var horizontal = object1.x - object2.x;
    	var horizontalobject1;
    	if (horizontal > 0) {
    		horizontalobject1 = 1;
    	}
    	else if (horizontal < 0) {
    		horizontalobject1 = 0;
    	}
    	else if (horizontal == 0) {
    		horizontalobject1 = 2;
    	}
    	return horizontalobject1;
    },

    //Returns 1 if object1 is above object2 and 0 otherwise
    verticalDirection2: function(object1, object2) {
    	var vertical = object1.y - object2.y;
    	var verticalobject1;
    	if (vertical > 0) {
    		verticalobject1 = 1;
    	}
    	else if (vertical < 0) {
    		verticalobject1 = 0;
    	}
    	return verticalobject1;
    },

    //attract object to target (object must have speed along with x and y) (target must have x and y)
    attract: function(object, target) {
        var dx = target.x - object.x;
        var dy = target.y - object.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        var nx = dx / distance;
        var ny = dy / distance;
        var movementX = nx * object.speed;
        var movementY = ny * object.speed;
        object.x += movementX;
        object.y += movementY;
    },

    //attract object to target (object must have vv and hv along with x and y) (target must have x and y)
    attractWithVelocity: function(object, target) {
        var dx = target.x - object.x;
        var dy = target.y - object.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        var nx = dx / distance;
        var ny = dy / distance;
        var movementX = nx * object.hv;
        var movementY = ny * object.vv;
        object.x += movementX;
        object.y += movementY;
    },

    //Returns a true if object is on the screen and false otherwise
    onscreen: function(object) {
    	return (object.x > -10 && object.x < window.innerWidth && object.y > -10 && object.y < window.innerHeight);
    },

    //object will circle around target
    circleAroundObject: function(object1, object2, radius) {
        object2.angle = object2.angle || 0;
        object2.x = object1.x + Math.cos(object2.angle) * radius;
        object2.y = object1.y + Math.sin(object2.angle) * radius;
        object2.angle = (object2.angle + 0.04) % (2 * Math.PI);
    },

    // repel object2 from object1
    repel: function(object1, object2) {
        var h = this.horizontalDirection(object1, object2);
        var v = this.verticalDirection(object1, object2);

        if ((h === "left" && object2.hv < 0) || (h === "right" && object2.hv > 0)) {
            object2.hv = -object2.hv;
        }
        if ((v === "top" && object2.vv > 0) || (v === "bottom" && object2.vv < 0)) {
            object2.vv = -object2.vv;
        }
    },

    // returns the distance between object1 and object2
    distance: function(object1, object2) {
        return Math.sqrt(Math.pow((object1.x - object2.x), 2) + Math.pow((object1.y - object2.y), 2));
    },

    // Calculates the angle made by object1 and object2 with respect to object1's x coordinate
    findAngle: function(object1, object2) {
        var x_len = object2.x - object1.x;
        var y_len = object2.y - object1.y;
        var angle = Math.atan(y_len / x_len);

        if (this.horizontalDirection(object1, object2) === "right") {
            angle += Math.PI;
        }
        return angle;
    },

    // save data to localstorage
    saveData: function(dataId, data) {
        try {
            localStorage.setItem(dataId, JSON.stringify(data));
            console.log("Data saved successfully with id: " + dataId);
        } catch (error) {
            console.error("Error saving data with id: " + dataId, error);
        }
    },

    // load data from localstorage
    loadData: function(dataId) {
        try {
            var data = localStorage.getItem(dataId);
            if (data !== null) {
                return JSON.parse(data);
            } else {
                console.warn("No data found with id: " + dataId);
                return null;
            }
        } catch (error) {
            console.error("Error loading data with id: " + dataId, error);
            return null;
        }
    },

    //send a web request using the fetch api
    webRequest: function(url, method, data, callback) {
        var options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        if (data) {
            options.body = JSON.stringify(data);
        }

        fetch(url, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            callback(null, data);
        })
        .catch(error => {
            callback(error, null);
        });
    },

    addButton: function(buttonid, x, y, width, height, visible, text = "", textFont = "16px Arial", textColor = "black", color = "LightGrey", borderColor = "black", cornerRadius = 0) {
        if (!this.buttons[buttonid]) {
            this.buttons[buttonid] = {
                x: x,
                y: y,
                width: width,
                height: height,
                pressed: false,
                hover: false,
                visible: visible,
                text: text,
                clickOn: false,
                clickOff: false,
                textFont: textFont,
                textColor: textColor,
                color: color,
                borderColor: borderColor,
                cornerRadius: cornerRadius,
                pressedTime: 0,
                notPressedTime: 3,
                PREVIOUSPRESSED: false
            };
        }
    },

    // Remove a button
    removeButton: function(buttonid) {
        if (this.buttons[buttonid]) {
            delete this.buttons[buttonid];
        }
    },

    // Renders all of the visible buttons
    renderButtons: function() {
        //render buttons
        for (var buttonid in this.buttons) {
            var button = this.buttons[buttonid];
            if (button.visible) {
            // Set corner radius for the button (limited to half of the button's height or width)
            const radius = Math.min(button.cornerRadius, button.height / 2, button.width / 2);

            ctx.fillStyle = button.color;
            // Draw rounded rectangle
            ctx.beginPath();
            ctx.moveTo(button.x + radius, button.y); // Move to top-left corner with radius
            ctx.lineTo(button.x + button.width - radius, button.y); // Top edge
            ctx.arcTo(button.x + button.width, button.y, button.x + button.width, button.y + button.height, radius); // Top-right corner
            ctx.lineTo(button.x + button.width, button.y + button.height - radius); // Right edge
            ctx.arcTo(button.x + button.width, button.y + button.height, button.x + button.width - radius, button.y + button.height, radius); // Bottom-right corner
            ctx.lineTo(button.x + radius, button.y + button.height); // Bottom edge
            ctx.arcTo(button.x, button.y + button.height, button.x, button.y + button.height - radius, radius); // Bottom-left corner
            ctx.lineTo(button.x, button.y + radius); // Left edge
            ctx.arcTo(button.x, button.y, button.x + radius, button.y, radius); // Top-left corner
            ctx.closePath();
            ctx.fill();

            // Draw border with rounded corners
            ctx.strokeStyle = button.borderColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(button.x + radius, button.y);
            ctx.lineTo(button.x + button.width - radius, button.y);
            ctx.arcTo(button.x + button.width, button.y, button.x + button.width, button.y + button.height, radius);
            ctx.lineTo(button.x + button.width, button.y + button.height - radius);
            ctx.arcTo(button.x + button.width, button.y + button.height, button.x + button.width - radius, button.y + button.height, radius);
            ctx.lineTo(button.x + radius, button.y + button.height);
            ctx.arcTo(button.x, button.y + button.height, button.x, button.y + button.height - radius, radius);
            ctx.lineTo(button.x, button.y + radius);
            ctx.arcTo(button.x, button.y, button.x + radius, button.y, radius);
            ctx.closePath();
            ctx.stroke();
                if (button.text) {
                    ctx.fillStyle = button.textColor;
                    ctx.font = button.textFont;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    var textX = button.x + button.width / 2;
                    var textY = button.y + button.height / 2;
                    ctx.fillText(button.text, textX, textY);
                }
            }
        }
        //render virtual mouse
        if (this.gamepads[0].connected && this.gamepadNavigationMode == 2) {
            this.drawCircle(this.virtualCursor.x, this.virtualCursor.y, 50, "black", true, 0.5);
            this.drawCircle(this.virtualCursor.x, this.virtualCursor.y, 5, "black", true);
            this.drawCircle(this.virtualCursor.x, this.virtualCursor.y, 50, "black", false);
        }
    },

    startBackgroundMusic: function(src) {
        const audioElement = cGL.backgroundMusic[0];

        // Ensure the AudioContext is unlocked
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Unlock the audio context with a small silent sound
            const dummySource = this.audioContext.createBufferSource();
            dummySource.buffer = this.audioContext.createBuffer(1, 1, this.audioContext.sampleRate);
            dummySource.connect(this.audioContext.destination);
            dummySource.start(0);
        }

        // Set up the audio element
        cGL.backgroundMusic[0].src = src;
        cGL.backgroundMusic[0].loop = true;

        // Attempt to play audio
        cGL.backgroundMusic[0].play().catch((error) => {
            console.warn("Playback failed, waiting for gamepad interaction:", error);

            // Poll gamepad for input to unlock audio
            const pollGamepad = () => {
                const gamepad = navigator.getGamepads()[0];
                if (gamepad && gamepad.buttons[0].pressed) { // Assuming button 0 (e.g., A button)
                    cGL.backgroundMusic[0].play().then(() => {
                        console.log("Audio playback started after gamepad interaction.");
                        clearInterval(pollInterval); // Stop polling
                    }).catch((err) => {
                        console.error("Audio playback still failed:", err);
                    });
                }
            };

            // Start polling for gamepad input
            const pollInterval = setInterval(pollGamepad, 100);

            // Optional: Stop polling after some time to avoid infinite loops
            setTimeout(() => {
                clearInterval(pollInterval);
                console.warn("Gamepad polling timed out. Ensure user interacts with the gamepad.");
            }, 10000); // 10 seconds timeout
        });
    },

    stopBackgroundMusic: function() {
        cGL.backgroundMusic[0].pause();
    },

    playSound: function(src) {
        var sound = new Audio(src);
        sound.play();
    },

    drawBackground: function(color) {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 999999999999999, 999999999999999);
    },

    measureText: function (text, font = "30px Arial") {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        context.font = font;
        const metrics = context.measureText(text);
        return {
            width: metrics.width,
            height: parseInt(font, 10), // Approximate height from font size
        };
    },

    importButtons: function(buttonsObj) {
        Object.assign(this.buttons, JSON.parse(buttonsObj));
    },

    importUI: function (elements) {
        try {
            elements.forEach(element => {
                const { type, ...props } = element;
                const drawMethod = `draw${type.charAt(0).toUpperCase() + type.slice(1)}`;
                if (typeof this[drawMethod] === "function") {
                    this[drawMethod](...Object.values(props));
                } else {
                    console.error(`Unknown type: ${type}`);
                }
            });
        } catch(err) {
            console.log(err)
        }
    }
};

addEventListener("keydown", function (e) {
	cGL.keysDown[e.keyCode] = true;
	cGL.keyDown = true;
	if (!cGL.backgroundMusicInitialized) {
	    music = new Audio();
	    cGL.backgroundMusic.push(music);
	    cGL.backgroundMusicInitialized = true;
	}
}, false);

addEventListener("keyup", function (e) {
	delete cGL.keysDown[e.keyCode];
	cGL.keyDown = true;
}, false);

console.log("cartGameLibrary installed");

