
import mongoose from 'mongoose';
import { Game } from '../../db/db';
import { Champion } from './pickChampions';
import { Server } from 'socket.io';
import { GAME_ACTIONS } from '../../registerSocketHandlers';

const updatePlayerPicks = async (gameId: string, team: 'Team1' | 'Team2', player: string, champions: Champion[]) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await Game.updateOne(
      { _id: gameId },
      { $pull: { [`currentPicks.${team}`]: { player } } },
      { session }
    );

    await Game.updateOne(
      { _id: gameId },
      { $push: { [`currentPicks.${team}`]: { player, champions } } },
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

export const onPlayerPickingChampions = async (gameId: string,champions: Champion[], player: string, team:'Team1' | 'Team2', io: Server) => {
    if (!['Team1', 'Team2'].includes(team)) return;

    try {
        await updatePlayerPicks(gameId, team, player, champions);
        const currentGame = await Game.findById(gameId);
        io.emit(GAME_ACTIONS.CHAMPIONS_PICKED_BY_PLAYER, { currentPicks: currentGame?.currentPicks })
    } catch (err) {
        console.error(`Failed to update player picks: ${err}`);
    }
}