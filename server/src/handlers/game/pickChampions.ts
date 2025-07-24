import { Server } from 'socket.io';
import { Game } from '../../db/db';
import { GAME_ACTIONS } from '../../registerSocketHandlers';

export interface Champion {
  _id: string;
  name: string;
  tier: 'S+' | 'S' | 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C';
}

interface Data {
    gameId: string;
    player: string;
    champions: Champion[];
    team: 'Team1' | 'Team2';
}


export const onPickChampions = async (data: Data, io: Server) => {
  const { gameId, player, champions, team } = data;
  try {
    const currentGame = await Game.findById(gameId);

    if (!currentGame) return;

    if(!currentGame.picks) return;

    if (champions.length > 2) {
        throw new Error('Cannot pick more than 2 champions at once.');
    }

    const existingChampions = currentGame.picks[team]?.map(c => c.name);
    const newPicks = champions.filter(c => !existingChampions.includes(c.name));
    currentGame.picks[team].push(...newPicks);
    currentGame.pickedBy.push({name: player, champions})

    await currentGame.save();

    io.to(gameId).emit(GAME_ACTIONS.TEAM_PICKS_UPDATED, currentGame.picks);
  } catch (err) {
    throw new Error(`Failed in: onPickChampions with error: ${err}`);
  }
};