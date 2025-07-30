import { useEffect } from 'react';

import { socket } from 'socket';

import { useAsyncEmits } from 'pages/hooks/useAsyncEmits';

import { GAME_ACTIONS } from 'pages/GameAction';

import { type Champion } from '../PickPhase';

export const useJoinGameboard = (
  setAllChampions: (value: React.SetStateAction<Champion[]>) => void,
  gameId: string
) => {
  const asyncEmit = useAsyncEmits();
  useEffect(() => {
    const joinGameboard = async () => {
      try {
        const response = (await asyncEmit(socket, GAME_ACTIONS.JOIN_GAMEBOARD, { gameId })) as Record<
          'champions',
          Champion[]
        >;
        if ('champions' in response) {
          setAllChampions(response.champions);
        }
      } catch (error) {
        console.error('Error joining gameboard:', error);
      }
    };
    joinGameboard();
  }, []);
};
