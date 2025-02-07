import { ship } from "./ship";

// Array of ships, each item is for the ship's length
const shipTypes = [ 1,1,1,2,2,3,4 ];


const gameBoard = (sizey) => {
    if(!Number.isInteger(sizey)){
        throw new Error('Board size must be an integer');
    }
    if(sizey < 1) {
        throw new Error('Board size must be greater than 0');
    }

    // Create a ship stat screen for each ship
    const shipStats = shipTypes.map((shipType, index) => ({
        id: index,
        ship: ship(shipType),
        isPlaced: false,
        coords: { x: null, y: null },
        direction: null,
    }));

    let board = new Array(sizey)
        .fill(false)
        .map(() => new Array(sizey).fill(null));

    let adjacents = new Array(sizey)
        .fill(false)
        .map(() => new Array(sizey)
            .fill(false)
            .map(() => new Set())
        );

    let shots = new Array(sizey)
        .fill(false)
        .map(() => new Array(sizey).fill(false));

    // Place new Ship at [x,y]
    const placeShip = (x,y, index, direction) => {
        if (index > shipTypes.length)
                throw new Error('No ship exists in this index');                
        
        let newShip = shipStats[index];

        if (newShip.isPlaced) {
            throw new Error(`Ship of index ${index} has already been placed`);
        }
      
        if (!Number.isInteger(x) || !Number.isInteger(y))
            throw new Error('Ship origin X/Y must be an integer');
      
        if (direction !== 'right' && direction !== 'down')
            throw new Error('Direction must be either "right" or "down"');
      
        if (
            x < 0 ||
            y < 0 ||
            x >= sizey ||
            y >= sizey
        )
            throw new Error('Cannot place ship out of bounds');
        if (direction === 'right') {
            if (x + newShip.ship.length > sizey)
              throw new Error('Cannot place ship out of bounds');
        } else if (y + newShip.ship.length > sizey)
                throw new Error('Cannot place ship out of bounds');

        // Calculate placement for new ship
        let newShipCoords = findNewShipCoords(x,y, newShip.ship.length, direction);

        // Should not overlap with any other existing ships
        newShipCoords.forEach(([x,y]) => {
            if (adjacents[y][x].size > 0){
                throw new Error ('Cannot place ship adjacent to or overlapping another ship')
            }
        })
        // Set adjacent blocks of ship as occupied
        newShipCoords.forEach(([x,y]) => {
            board[y][x] = newShip.ship
            toggleAdjacents(x, y, newShip.ship, 'add');
        })
        
        newShip.isPlaced = true;
        newShip.coords.x = x;
        newShip.coords.y = y;
        newShip.direction = direction;
    }

    // Find out grid blocks occupied by a given ship
    const findNewShipCoords = (x,y, length, direction) => {

        let shipCoords = [];

        switch (direction) {
            case "right":{
                for (let i = 0; i < length; i ++){
                    shipCoords.push([x+i,y]);
                }
                break;
            }
            case "down":{
                for (let i = 0; i < length; i ++){
                    shipCoords.push([x,y+i]);
                }
                break;
            }              
        }          
        return shipCoords;
    }

    // Mark blocks adjacent to a placed ship
    const toggleAdjacents = (x, y, ship, type) => {
        for (
            let row = Math.max(0, y - 1);
            row <= Math.min(y + 1, sizey - 1);
            row++
        ) {
            for (
              let col = Math.max(0, x - 1);
              col <= Math.min(x + 1, sizey - 1);
              col++
            ) {
              if (type === 'add') {
                adjacents[row][col].add(ship);
              } else if (type === 'remove') {
                adjacents[row][col].delete(ship);
              }
            }
        }        
    }

    const clearBoard = () => {
        for (let x = 0; x < sizey; x++) {
            for (let y = 0; y < sizey; y++) {
              board[y][x] = null;
              shots[y][x] = false;
              adjacents[y][x].clear();
            }
        }
      
        shipStats.forEach((stat) => {
            stat.isPlaced = false;
            stat.coords.x = null;
            stat.coords.y = null;
            stat.direction = null;
        });        
    }

    const placeRandom = () => {
        clearBoard();

        shipStats.forEach((stat, index) => {
            if(stat.ship.length > 0){
                let placed = false;
                while(!placed){
                    const x = Math.floor(Math.random() * sizey);
                    const y = Math.floor(Math.random() * sizey);
                    const direction = Math.random() < 0.5 ? "right" : "down";
                    try{
                        placeShip(x, y, index, direction)
                        stat.isPlaced = true;
                        placed = true;
                    }
                    catch(e){
                        // No need to do anything if an error is encountered
                    }
                }
            }
        })
    }

    //Should receive attacks to damage ships    
    // Should keep track of missed shots
    const recieveAttack = (x,y) =>{
        // Find out if attack hit a ship or missed
        if(!Number.isInteger(x) || !Number.isInteger(y)){
            throw new Error('Coordinates [x,y] must be integers');
        }
        if (x < 0 || x >= sizey || y < 0 || y >= sizey)
            throw new Error('Attack coordinates out of bounds');
        if (shots[y][x]) throw new Error('Attack coordinates already hit');
        
        shots[y][x] = true;

        if(board[y][x]) {
            board[y][x].hit();
            return true;
        }

        return false;
    }

    // Win Condition: Report when all ships are sunk.
    const loss = () => board.every((row) => row.every((e) => e === null || e.isSunk() === true));

    return {
        sizey,
        board,
        shotsRecieved: () => shots,
        placeShip,
        placeRandom,
        recieveAttack,
        loss,
    }
}

export { gameBoard };