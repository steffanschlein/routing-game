import { range } from "./utils";

export class GameLogic {
    constructor(updateUsedRodInfo) {
        this.updateUsedRodInfo = updateUsedRodInfo
        this.bulkModeStart = null
    }

    onClickRod(board, rod) {
        return () => {
            board.toggleRod(rod);
            this.updateUsedRodInfo()
        }
    }

    onClickPin(board, pin) {
        return () => {
            if (this.bulkModeStart === null) {
                this.bulkModeStart = [pin.x_index, pin.y_index]
                board.selectPin(this.bulkModeStart[0], this.bulkModeStart[1])
            } else {
                if (board.pins[this.bulkModeStart[0]][this.bulkModeStart[1]].active) {
                    board.highlightPin(this.bulkModeStart[0], this.bulkModeStart[1])
                } else {
                    board.basePin(this.bulkModeStart[0], this.bulkModeStart[1])
                }
                if (pin.x_index === this.bulkModeStart[0] && pin.y_index !== this.bulkModeStart[1]) {
                    range(this.bulkModeStart[1], pin.y_index).forEach(y_index => {
                        const rod = board.rods_vertical[pin.x_index][y_index]
                        board.toggleRod(rod);
                    })
                } else if (pin.x_index !== this.bulkModeStart[0] && pin.y_index === this.bulkModeStart[1]) {
                    range(this.bulkModeStart[0], pin.x_index).forEach(x_index => {
                        const rod = board.rods_horizontal[x_index][pin.y_index]
                        board.toggleRod(rod);
                    })
                }
                this.bulkModeStart = null
                this.updateUsedRodInfo()
            }
        }
    }
}