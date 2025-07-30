import { Server } from "socket.io";
import { Game } from '../../db/db';
import { GAME_ACTIONS } from "../../registerSocketHandlers";


export const onBanChampions = async (gameId: string, champions: string[],io: Server) => {
    
    try {
        const currentGame = await Game.findById(gameId);
        const excluded = currentGame?.championPool.filter(c => !champions.includes(c.name as string));
        const updatedGame = await Game.findByIdAndUpdate(gameId, {
        $pull: {
            'picks.Team1': { name: { $in: champions } },
            'picks.Team2': { name: { $in: champions } },
        },
        $addToSet: {
            bannedChampions: { $each: champions },
        },
        $set: {
            championPool: excluded
        }
        }, { new: true });
        
        
        const playersToPickAgain = updatedGame?.pickedBy.map((p) => {
            const bannedCount = p.champions.filter((champ) =>
                updatedGame.bannedChampions.includes(champ.name as string)
            ).length;

            return bannedCount > 0
                ? { name: p.name, picksNeeded: bannedCount }
                : null;
            }).filter(Boolean);
        io.emit(GAME_ACTIONS.CHAMPIONS_BANNED, {
        champions: updatedGame?.championPool,
        players: playersToPickAgain,
        });
    } catch (err) {
        throw new Error(`Failed in: onBanChampions with error: ${err}`)
    }
}