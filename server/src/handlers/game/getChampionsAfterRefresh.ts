import { Socket } from 'socket.io';
import { Game } from '../../db/db';
import { GAME_ACTIONS } from '../../registerSocketHandlers';

export const onGetChampionsAfterRefresh = async (gameId: string, socket: Socket) => {
    try {
        const game = await Game.findById(gameId);
        if (!game) return;
        socket.emit(GAME_ACTIONS.SEND_TEAM_PICKS_AFTER_REFRESH, (game.picks))
    } catch (err) {
        throw new Error(`Failed in: onGetChampionsAfterRefresh with error: ${err}`)
    }
}