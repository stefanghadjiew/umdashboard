import { Game } from '../../db/db';
import { Server } from 'socket.io';
import { GAME_ACTIONS } from '../../registerSocketHandlers';

export const onGetFinalPicksByPlayers = async (gameId:string, io: Server) => {
    try {
        const currentGame = await Game.findById(gameId);
        if(!currentGame) {
            return;
        }
        io.emit(GAME_ACTIONS.START_GAME_REVEAL_PICKS, currentGame?.finalPicks);
    } catch(err) {
        throw new Error(`Failed in onGetFinalPicksByPlayers with error: ${err}`);
    }
}