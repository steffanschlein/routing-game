import { Button } from '@pixi/ui';
import * as PIXI from 'pixi.js';
import { problem16 } from './problems.js';
import { decodeBoardConfiguration, encodeBoardConfiguration } from './serialization.js';

let boardConfiguration = {}

let hash = window.location.hash.substring(1);
try {
    boardConfiguration = decodeBoardConfiguration(hash)
} catch (error) {
    boardConfiguration = decodeBoardConfiguration(problem16)
}

const PIN_DISTANCE = 50;
const PIN_RADIUS = 7;
const ROD_LENGTH = (PIN_DISTANCE - 2 * PIN_RADIUS) * 0.8;
const ROD_WIDTH = PIN_RADIUS * 0.8

const rodBaseColor = 0xd0d0d0;
const rodHighlightColor = 0xff0000;
const pinBaseColor = 0x4c4c4c;
const pinHighlightColor = 0xff0000;
const pinSelectedColor = 0x0000ff;
const backgroundColor = "#ffffff"

let app = new PIXI.Application({
    resizeTo: window,
    background: backgroundColor,
    resolution: devicePixelRatio,
    autoDensity: true
});
document.body.appendChild(app.view);

const menuContainer = new PIXI.Container();

const button = new Button();

button.onPress.connect(() => console.log('Button pressed!') );

const gameContainer = new PIXI.Container();
// app.stage.addChild(gameContainer);

const boardContainer = new PIXI.Container();
gameContainer.addChild(boardContainer);

let rodTemplate = new PIXI.Graphics();
rodTemplate.beginFill(0xffffff);
rodTemplate.drawRoundedRect(0, -ROD_WIDTH/2, ROD_LENGTH, ROD_WIDTH, ROD_WIDTH/4);

let pinTemplate = new PIXI.Graphics();
pinTemplate.beginFill(0xffffff);
pinTemplate.drawCircle(0, 0, PIN_RADIUS);

let pins = Array.from(Array(11), () => new Array(11))
let rods_horizontal = Array.from(Array(11), () => new Array(10));
let rods_vertical = Array.from(Array(11), () => new Array(10));

for (let x_index = 0; x_index < 11; x_index++) {
    for (let y_index = 0; y_index < 11; y_index++) {
        let x = x_index * PIN_DISTANCE
        let y = y_index * PIN_DISTANCE
        if (x_index < 10) {
            let rod = createRod(x + (PIN_DISTANCE - ROD_LENGTH) / 2, y, 0)
            rods_horizontal[x_index][y_index] = rod
            boardContainer.addChild(rod)
        }
        if (y_index < 10) {
            let rod = createRod(x, y + (PIN_DISTANCE - ROD_LENGTH) / 2, 90)
            rods_vertical[x_index][y_index] = rod
            boardContainer.addChild(rod)
        }
        let pin = createPin(x, y)
        pin.x_index = x_index
        pin.y_index = y_index
        pins[x_index][y_index] = pin
        boardContainer.addChild(pin)
    }
}

const basicText = new PIXI.Text();

basicText.x = 50;
basicText.y = 20;

gameContainer.addChild(basicText);

function loadBordConfiguration(boardConfiguration) {
    pins.flat().forEach(pin => pin.active = false)
    boardConfiguration.pinPositions.forEach(position => {
        pins[position.x][position.y].tint = pinHighlightColor;
        pins[position.x][position.y].active = true;
    })
    history.replaceState(null, "", "#" + encodeBoardConfiguration(boardConfiguration));
}

function onClick() {
    toggleRod(this);
    updateUsedRodInfo()
}

let bulkModeStart = null;

function onClickPin() {
    if (bulkModeStart === null) {
        bulkModeStart = [this.x_index, this.y_index]
        this.tint = pinSelectedColor
    } else {
        if (pins[bulkModeStart[0]][bulkModeStart[1]].active) {
            pins[bulkModeStart[0]][bulkModeStart[1]].tint = pinHighlightColor
        } else {
            pins[bulkModeStart[0]][bulkModeStart[1]].tint = pinBaseColor
        }
        if (this.x_index === bulkModeStart[0] && this.y_index !== bulkModeStart[1]) {
            range(bulkModeStart[1], this.y_index).forEach(y_index => {
                const rod = rods_vertical[this.x_index][y_index]
                toggleRod(rod);
            })
        } else if (this.x_index !== bulkModeStart[0] && this.y_index === bulkModeStart[1]) {
            range(bulkModeStart[0], this.x_index).forEach(x_index => {
                const rod = rods_horizontal[x_index][this.y_index]
                toggleRod(rod);
            })
        }
        bulkModeStart = null
        updateUsedRodInfo()
    }
}

function toggleRod(rod) {
    if (!rod.selected && countSelectedRods() < boardConfiguration.allowedRods) {
        rod.selected = true;
        rod.tint = rodHighlightColor;
    }
    else if (rod.selected) {
        rod.selected = false;
        rod.tint = rodBaseColor;
    }
}

function updateUsedRodInfo() {
    basicText.text = 'Benutzte Stäbe: ' + countSelectedRods() + ' / ' + boardConfiguration.allowedRods;
}

function countSelectedRods() {
    return rods_vertical.flat().concat(rods_horizontal.flat()).filter(function(rod) {
        return rod.selected;
    }).length;
}

function range(start, end) {
    let result = []
    const lower = Math.min(start, end)
    const higher = Math.max(start, end)
    for (let i = lower; i < higher; i++) {
        result.push(i)
    }
    return result
}

function createRod(x, y, angle) {
    let sprite = new PIXI.Graphics(rodTemplate.geometry);
    sprite.tint = rodBaseColor;
    sprite.x = x
    sprite.y = y
    sprite.angle = angle
    sprite.eventMode = 'static';
    sprite.cursor = 'pointer';
    sprite.on('pointerdown', onClick);
    sprite.selected = false;
    return sprite
}

function createPin(x, y) {
    let sprite = new PIXI.Graphics(pinTemplate.geometry);
    sprite.tint = pinBaseColor;
    sprite.x = x
    sprite.y = y
    sprite.eventMode = 'static';
    sprite.cursor = 'pointer';
    sprite.active = false;
    sprite.on('pointerdown', onClickPin);
    return sprite
}

function adjustBoardContainer() {
    const TOP_OFFSET = 30
    const smallerSideLength = Math.min(app.screen.width, app.screen.height - TOP_OFFSET)
    const margin = Math.min(80, smallerSideLength * 0.05)
    const containerSize = smallerSideLength - 2 * margin
    boardContainer.width = containerSize
    boardContainer.height = containerSize

    boardContainer.x = app.screen.width / 2 - containerSize / 2;
    boardContainer.y = app.screen.height / 2 - containerSize / 2 + TOP_OFFSET;
}

loadBordConfiguration(boardConfiguration);
updateUsedRodInfo();
adjustBoardContainer();
