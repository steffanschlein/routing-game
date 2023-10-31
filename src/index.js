import { Application } from 'pixi.js';
import { createMenuContainer } from './menu.js';
import { Game } from './game.js';
import { Editor } from './editor.js';

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

const game = new Game(app, mainMenu)
const editor = new Editor(app, mainMenu)

function startGame(difficulty) {
    app.stage.removeChildren()
    game.start(difficulty)
    app.stage.addChild(game.gameContainer)
}

function startEditor() {
    app.stage.removeChildren()
    app.stage.addChild(editor.container)
}

function mainMenu() {
    app.stage.removeChildren()
    app.stage.addChild(menuContainer)
}
