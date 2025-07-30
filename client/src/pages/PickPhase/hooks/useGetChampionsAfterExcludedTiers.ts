import { useEffect } from 'react';

import { socket } from 'socket';

import { GAME_ACTIONS } from 'pages/GameAction';

import { type Champion } from '../PickPhase';

export const useGetChampionsAfterExcludedTiers = (
  setAllChampions: (value: React.SetStateAction<Champion[]>) => void
) => {
  useEffect(() => {
    const updateChampionsAfterExclude = (data: { champions: Champion[] }) => {
      setAllChampions(data.champions);
    };
    socket.on(GAME_ACTIONS.CHAMPION_TIERS_EXCLUDED, updateChampionsAfterExclude);

    return () => {
      socket.off(GAME_ACTIONS.CHAMPION_TIERS_EXCLUDED, updateChampionsAfterExclude);
    };
  }, []);
};
