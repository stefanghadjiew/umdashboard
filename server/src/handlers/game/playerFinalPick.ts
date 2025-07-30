
import mongoose from 'mongoose';
import { Game } from '../../db/db';
import { Champion } from './pickChampions';
import { Server } from 'socket.io';
import { GAME_ACTIONS } from '../../registerSocketHandlers';

const updatePlayerPicks = async (gameId: string, team: 'Team1' | 'Team2', player: string, champion: Champion | null) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await Game.updateOne(
      { _id: gameId },
      { $pull: { [`finalPicks.${team}`]: { player } } },
      { session }
    );

    await Game.updateOne(
      { _id: gameId },
      { $push: { [`finalPicks.${team}`]: { player, champions: champion } } },
      { session }
    );

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const onPlayerFinalPick = async (gameId: string,champion: Champion | null, player: string, team:'Team1' | 'Team2', io: Server) => {
    if (!['Team1', 'Team2'].includes(team)) return;

    try {
        await updatePlayerPicks(gameId, team, player, champion);
        const currentGame = await Game.findById(gameId);
        io.emit(GAME_ACTIONS.FINAL_PICKS_BY_PLAYERS, { finalPicks: currentGame?.finalPicks })
    } catch (err) {
        console.error(`Failed to update player picks: ${err}`);
    }
}