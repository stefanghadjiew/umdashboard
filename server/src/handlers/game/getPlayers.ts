import { Game } from '../../db/db';

export const onGetPlayers = async (gameId: string, callback: Function) => {
    try {
        const game = await Game.findById(gameId);
        if (!game) return callback({ error: 'Game not found' });
        callback({ players: game.players });
    } catch (err) {
        throw new Error(`Failed in: onGetPlayers with error: ${err}!`)
    }
}