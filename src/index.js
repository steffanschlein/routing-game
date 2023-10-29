import { Application } from 'pixi.js';
import { problem16 } from './problems.js';
import { decodeBoardConfiguration } from './serialization.js';
import { createMenuContainer } from './menu.js';
import { Game } from './game.js';
import { Editor } from './editor.js';

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

const menuContainer = createMenuContainer(app, startGame, startEditor)

app.stage.addChild(menuContainer)

const game = new Game(app, boardConfiguration)
const editor = new Editor(app)

function startGame(encodedProblem) {
    app.stage.removeChild(menuContainer)
    game.board.configuration = decodeBoardConfiguration(encodedProblem)
    game.updateUsedRodInfo()()
    app.stage.addChild(game.gameContainer)
}

function startEditor() {
    app.stage.removeChild(menuContainer)
    app.stage.addChild(editor.container)
}
