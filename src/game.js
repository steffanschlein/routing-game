import { Container, Text } from "pixi.js";
import { GameLogic } from "./game_logic";
import { Board } from "./board";
import { easyProblems, hardProblems, mediumProblems, veryEasyProblems, veryHardProblems } from "./problems";
import { decodeBoardConfiguration } from "./serialization";

export class Game {
    gameContainer;
    constructor(app) {
        this.app = app

        this.gameContainer = new Container();

        this.basicText = new Text();

        this.basicText.x = 50;
        this.basicText.y = 20;

        this.gameContainer.addChild(this.basicText);

        const gameLogic = new GameLogic(this.updateUsedRodInfo())
        this.board = new Board(gameLogic)

        this.gameContainer.addChild(this.board.boardContainer);

        this.updateUsedRodInfo()();
        this.adjustBoardContainer();
    }
    
    start(difficulty) {
        let encodedProblem
        switch (difficulty) {
            case 'very_easy':
                encodedProblem = veryEasyProblems.random()
                break;
            case 'easy':
                encodedProblem = easyProblems.random()
                break;
            case 'medium':
                encodedProblem = mediumProblems.random()
                break;
            case 'hard':
                encodedProblem = hardProblems.random()
                break;
            case 'very_hard':
                encodedProblem = veryHardProblems.random()
                break;
            case 'extremly_hard':
                encodedProblem = extremlyHardProblems.random()
                break;
        }
        this.board.configuration = decodeBoardConfiguration(encodedProblem)
        this.updateUsedRodInfo()()
    }

    updateUsedRodInfo() {
        const game = this
        return () => {
            game.basicText.text = 'Benutzte Stäbe: ' + game.board.countSelectedRods() + ' / ' + game.board.allowedRods;
        }
    }
    
    adjustBoardContainer() {
        const TOP_OFFSET = 30
        const smallerSideLength = Math.min(this.app.screen.width, this.app.screen.height - TOP_OFFSET)
        const margin = Math.min(80, smallerSideLength * 0.05)
        const containerSize = smallerSideLength - 2 * margin
        this.board.boardContainer.width = containerSize
        this.board.boardContainer.height = containerSize
    
        this.board.boardContainer.x = this.app.screen.width / 2 - containerSize / 2;
        this.board.boardContainer.y = this.app.screen.height / 2 - containerSize / 2 + TOP_OFFSET;
    }
}
