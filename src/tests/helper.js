const countShips = (gameboard) => {
    const uniqueShips = new Set();
  
    gameboard.board.forEach((row) => {
      row.forEach((cell) => {
        if (cell) {
          uniqueShips.add(cell);
        }
      });
    });
  
    return uniqueShips.size;
};

const countShipCells = (gameboard) =>
    gameboard
      .board
      .reduce(
        (totalSum, row) => totalSum + row.reduce((rowSum, cell) => rowSum + (cell ? 1 : 0), 0), 0);

export { countShips, countShipCells };