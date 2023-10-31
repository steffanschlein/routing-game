import { Container, Text } from 'pixi.js';
import { createButton, createButtonList } from './ui_components.js';
import { centerContainer } from './utils.js';

Array.prototype.random = function () {
    return this[Math.floor((Math.random()*this.length))];
  }

export function createMenuContainer(app, startGame, startEditor, customGameHash) {
    const menuContainer = new Container();

    const title = new Text('Routing-Spiel', {
        fontSize: 42
    });
    title.x = app.screen.width / 2 - title.width / 2;
    title.y = 50;
    menuContainer.addChild(title);

    const newGameButton = createButton("Neues Spiel");
    newGameButton.onPress.connect(() => buttonList.visible = true);
    const editorButton = createButton("Editor");
    editorButton.onPress.connect(startEditor)

    const mainButtonList = createButtonList([
        newGameButton,
        editorButton
    ])

    menuContainer.addChild(mainButtonList)
    centerContainer(mainButtonList, app.screen)

    const customButton = createButton("Eigenes");
    customButton.onPress.connect(() => {
        startGame("custom", customGameHash)
        buttonList.visible = false
    })
    const veryEasyButton = createButton("Sehr leicht");
    veryEasyButton.onPress.connect(() => {
        startGame("very_easy")
        buttonList.visible = false
    });
    const easyButton = createButton("Leicht");
    easyButton.onPress.connect(() => {
        startGame("easy")
        buttonList.visible = false
    });
    const mediumButton = createButton("Mittel");
    mediumButton.onPress.connect(() => {
        startGame("medium")
        buttonList.visible = false
    });
    const hardButton = createButton("Schwer");
    hardButton.onPress.connect(() => {
        startGame("hard")
        buttonList.visible = false
    });
    const veryHardButton = createButton("Sehr schwer");
    veryHardButton.onPress.connect(() => {
        startGame("very_hard")
        buttonList.visible = false
    });
    const extremlyHardButton = createButton("Extrem schwer");
    extremlyHardButton.onPress.connect(() => {
        startGame("extremly_hard")
        buttonList.visible = false
    });
    const backButton = createButton("Zurück");
    backButton.onPress.connect(() => buttonList.visible = false)

    const list = [
        veryEasyButton,
        easyButton,
        mediumButton,
        hardButton,
        veryHardButton,
        extremlyHardButton,
        backButton
    ]

    if (customGameHash != null) {
        list.unshift(customButton)
    }

    const buttonList = createButtonList(list)
    buttonList.visible = false

    menuContainer.addChild(buttonList)
    centerContainer(buttonList, app.screen)
    return menuContainer
}
