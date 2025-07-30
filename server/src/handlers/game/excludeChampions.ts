import { GAME_ACTIONS } from "../../registerSocketHandlers";
import { Game } from '../../db/db';
import { Server } from "socket.io";

export type ExcludedTiers = ("S+" | "S" | "A+" | "A" | "B+" | "B" | "C+" | "C" | 'D+'|  null | undefined)[]


export const onExcludeChampionTiers = async (gameId: string,excludedTiers: ExcludedTiers,io: Server) => {
    try {
        const currentGame = await Game.findById(gameId);
        if(!currentGame) return;
        const excluded = currentGame?.championPool.filter(c => !excludedTiers.includes(c.tier) && !currentGame?.bannedChampions.includes(c.name as string));
        const updatedGame  = await Game.findByIdAndUpdate(gameId, {
            $set: { 
                championPool: excluded,
                excludedTiers
            },
        }, { new: true })
        io.emit(GAME_ACTIONS.CHAMPION_TIERS_EXCLUDED, { champions: updatedGame?.championPool })
    } catch (err) {
        throw new Error(`Failed in: onExcludeChampions with error: ${err}`)
    }
}