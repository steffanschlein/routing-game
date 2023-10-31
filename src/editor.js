import { Container, Text } from "pixi.js";
import { EditorLogic } from "./editor_logic";
import { Board } from "./board";
import { createButton, createSlider } from "./ui_components";
import { encodeBoardConfiguration } from "./serialization";

const baseConfiguration = {
    width: 11,
    height: 11,
    allowedRods: 11,
    pinPositions: []
}

export class Editor {
    container;
    constructor(app, mainMenu) {
        this.app = app

        this.container = new Container();

        const editorLogic = new EditorLogic()
        this.board = new Board(editorLogic)
        this.container.addChild(this.board.boardContainer);
        
        this.updateUsedRodInfo();
        this.adjustBoardContainer();

        this.board.configuration = baseConfiguration
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

        const resetButton = createButton("Zurücksetzen");
        resetButton.onPress.connect(() => {
            this.board.configuration = baseConfiguration
            slider.value = baseConfiguration.allowedRods
        });
        resetButton.x = app.screen.width - slider.width - 60;
        resetButton.y = 300
        this.container.addChild(resetButton);

        const mainMenuButton = createButton("Hauptmenu")
        mainMenuButton.anchor.set(0, 1)
        mainMenuButton.x = this.board.boardContainer.x;
        mainMenuButton.y = this.app.screen.height - 20;
        mainMenuButton.onPress.connect(() => mainMenu())
        this.container.addChild(mainMenuButton)
    }
    
    updateUsedRodInfo() {
        const game = this
        return () => {
            game.basicText.text = 'Benutzte Stäbe: ' + game.board.countSelectedRods() + ' / ' + game.boardConfiguration.allowedRods;
        }
    }
    
    adjustBoardContainer() {
        const VERTICAL_MARGIN = 80
        const smallerSideLength = Math.min(this.app.screen.width, this.app.screen.height - VERTICAL_MARGIN)
        const margin = Math.min(80, smallerSideLength * 0.05)
        const containerSize = smallerSideLength - 2 * margin
        this.board.boardContainer.width = containerSize
        this.board.boardContainer.height = containerSize
    
        this.board.boardContainer.x = this.app.screen.width / 2 - containerSize / 2;
        this.board.boardContainer.y = this.app.screen.height / 2 - containerSize / 2;
    }
}
