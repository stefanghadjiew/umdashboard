import { useEffect } from 'react';

import { socket } from 'socket';

import { GAME_ACTIONS } from 'pages/GameAction';

import { type Champion } from '../PickPhase';

export const useExcludeTiers = (setAllChampions: (value: React.SetStateAction<Champion[]>) => void) => {
  useEffect(() => {
    const updateChampionsAfterExclude = (data: { champions: Champion[] }) => {
      setAllChampions(data.champions);
    };
    socket.on(GAME_ACTIONS.CHAMPIONS_EXCLUDED, updateChampionsAfterExclude);

    return () => {
      socket.off(GAME_ACTIONS.CHAMPIONS_EXCLUDED, updateChampionsAfterExclude);
    };
  }, []);
};
