import { Application } from 'pixi.js';
import { problem16 } from './problems.js';
import { decodeBoardConfiguration } from './serialization.js';
import { createMenuContainer } from './menu.js';
import { Game } from './game.js';

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

const game = new Game(app, boardConfiguration)

function startGame() {
    app.stage.removeChild(menuContainer)
    app.stage.addChild(game.gameContainer)
}
