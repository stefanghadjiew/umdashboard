import { useEffect } from 'react';

import { useParams } from 'react-router-dom';

import type { Socket } from 'socket.io-client';

import { useGameContext } from 'pages/GameAction/contexts/GameProvider';

import { GAME_ACTIONS } from '@pages';

import type { Champion } from '../PickPhase';

interface PlayerPick {
  player: string;
  champions: Champion[];
}
interface CurrentPicks {
  Team1: PlayerPick[];
  Team2: PlayerPick[];
}

export const useShowTeammatePicks = (
  setTeammatePickedChamps: React.Dispatch<React.SetStateAction<Champion[]>>,
  socket: Socket
) => {
  const { player } = useGameContext();
  const { team } = useParams();
  useEffect(() => {
    const handleUpdateTeammatePicks = ({ currentPicks }: { currentPicks: CurrentPicks }) => {
      const teamKey = team as 'Team1' | 'Team2';
      const teamMate = currentPicks[teamKey].filter((p) => p.player !== player)[0];
      setTeammatePickedChamps(teamMate ? teamMate.champions : []);
    };
    socket.on(GAME_ACTIONS.CHAMPIONS_PICKED_BY_PLAYER, handleUpdateTeammatePicks);

    return () => {
      socket.off(GAME_ACTIONS.CHAMPIONS_PICKED_BY_PLAYER, handleUpdateTeammatePicks);
    };
  }, [player, setTeammatePickedChamps, socket, team]);
};
