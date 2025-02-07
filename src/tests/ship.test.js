import { ship } from "../modules/ship";

describe('Ship Tests', () => {
    it('makes sure the ship length is equal to the given length', () => {
        const newShip = ship(4);
        expect(newShip.length).toBe(4);
    })

    it('sinks the ship when it gets hit enough', () => {
        const newShip = ship(2);
        expect(newShip.isSunk()).toBe(false);
        newShip.hit();
        expect(newShip.isSunk()).toBe(false);
        newShip.hit();
        expect(newShip.isSunk()).toBe(true);
    })

    it('throws an error if damaging a dead ship', () => {
        const newShip = ship(1);
        newShip.hit();
        expect(() => {
            newShip.hit();
        }).toThrow('Ship is already deastroyed');
    })    

    it('throws an error if a ship of invalid length is created', () => {
        expect(() => {
            ship(0);
        }).toThrow('Ship length must be greater than 0');
        expect(() => {
            ship(-2);
        }).toThrow('Ship length must be greater than 0');
        expect(() => {
            ship(6.9);
        }).toThrow('Ship length must be an integer');
        expect(() => {
            ship("w");
        }).toThrow('Ship length must be an integer');
        
    })
})