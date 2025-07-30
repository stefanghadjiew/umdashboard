import { useEffect } from 'react';

import { useParams } from 'react-router-dom';

import type { Socket } from 'socket.io-client';

import { useGameContext } from 'pages/GameAction/contexts/GameProvider';

import { GAME_ACTIONS } from '@pages';
import type { Champion } from 'pages/PickPhase';

interface PlayerPick {
  player: string;
  champions: Champion[];
}
interface FinalPicks {
  Team1: PlayerPick[];
  Team2: PlayerPick[];
}

export const useShowTeammatePick = (
  setTeammatePickedChamp: React.Dispatch<React.SetStateAction<Champion[]>>,
  socket: Socket
) => {
  const { player } = useGameContext();
  const { team } = useParams();
  useEffect(() => {
    const handleUpdateTeammatePicks = ({ finalPicks }: { finalPicks: FinalPicks }) => {
      const teamKey = team as 'Team1' | 'Team2';
      const teamMate = finalPicks[teamKey].filter((p) => p.player !== player)[0];
      setTeammatePickedChamp(teamMate ? teamMate.champions : []);
    };
    socket.on(GAME_ACTIONS.FINAL_PICKS_BY_PLAYERS, handleUpdateTeammatePicks);

    return () => {
      socket.off(GAME_ACTIONS.FINAL_PICKS_BY_PLAYERS, handleUpdateTeammatePicks);
    };
  }, [player, setTeammatePickedChamp, socket, team]);
};
