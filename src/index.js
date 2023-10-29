import { Application, Container, Graphics, Text } from 'pixi.js';
import { problem16 } from './problems.js';
import { decodeBoardConfiguration, encodeBoardConfiguration } from './serialization.js';
import { createMenuContainer } from './menu.js';
import { Board } from './board.js';
import { GameLogic } from './game_logic.js';
import { EditorLogic } from './editor_logic.js';

let boardConfiguration = {}

let hash = window.location.hash.substring(1);
try {
    boardConfiguration = decodeBoardConfiguration(hash)
} catch (error) {
    boardConfiguration = decodeBoardConfiguration(problem16)
}

const backgroundColor = "#ffffff"

let app = new Application({
    resizeTo: window,
    background: backgroundColor,
    resolution: devicePixelRatio,
    autoDensity: true
});
document.body.appendChild(app.view);

const menuContainer = createMenuContainer(app, startGame)

app.stage.addChild(menuContainer)

const gameContainer = new Container();


const basicText = new Text();

basicText.x = 50;
basicText.y = 20;

gameContainer.addChild(basicText);

const gameLogic = new GameLogic(updateUsedRodInfo)
const board = new Board(gameLogic)
board.loadBordConfiguration(boardConfiguration);

// const editorLogic = new EditorLogic()
// const board = new Board(editorLogic)

gameContainer.addChild(board.boardContainer);

function updateUsedRodInfo() {
    basicText.text = 'Benutzte Stäbe: ' + board.countSelectedRods() + ' / ' + boardConfiguration.allowedRods;
}

function startGame() {
    app.stage.removeChild(menuContainer)
    app.stage.addChild(gameContainer)
}

function adjustBoardContainer() {
    const TOP_OFFSET = 30
    const smallerSideLength = Math.min(app.screen.width, app.screen.height - TOP_OFFSET)
    const margin = Math.min(80, smallerSideLength * 0.05)
    const containerSize = smallerSideLength - 2 * margin
    board.boardContainer.width = containerSize
    board.boardContainer.height = containerSize

    board.boardContainer.x = app.screen.width / 2 - containerSize / 2;
    board.boardContainer.y = app.screen.height / 2 - containerSize / 2 + TOP_OFFSET;
}
updateUsedRodInfo();
adjustBoardContainer();
