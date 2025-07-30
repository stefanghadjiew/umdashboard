
import { Game } from '../../db/db';

export const onGetCurrentActiveGames = async (callback: Function) => {
    try {
        const activeGames = await Game.find({ status: 'Active' })
        if(!activeGames || activeGames.length === 0) return;
        callback({activeGames})
    } catch (err) {
        throw new Error(`Failed in: onGetCurrentActiveGames with error: ${err}`)
    }
} 