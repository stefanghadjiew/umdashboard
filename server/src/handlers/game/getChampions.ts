import { Game } from '../../db/db';

export const onGetChampions = async (gameId: string, callback: Function) => {
    try {
        const game = await Game.findById(gameId);
        
        if (!game) return callback({ error: 'Game not found' });
        callback({ picks: game.picks });
    } catch (err) {
        throw new Error(`Failed in: onGetChampions with error : ${err} !`)
    }
}