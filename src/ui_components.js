import { Application, Container, Graphics, Text } from 'pixi.js';
import { FancyButton, List } from '@pixi/ui';

export function createButton(text) {
    const BUTTON_WIDTH = 200
    const BUTTON_HEIGHT = 40
    const BUTTON_RADIUS = 5
    const BUTTON_DEFAULT_COLOR = 0xd0d0d0;
    const BUTTON_HOVER_COLOR = 0xa0a0a0;
    const BUTTON_PRESSED_COLOR = 0x4c4c4c;
    return new FancyButton({
        defaultView: new Graphics().beginFill(BUTTON_DEFAULT_COLOR).drawRoundedRect(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, BUTTON_RADIUS),
        hoverView: new Graphics().beginFill(BUTTON_HOVER_COLOR).drawRoundedRect(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, BUTTON_RADIUS),
        pressedView: new Graphics().beginFill(BUTTON_PRESSED_COLOR).drawRoundedRect(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, BUTTON_RADIUS),
        text: text
    });
}

export function createButtonList(buttons) {
    const bgColor = 0xeeeeee
    const listContainer = new Graphics().beginFill(bgColor).drawRect(0, 0, 240, 40 * buttons.length + 10 * (buttons.length - 1) + 20 * 2);
    
    const list = new List({
        elementsMargin: 10,
        vertPadding: 20,
        type: "vertical"
    });
    
    buttons.forEach((item) => list.addChild(item));
    list.x = listContainer.width / 2 - list.width / 2
    listContainer.addChild(list)
    return listContainer
}
