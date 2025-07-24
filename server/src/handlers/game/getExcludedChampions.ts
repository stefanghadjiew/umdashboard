import { Socket } from 'socket.io';
import { Game, Champion } from '../../db/db';
import { GAME_ACTIONS } from '../../registerSocketHandlers';

export const onGetExcludedChampions = async (gameId: string, socket: Socket) => {
    try {
        const currentGame = await Game.findById(gameId);
        const allChampions = await Champion.find();
        const championsWithoutExcludedTier = allChampions.filter(c => !currentGame?.excludedTiers.includes(c.tier as string));
        const championsWithoutBanned = championsWithoutExcludedTier.filter(c => !currentGame?.bannedChampions.includes(c.name as string));
        socket.emit(GAME_ACTIONS.RECIEVE_EXCLUDED_CHAMPIONS, { champions : championsWithoutBanned })
    } catch (err) {
        throw new Error(`Failed in: onGetExcludedChampions with error: ${err}`)
    }
}