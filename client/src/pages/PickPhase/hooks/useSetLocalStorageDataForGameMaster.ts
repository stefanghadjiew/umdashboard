import { useEffect } from 'react';

import { useGameContext } from 'pages/GameAction/contexts/GameProvider';

export const useSetLocalStorageDataForGameMaster = (excludedTiers: ('S+' | 'D+')[]) => {
  const { player, gameMaster } = useGameContext();
  const isGameMaster = player === gameMaster;
  useEffect(() => {
    if (isGameMaster) {
      localStorage.setItem('excludedTiers', JSON.stringify(excludedTiers));
    }
  }, [excludedTiers, isGameMaster]);
};
