function encodeBoardConfiguration(boardConfiguration) {
    validateBoardConfiguration(boardConfiguration)
    let accumulator = ""
    accumulator += boardConfiguration.allowedRods.toString(16).padStart(4, "0")
    accumulator += boardConfiguration.width.toString(16).padStart(2, "0")
    accumulator += boardConfiguration.height.toString(16).padStart(2, "0")
    accumulator += boardConfiguration.pinPositions.map(position => {
        return position.x.toString(16).padStart(2, "0") + position.y.toString(16).padStart(2, "0")
    }).join("")
    return accumulator
}

function decodeBoardConfiguration(encodedBoardConfiguration) {
    let boardConfiguration = {}
    boardConfiguration.allowedRods = parseInt(encodedBoardConfiguration.substring(0, 4), 16)
    boardConfiguration.width = parseInt(encodedBoardConfiguration.substring(4, 6), 16)
    boardConfiguration.height = parseInt(encodedBoardConfiguration.substring(6, 8), 16)
    boardConfiguration.pinPositions = []
    for (let i = 8; i < encodedBoardConfiguration.length; i += 4) {
        boardConfiguration.pinPositions.push({
            x: parseInt(encodedBoardConfiguration.substring(i, i + 2), 16),
            y: parseInt(encodedBoardConfiguration.substring(i + 2, i + 4), 16)
        })
    }
    validateBoardConfiguration(boardConfiguration)
    return boardConfiguration
}

function validateBoardConfiguration(boardConfiguration) {
    assert(boardConfiguration.allowedRods > 0 && boardConfiguration.allowedRods < 2**16)
    assert(boardConfiguration.width > 0 && boardConfiguration.width < 2**8)
    assert(boardConfiguration.height > 0 && boardConfiguration.height < 2**8)
    boardConfiguration.pinPositions.every(position => {
        assert(position.x >= 0 && position.x < 2**8)
        assert(position.y >= 0 && position.y < 2**8)
        assert(position.x < boardConfiguration.width)
        assert(position.y < boardConfiguration.height)
    })
}

function assert(bool) {
    if (!bool) {
        throw new Error('AssertionError');
    }
}