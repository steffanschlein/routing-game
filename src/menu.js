import { Container } from 'pixi.js';
import { createButton, createButtonList } from './ui_components.js';
import { centerContainer } from './utils.js';

export function createMenuContainer(app, startGame, startEditor) {
    const menuContainer = new Container();

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

    const veryEasyButton = createButton("Sehr leicht");
    veryEasyButton.onPress.connect(() => startGame());
    const easyButton = createButton("Leicht");
    easyButton.onPress.connect(() => startGame());
    const mediumButton = createButton("Mittel");
    mediumButton.onPress.connect(() => startGame());
    const hardButton = createButton("Schwer");
    hardButton.onPress.connect(() => startGame());
    const veryHardButton = createButton("Sehr schwer");
    veryHardButton.onPress.connect(() => startGame());
    const extremlyHardButton = createButton("Extrem schwer");
    extremlyHardButton.onPress.connect(() => startGame());

    const buttonList = createButtonList([
        veryEasyButton,
        easyButton,
        mediumButton,
        hardButton,
        veryHardButton,
        extremlyHardButton
    ])
    buttonList.visible = false

    menuContainer.addChild(buttonList)
    centerContainer(buttonList, app.screen)
    return menuContainer
}
