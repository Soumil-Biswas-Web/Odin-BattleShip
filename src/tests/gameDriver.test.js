import { gameDriver } from "../modules/gameDriver";

describe('gameDriver initialization test', () => {
    let game = gameDriver();

    it('initializes both players with new boards', () => {
        expect(game.player1.board.sizey).toBe(10);
        expect(game.player2.board.sizey).toBe(10);
    })

    it('has no pre-decided winner when initialized', () => {
        expect(game.winner).toBe(null);
    })

    it('sets the human player to have the first turn', () => {
        expect(game.currentPlayer).toEqual(game.player1);
    })
})