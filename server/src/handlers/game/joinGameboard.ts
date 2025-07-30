import { Game } from '../../db/db';

export const onJoinGameboard = async (gameId: string, callback: Function) => {
    try {
        const currentGame = await Game.findById(gameId);
        if(!currentGame) return;
        return callback({champions: currentGame.championPool})
    } catch (err) {
        throw new Error(`Failed in: onJoinGameboard with error: ${err}`)
    }
} 