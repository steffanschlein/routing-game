import { Graphics } from 'pixi.js';
import { FancyButton, List, Slider } from '@pixi/ui';

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

export function createSlider(onChange) {
    const meshColor = 0x4c4c4c;
    const fillColor = 0xa0a0a0;
    const borderColor = 0xFFFFFF;
    const backgroundColor = 0xd0d0d0;
    const fontColor = 0xFFFFFF;
    const min = 2;
    const max = 50;
    const value = 11;
    const width = 200;
    const height = 20;
    const radius = 25;
    const handleRadius = 15;
    const fontSize = 16;
    const border = 3;
    const handleBorder = 3;
    const showValue = true;
    const showFill = true

    const bg = new Graphics()
        .beginFill(borderColor)
        .drawRoundedRect(0, 0, width, height, radius)
        .beginFill(backgroundColor)
        .drawRoundedRect(border, border, width - (border * 2), height - (border * 2), radius);

    const fill = new Graphics()
        .beginFill(borderColor)
        .drawRoundedRect(0, 0, width, height, radius)
        .beginFill(fillColor)
        .drawRoundedRect(border, border, width - (border * 2), height - (border * 2), radius);

    const slider = new Graphics()
        .beginFill(borderColor)
        .drawCircle(0, 0, handleRadius + handleBorder)
        .beginFill(meshColor)
        .drawCircle(0, 0, handleRadius)
        .endFill();

    // Component usage
    const singleSlider = new Slider({
        bg,
        fill: showFill ? fill : null,
        slider,
        min,
        max,
        value,
        valueTextStyle: {
            fill: fontColor,
            fontSize
        },
        showValue
    });

    singleSlider.value = value;

    singleSlider.onUpdate.connect((value) => onChange(Math.round(value)));

    return singleSlider;
}
