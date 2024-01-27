import { Circle, Container, Graphics, Rectangle } from "pixi.js";

const rodBaseColor = 0xd0d0d0;
const rodHighlightColor = 0x0000ff;
const pinBaseColor = 0x4c4c4c;
const pinHighlightColor = 0xff0000;
const pinSelectedColor = 0x0000ff;

const PIN_DISTANCE = 50;
const PIN_RADIUS = 7;
const ROD_LENGTH = (PIN_DISTANCE - 2 * PIN_RADIUS) * 0.8;
const ROD_WIDTH = PIN_RADIUS * 0.8

export class Board {
    boardContainer;
    constructor(logic) {
        this.logic = logic
        this.pins = Array.from(Array(11), () => new Array(11))
        this.rods_horizontal = Array.from(Array(11), () => new Array(10));
        this.rods_vertical = Array.from(Array(11), () => new Array(10));

        this.boardContainer = new Container();

        this.spawnChildren()
    }

    set configuration(configuration) {
        this.allowedRods = configuration.allowedRods;
        this.pins.flat().forEach(pin => this.basePin(pin.x_index, pin.y_index))
        const board = this;
        configuration.pinPositions.forEach(position => {
            board.highlightPin(position.x, position.y)
        })
        this.rods_horizontal.flat().concat(this.rods_vertical.flat()).forEach((rod) => {
            rod.selected = false;
            rod.tint = rodBaseColor;
        })
        // history.replaceState(null, "", "#" + encodeBoardConfiguration(boardConfiguration));
    }

    get configuration() {
        return {
            width: this.pins.length,
            height: this.pins[0].length,
            allowedRods: this.allowedRods,
            pinPositions: this.pins.flat().filter((pin) => pin.active).map((pin) => ({x: pin.x_index, y: pin.y_index}))
        };
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
    
    toggleRod(rod) {
        if (!rod.selected) {
            rod.selected = true;
            rod.tint = rodHighlightColor;
        }
        else {
            rod.selected = false;
            rod.tint = rodBaseColor;
        }
    }

    deselectAllRods() {
        this.getAllRods().map((rod) => {
            rod.selected = false;
            rod.tint = rodBaseColor;
        })
    }

    selectPin(x, y) {
        this.pins[x][y].tint = pinSelectedColor
    }

    highlightPin(x, y) {
        this.pins[x][y].active = true
        this.pins[x][y].tint = pinHighlightColor
    }

    basePin(x, y) {
        this.pins[x][y].tint = pinBaseColor
        this.pins[x][y].active = false
    }

    createRod(x, y, angle) {
        let sprite = new Graphics();
        sprite.beginFill(0xffffff);
        sprite.drawRoundedRect(0, -ROD_WIDTH/2, ROD_LENGTH, ROD_WIDTH, ROD_WIDTH/4);
        sprite.tint = rodBaseColor;
        sprite.x = x
        sprite.y = y
        sprite.angle = angle
        sprite.eventMode = 'static';
        sprite.cursor = 'pointer';
        sprite.on('pointerdown', this.logic.onClickRod(this, sprite));
        sprite.selected = false;
        sprite.hitArea = new Rectangle(0, -ROD_WIDTH * 2, ROD_LENGTH, ROD_WIDTH * 4)
        return sprite
    }
    
    createPin(x, y) {
        let sprite = new Graphics();
        sprite.beginFill(0xffffff);
        sprite.drawCircle(0, 0, PIN_RADIUS);
        sprite.tint = pinBaseColor;
        sprite.x = x
        sprite.y = y
        sprite.eventMode = 'static';
        sprite.cursor = 'pointer';
        sprite.active = false;
        sprite.on('pointerdown', this.logic.onClickPin(this, sprite));
        sprite.hitArea = new Circle(0, 0, PIN_RADIUS * 2)
        return sprite
    }

    getAllRods() {
        return this.rods_vertical.flat().concat(this.rods_horizontal.flat())
    }

    countSelectedRods() {
        return this.getAllRods().filter(function(rod) {
            return rod.selected;
        }).length;
    }
    
}