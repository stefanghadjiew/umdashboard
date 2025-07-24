import { Game, Champion as ChampionDB } from '../../db/db';

export const filterChampionsBasedOnBanAndExcludedTiers =async  (gameId: string,bannedChampions?: string[]) => {
    try {
        const currentGame = await Game.findById(gameId);
        const allChampions = await ChampionDB.find();
        const championsWithoutExcludedTier = allChampions.filter(c => !currentGame?.excludedTiers.includes(c.tier as string));
        const remainingChampions = bannedChampions ? championsWithoutExcludedTier.filter(c => !bannedChampions?.includes(c.name as string)) : championsWithoutExcludedTier;
        return remainingChampions;
    } catch (err) {
        throw new Error(`Failed in: filterChampionsBasedOnBanAndExcludedTiers with error: ${err}`)
    }
}