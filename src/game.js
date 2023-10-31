import { Container, Text } from "pixi.js";
import { GameLogic } from "./game_logic";
import { Board } from "./board";
import { easyProblems, extremlyHardProblems, hardProblems, mediumProblems, veryEasyProblems, veryHardProblems } from "./problems";
import { decodeBoardConfiguration } from "./serialization";
import { createButton } from "./ui_components";

export class Game {
    gameContainer;
    constructor(app, mainMenu) {
        this.app = app

        this.gameContainer = new Container();

        this.basicText = new Text();
        this.gameContainer.addChild(this.basicText);

        this.difficultyText = new Text();
        this.gameContainer.addChild(this.difficultyText)

        this.mainMenuButton = createButton("Hauptmenu")
        this.mainMenuButton.anchor.set(0, 1)
        this.mainMenuButton.onPress.connect(() => mainMenu())
        this.gameContainer.addChild(this.mainMenuButton)

        const gameLogic = new GameLogic(this.updateUsedRodInfo())
        this.board = new Board(gameLogic)

        this.gameContainer.addChild(this.board.boardContainer);

        this.updateUsedRodInfo()();
        this.calculateLayout();
    }
    
    start(difficulty) {
        let encodedProblem
        switch (difficulty) {
            case 'very_easy':
                encodedProblem = veryEasyProblems.random()
                this.updateDifficultyText("Sehr leicht")
                break;
            case 'easy':
                encodedProblem = easyProblems.random()
                this.updateDifficultyText("Leicht")
                break;
            case 'medium':
                encodedProblem = mediumProblems.random()
                this.updateDifficultyText("Mittel")
                break;
            case 'hard':
                encodedProblem = hardProblems.random()
                this.updateDifficultyText("Mittel")
                break;
            case 'very_hard':
                encodedProblem = veryHardProblems.random()
                this.updateDifficultyText("Sehr schwer")
                break;
            case 'extremly_hard':
                encodedProblem = extremlyHardProblems.random()
                this.updateDifficultyText("Extrem schwer")
                break;
        }
        this.board.configuration = decodeBoardConfiguration(encodedProblem)
        this.updateUsedRodInfo()()
    }

    updateDifficultyText(level) {
        this.difficultyText.text = 'Stufe: ' + level
    }

    updateUsedRodInfo() {
        const game = this
        return () => {
            game.basicText.text = 'Benutzte Stäbe: ' + game.board.countSelectedRods() + ' / ' + game.board.allowedRods;
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

    calculateLayout() {
        this.adjustBoardContainer()
        this.basicText.x = 50;
        this.basicText.y = 20;
        this.difficultyText.anchor.set(1, 0)
        this.difficultyText.x = this.app.screen.width - 50
        this.difficultyText.y = 20
        this.mainMenuButton.x = this.board.boardContainer.x;
        this.mainMenuButton.y = this.app.screen.height - 20;
    }
}
