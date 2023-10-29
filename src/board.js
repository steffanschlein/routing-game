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
    constructor(app, updateUsedRodInfo) {
        this.app = app
        this.updateUsedRodInfo = updateUsedRodInfo
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

    onClickPin(pin) {
        return () => {
            if (this.bulkModeStart === null) {
                this.bulkModeStart = [pin.x_index, pin.y_index]
                pin.tint = pinSelectedColor
            } else {
                if (this.pins[this.bulkModeStart[0]][this.bulkModeStart[1]].active) {
                    this.pins[this.bulkModeStart[0]][this.bulkModeStart[1]].tint = pinHighlightColor
                } else {
                    this.pins[this.bulkModeStart[0]][this.bulkModeStart[1]].tint = pinBaseColor
                }
                if (pin.x_index === this.bulkModeStart[0] && pin.y_index !== this.bulkModeStart[1]) {
                    range(this.bulkModeStart[1], pin.y_index).forEach(y_index => {
                        const rod = this.rods_vertical[pin.x_index][y_index]
                        this.toggleRod(rod);
                    })
                } else if (pin.x_index !== this.bulkModeStart[0] && pin.y_index === this.bulkModeStart[1]) {
                    range(this.bulkModeStart[0], pin.x_index).forEach(x_index => {
                        const rod = this.rods_horizontal[x_index][pin.y_index]
                        this.toggleRod(rod);
                    })
                }
                this.bulkModeStart = null
                this.updateUsedRodInfo()
            }
        }
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
    
    onClick(rod) {
        return () => {
            this.toggleRod(rod);
            this.updateUsedRodInfo()
        }
    }

    createRod(x, y, angle) {
        let sprite = new Graphics(rodTemplate.geometry);
        sprite.tint = rodBaseColor;
        sprite.x = x
        sprite.y = y
        sprite.angle = angle
        sprite.eventMode = 'static';
        sprite.cursor = 'pointer';
        sprite.on('pointerdown', this.onClick(sprite));
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
        sprite.on('pointerdown', this.onClickPin(sprite));
        return sprite
    }

    adjustBoardContainer() {
        const TOP_OFFSET = 30
        const smallerSideLength = Math.min(this.app.screen.width, this.app.screen.height - TOP_OFFSET)
        const margin = Math.min(80, smallerSideLength * 0.05)
        const containerSize = smallerSideLength - 2 * margin
        this.boardContainer.width = containerSize
        this.boardContainer.height = containerSize
    
        this.boardContainer.x = this.app.screen.width / 2 - containerSize / 2;
        this.boardContainer.y = this.app.screen.height / 2 - containerSize / 2 + TOP_OFFSET;
    }

    countSelectedRods() {
        return this.rods_vertical.flat().concat(this.rods_horizontal.flat()).filter(function(rod) {
            return rod.selected;
        }).length;
    }
    
}