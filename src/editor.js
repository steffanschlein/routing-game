import { Container, Text } from "pixi.js";
import { EditorLogic } from "./editor_logic";
import { Board } from "./board";
import { createButton, createSlider } from "./ui_components";
import { encodeBoardConfiguration } from "./serialization";

export class Editor {
    container;
    constructor(app) {
        this.app = app

        this.container = new Container();

        const editorLogic = new EditorLogic()
        this.board = new Board(editorLogic)
        this.container.addChild(this.board.boardContainer);
        
        this.updateUsedRodInfo();
        this.adjustBoardContainer();

        this.board.allowedRods = 11
        const slider = createSlider((value) => this.board.allowedRods = value)
        slider.x = app.screen.width - slider.width - 60
        slider.y = 200
        this.container.addChild(slider)

        this.basicText = new Text('Erlaubte Anzahl an Stäben:', {
            fontSize: 18
        });
        this.basicText.x = app.screen.width - slider.width - 60;
        this.basicText.y = 200 - this.basicText.height - 10;
        this.container.addChild(this.basicText);

        const saveButton = createButton("Speichern");
        saveButton.onPress.connect(() => console.log(encodeBoardConfiguration(this.board.configuration)));
        saveButton.x = app.screen.width - slider.width - 60;
        saveButton.y = 240
        this.container.addChild(saveButton);
    }
    
    updateUsedRodInfo() {
        const game = this
        return () => {
            game.basicText.text = 'Benutzte Stäbe: ' + game.board.countSelectedRods() + ' / ' + game.boardConfiguration.allowedRods;
        }
    }
    
    adjustBoardContainer() {
        const TOP_OFFSET = 30
        const HORIZONTAL_OFFSET = -80
        const smallerSideLength = Math.min(this.app.screen.width - Math.abs(HORIZONTAL_OFFSET), this.app.screen.height - TOP_OFFSET)
        const margin = Math.min(80, smallerSideLength * 0.05)
        const containerSize = smallerSideLength - 2 * margin
        this.board.boardContainer.width = containerSize
        this.board.boardContainer.height = containerSize
    
        this.board.boardContainer.x = this.app.screen.width / 2 - containerSize / 2 + HORIZONTAL_OFFSET;
        this.board.boardContainer.y = this.app.screen.height / 2 - containerSize / 2 + TOP_OFFSET;
    }
}
