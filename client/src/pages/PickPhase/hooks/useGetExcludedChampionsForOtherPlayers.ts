import { useEffect } from 'react';

import { socket } from 'socket';

import { useGameContext } from 'pages/GameAction/contexts/GameProvider';

import { GAME_ACTIONS } from 'pages/GameAction';
export const useGetExcludedChampionsForOtherPlayers = () => {
  const { gameId, gameMaster, player } = useGameContext();
  const isGameMaster = player === gameMaster;
  useEffect(() => {
    if (!isGameMaster) {
      socket.emit(GAME_ACTIONS.GET_EXCLUDED_CHAMPIONS, { gameId });
    }
  }, [gameId, isGameMaster]);
};
