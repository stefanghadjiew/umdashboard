import { useEffect, useState } from 'react';

import type { Socket } from 'socket.io-client';

import { useAsyncEmits } from 'pages/hooks/useAsyncEmits';

import { GAME_ACTIONS } from '@pages';

import type { Game } from '../GameProvider';

export const useGetActiveGames = (socket: Socket) => {
  const [activeGames, setActiveGames] = useState<Game[]>([]);
  const asyncEmit = useAsyncEmits();

  useEffect(() => {
    const getActiveGames = async () => {
      const response = (await asyncEmit(socket, GAME_ACTIONS.GET_CURRENT_ACTIVE_GAMES)) as Record<
        'activeGames',
        Game[]
      >;
      setActiveGames(response.activeGames);
    };
    getActiveGames();
  }, []);

  return { activeGames };

  // TODO: Maybe with pooling ???

  /* useEffect(() => {
        const getActiveGames = async () => {
          const response = (await asyncEmit(socket, GAME_ACTIONS.GET_CURRENT_ACTIVE_GAMES)) as Record<
            'activeGames',
            Game[]
          >;
          setActiveGames(response.activeGames);
        };
        getActiveGames();
    
        const interval = setInterval(() => {
          getActiveGames();
        }, 5000);
    
        return () => clearInterval(interval);
      }, []); */
};
