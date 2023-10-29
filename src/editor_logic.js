import { range } from "./utils";

export class EditorLogic {
    constructor() {

    }

    onClickRod(board, rod) {
        return () => {}
    }

    onClickPin(board, pin) {
        return () => {
            if (pin.active) {
                pin.active = false
                board.basePin(pin.x_index, pin.y_index)
            } else {
                pin.active = true
                board.highlightPin(pin.x_index, pin.y_index)
            }
        }
    }
}