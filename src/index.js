import { Application, Container, Graphics, Text } from 'pixi.js';
import { problem16 } from './problems.js';
import { decodeBoardConfiguration, encodeBoardConfiguration } from './serialization.js';
import { createMenuContainer } from './menu.js';
import { Board } from './board.js';

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

const board = new Board(app, updateUsedRodInfo)

gameContainer.addChild(board.boardContainer);

function updateUsedRodInfo() {
    basicText.text = 'Benutzte Stäbe: ' + board.countSelectedRods() + ' / ' + boardConfiguration.allowedRods;
}

function startGame() {
    app.stage.removeChild(menuContainer)
    app.stage.addChild(gameContainer)
}

board.loadBordConfiguration(boardConfiguration);
updateUsedRodInfo();
board.adjustBoardContainer();
