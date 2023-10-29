import { Container, Graphics } from "pixi.js";
import { encodeBoardConfiguration } from "./serialization";
import { range } from "./utils";

const rodBaseColor = 0xd0d0d0;
const rodHighlightColor = 0xff0000;
const pinBaseColor = 0x4c4c4c;
const pinHighlightColor = 0xff0000;
const pinSelectedColor = 0x0000ff;

const PIN_DISTANCE = 50;
const PIN_RADIUS = 7;
const ROD_LENGTH = (PIN_DISTANCE - 2 * PIN_RADIUS) * 0.8;
const ROD_WIDTH = PIN_RADIUS * 0.8

let rodTemplate = new Graphics();
rodTemplate.beginFill(0xffffff);
rodTemplate.drawRoundedRect(0, -ROD_WIDTH/2, ROD_LENGTH, ROD_WIDTH, ROD_WIDTH/4);

let pinTemplate = new Graphics();
pinTemplate.beginFill(0xffffff);
pinTemplate.drawCircle(0, 0, PIN_RADIUS);

export class Board {
    boardContainer;
    constructor(logic) {
        this.logic = logic
        this.pins = Array.from(Array(11), () => new Array(11))
        this.rods_horizontal = Array.from(Array(11), () => new Array(10));
        this.rods_vertical = Array.from(Array(11), () => new Array(10));

        this.boardContainer = new Container();

        this.bulkModeStart = null

        this.spawnChildren()
    }

    spawnChildren() {
        for (let x_index = 0; x_index < 11; x_index++) {
            for (let y_index = 0; y_index < 11; y_index++) {
                let x = x_index * PIN_DISTANCE
                let y = y_index * PIN_DISTANCE
                if (x_index < 10) {
                    let rod = this.createRod(x + (PIN_DISTANCE - ROD_LENGTH) / 2, y, 0)
                    this.rods_horizontal[x_index][y_index] = rod
                    this.boardContainer.addChild(rod)
                }
                if (y_index < 10) {
                    let rod = this.createRod(x, y + (PIN_DISTANCE - ROD_LENGTH) / 2, 90)
                    this.rods_vertical[x_index][y_index] = rod
                    this.boardContainer.addChild(rod)
                }
                let pin = this.createPin(x, y)
                pin.x_index = x_index
                pin.y_index = y_index
                this.pins[x_index][y_index] = pin
                this.boardContainer.addChild(pin)
            }
        }
    }

    loadBordConfiguration(boardConfiguration) {
        this.boardConfiguration = boardConfiguration
        this.pins.flat().forEach(pin => pin.active = false)
        const board = this;
        boardConfiguration.pinPositions.forEach(position => {
            board.pins[position.x][position.y].tint = pinHighlightColor;
            board.pins[position.x][position.y].active = true;
        })
        history.replaceState(null, "", "#" + encodeBoardConfiguration(boardConfiguration));
    }
    
    toggleRod(rod) {
        if (!rod.selected && this.countSelectedRods() < this.boardConfiguration.allowedRods) {
            rod.selected = true;
            rod.tint = rodHighlightColor;
        }
        else if (rod.selected) {
            rod.selected = false;
            rod.tint = rodBaseColor;
        }
    }

    selectPin(x, y) {
        this.pins[x][y].tint = pinSelectedColor
    }

    highlightPin(x, y) {
        this.pins[x][y].tint = pinHighlightColor
    }

    basePin(x, y) {
        this.pins[x][y].tint = pinBaseColor
    }

    createRod(x, y, angle) {
        let sprite = new Graphics(rodTemplate.geometry);
        sprite.tint = rodBaseColor;
        sprite.x = x
        sprite.y = y
        sprite.angle = angle
        sprite.eventMode = 'static';
        sprite.cursor = 'pointer';
        sprite.on('pointerdown', this.logic.onClickRod(this, sprite));
        sprite.selected = false;
        return sprite
    }
    
    createPin(x, y) {
        let sprite = new Graphics(pinTemplate.geometry);
        sprite.tint = pinBaseColor;
        sprite.x = x
        sprite.y = y
        sprite.eventMode = 'static';
        sprite.cursor = 'pointer';
        sprite.active = false;
        sprite.on('pointerdown', this.logic.onClickPin(this, sprite));
        return sprite
    }

    countSelectedRods() {
        return this.rods_vertical.flat().concat(this.rods_horizontal.flat()).filter(function(rod) {
            return rod.selected;
        }).length;
    }
    
}