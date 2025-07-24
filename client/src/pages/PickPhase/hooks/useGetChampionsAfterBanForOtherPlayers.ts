import { useEffect } from 'react';

import { socket } from 'socket';

import { GAME_ACTIONS } from 'pages/GameAction';

import { type Champion } from '../PickPhase';

export const useGetChampionsAfterBanForOtherPlayers = (
  setAllChampions: (value: React.SetStateAction<Champion[]>) => void
) => {
  useEffect(() => {
    const updateChampions = (data: { champions: Champion[] }) => {
      setAllChampions(data.champions);
    };
    socket.on(GAME_ACTIONS.RECIEVE_EXCLUDED_CHAMPIONS, updateChampions);

    return () => {
      socket.off(GAME_ACTIONS.RECIEVE_EXCLUDED_CHAMPIONS, updateChampions);
    };
  }, []);
};
