import { Server } from "socket.io";
import { Game, Champion } from '../../db/db';
import { GAME_ACTIONS } from "../../registerSocketHandlers";
import { type ExcludedTiers } from "./excludeChampions";


export const onBanChampions = async (gameId: string, champions: string[], excludedTiers: ExcludedTiers,io: Server) => {
    try {
        const currentGame = await Game.findById(gameId);
        const allChampions = await Champion.find();
        const championsWithoutExcludedTier = allChampions.filter(c => !currentGame?.excludedTiers.includes(c.tier as string));
        const championsToSend = championsWithoutExcludedTier.filter(c => !champions.includes(c.name as string));
        if (currentGame?.picks) {
            const filteredTeam1 = currentGame.picks.Team1.filter(
                (c) => !champions.includes(c.name!)
            );
            const filteredTeam2 = currentGame.picks.Team2.filter(
                (c) => !champions.includes(c.name!)
            );

            // Mutate the DocumentArray instead of reassigning it
            currentGame.picks.Team1.splice(0, currentGame.picks.Team1.length, ...filteredTeam1);
            currentGame.picks.Team2.splice(0, currentGame.picks.Team2.length, ...filteredTeam2);
        }
       
        currentGame?.bannedChampions.push(...champions);
        //MAYBE REMOVE THE CURRENT PICKS FROM THE PLAYER ????
         const playersToPickAgain = currentGame?.pickedBy.map((p) => {
            const bannedCount = p.champions.filter((champ) => currentGame.bannedChampions.includes(champ.name as string)).length;

            return bannedCount > 0
            ? { name: p.name, picksNeeded: bannedCount }
            : null;
        }).filter(Boolean);
        await currentGame?.save();
        io.emit(GAME_ACTIONS.CHAMPIONS_BANNED, { champions: championsToSend, players: playersToPickAgain });
    } catch (err) {
        throw new Error(`Failed in: onBanChampions with error: ${err}`)
    }
}