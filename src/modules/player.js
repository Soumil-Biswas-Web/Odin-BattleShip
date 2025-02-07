const player = (board, isCPU = false) => {
    // Each player should have his own gameboard.
    return {
        board,
        isCPU
    }
}

export { player };