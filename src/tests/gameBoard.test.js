import { gameBoard } from "../modules/gameBoard";
import { countShips, countShipCells } from "./helper";

describe('gameBoard tests before a new game borad is created', () => {
    it('throws an error when creating a board of invalid length', () => {
        expect(() => {
            gameBoard("mommy")
        }).toThrow('Board size must be an integer');
        expect(() => {
            gameBoard(-69)
        }).toThrow('Board size must be greater than 0');
        expect(() => {
            gameBoard([10][15])
        }).toThrow('Board size must be an integer');        
    })
})

describe('gameBoard tests after a new game borad is created', () => {

    let newGameBoard, board, shotsRecieved;

    beforeEach(() => {
        newGameBoard = gameBoard(10);
        board = newGameBoard.board;
        shotsRecieved = newGameBoard.shotsRecieved();
    })

    it('Creates an empty game board when initialized', () => {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                expect(board[i][j]).toBe(null);
            }
        }
        expect(newGameBoard.sizey).toBe(10);
    })
    it('makes sure no shots are recieve in the board when initialized', () => {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                expect(shotsRecieved[i][j]).toBe(false);
            }
        }
    })

    it('places a single ship', () => {
        newGameBoard.placeShip(0, 0, 0, "right");
        expect(board[0][0].length).toBe(1);
    })
    it('places multiple ships', () => {
        newGameBoard.placeShip(0, 0, 1, "right");
        newGameBoard.placeShip(8, 8, 3, "down");
        newGameBoard.placeShip(5, 5, 4, "right");
        expect(board[0][0].length).toBe(1);
        expect(board[9][8].length).toBe(2);
        expect(board[5][5].length).toBe(2);
    })
    it('throws an error when placing more ships than in the game', () => {
        expect(() => {newGameBoard.placeShip(5, 5, 10, "right")}).toThrow('No ship exists in this index');
    })
    it('throws an error when creating a ship of invalid length and direction', () => {
        expect(() => {newGameBoard.placeShip('-W-', 5, 2, "right")}).toThrow('Ship origin X/Y must be an integer');
        expect(() => {newGameBoard.placeShip(5, [5], 2, "right")}).toThrow('Ship origin X/Y must be an integer');
        expect(() => {newGameBoard.placeShip(5, 7, 2, "florida")}).toThrow('Direction must be either "right" or "down"');
    })
    it('throws an error if placing a ship out of bounds', () => {
        expect(() => {newGameBoard.placeShip(5, 15, 2, "right")}).toThrow('Cannot place ship out of bounds');
        expect(() => {newGameBoard.placeShip(15, 5, 2, "down")}).toThrow('Cannot place ship out of bounds');
        expect(() => {newGameBoard.placeShip(15, 15, 2, "right")}).toThrow('Cannot place ship out of bounds');
    })
    it('throws an error if placing 2 ships in overlapping positions', () => {
        newGameBoard.placeShip(0, 0, 0, "right");
        expect(() => {newGameBoard.placeShip(0, 0, 2, "right")}).toThrow('Cannot place ship adjacent to or overlapping another ship');
    })
    it('throws an error if placing a ship adjacent to another', () => {
        newGameBoard.placeShip(0, 0, 0, "right");
        expect(() => {newGameBoard.placeShip(1, 0, 2, "right")}).toThrow('Cannot place ship adjacent to or overlapping another ship');
    })

    it('hits a ship multiple times and sinks it', () => {
        newGameBoard.placeShip(0, 0, 4, "right");
        expect(shotsRecieved[0][0]).toBe(false);
        expect(shotsRecieved[0][1]).toBe(false);
        expect(board[0][0].isSunk()).toBe(false);
        expect(newGameBoard.recieveAttack(0,0)).toBe(true);
        expect(shotsRecieved[0][0]).toBe(true);
        expect(shotsRecieved[0][1]).toBe(false);
        expect(board[0][0].isSunk()).toBe(false);
        expect(newGameBoard.recieveAttack(1,0)).toBe(true);
        expect(shotsRecieved[0][0]).toBe(true);
        expect(shotsRecieved[0][1]).toBe(true);
        expect(board[0][0].isSunk()).toBe(true);
    })
    it('tries to hit a ship and misses', () => {
        newGameBoard.placeShip(0, 0, 0, "right");
        expect(shotsRecieved[0][0]).toBe(false);
        expect(board[0][0].isSunk()).toBe(false);
        expect(newGameBoard.recieveAttack(1,0)).toBe(false);
        expect(shotsRecieved[0][0]).toBe(false);
        expect(board[0][0].isSunk()).toBe(false);
    })
    it('throws an error when attacking the same place twice', () => {
        expect(newGameBoard.recieveAttack(1,0)).toBe(false);
        expect(() => {newGameBoard.recieveAttack(1,0)}).toThrow('Attack coordinates already hit');
    })
    it('throws an error if an attack lands out of bounds', () => {
        expect(() => {newGameBoard.recieveAttack(1,15)}).toThrow('Attack coordinates out of bounds');
    })
    it('throws an error if an attack lands at an invalid coordinate', () => {
        expect(() => {newGameBoard.recieveAttack("dad",5)}).toThrow('Coordinates [x,y] must be integers');
        expect(() => {newGameBoard.recieveAttack("mom","dad")}).toThrow('Coordinates [x,y] must be integers');
    })

    it('checks if the win condition is corectly met', () => {
        newGameBoard.placeShip(0, 0, 0, "right");
        newGameBoard.placeShip(5, 5, 1, "down");
        expect(newGameBoard.recieveAttack(0,0)).toBe(true);
        expect(newGameBoard.loss()).toBe(false);
        expect(newGameBoard.recieveAttack(5,5)).toBe(true);
        expect(newGameBoard.loss()).toBe(true);
    })

    it('places ships randomly', () => {
        newGameBoard.placeRandom();
        expect(countShips(newGameBoard)).toBe(7);
        expect(countShipCells(newGameBoard)).toBe(1 + 1 + 1 + 2 + 2 + 3 + 4);
    })
})