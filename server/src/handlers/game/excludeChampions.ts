import { GAME_ACTIONS } from "../../registerSocketHandlers";
import { Game, Champion } from '../../db/db';
import { Server } from "socket.io";
import { filterChampionsBasedOnBanAndExcludedTiers } from "./helper";

export type ExcludedTiers = ("S+" | "S" | "A+" | "A" | "B+" | "B" | "C+" | "C" | 'D+'|  null | undefined)[]


export const onExcludeChampions = async (gameId: string,excludedTiers: ExcludedTiers,io: Server) => {
    try {
        const currentGame = await Game.findById(gameId);
        const allChampions = await Champion.find();
        const excluded = allChampions.filter(c => !excludedTiers.includes(c.tier) && !currentGame?.bannedChampions.includes(c.name as string));
        if(!currentGame) return;
        const cleanedTiers = excludedTiers.filter(
            (t): t is Exclude<typeof t, null | undefined> => t !== null && t !== undefined
        );
        currentGame.excludedTiers = cleanedTiers;
        await currentGame.save();
        io.emit(GAME_ACTIONS.CHAMPIONS_EXCLUDED, { champions: excluded })
    } catch (err) {
        throw new Error(`Failed in: onExcludeChampions with error: ${err}`)
    }
}