import { useEffect } from 'react';

import { socket } from 'socket';

import { useGameContext } from 'pages/GameAction/contexts/GameProvider';

import { GAME_ACTIONS } from 'pages/GameAction';

export const useExcludeChampionTiers = (excludedTiers: ('S+' | 'D+')[]) => {
  const { player, gameMaster, gameId } = useGameContext();

  const isGameMaster = player === gameMaster;

  useEffect(() => {
    if (isGameMaster) {
      socket.emit(GAME_ACTIONS.EXCLUDE_CHAMPIONS, { gameId, excludedTiers });
    }
  }, [excludedTiers, gameId, isGameMaster]);
};
