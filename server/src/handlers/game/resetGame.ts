import { Server } from 'socket.io';
import { Game } from '../../db/db';
import { GAME_ACTIONS } from '../../registerSocketHandlers';

export const onResetGame = async (gameId: string, io: Server) => {
    try {
        const currentGame = await Game.findById(gameId);
        if(!currentGame) {
            return;
        }
        currentGame.status = 'Finished';
        await currentGame.save();
        io.emit(GAME_ACTIONS.GAME_RESET)
    } catch (err) {
        throw new Error(`Failed in onResetGame with error: ${err}`)
    }
}