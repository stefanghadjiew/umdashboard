import { useEffect } from 'react';

import { socket } from 'socket';

import { useGameContext } from 'pages/GameAction/contexts/GameProvider';

import { GAME_ACTIONS } from 'pages/GameAction';
import { type Champion } from 'pages/PickPhase';

interface PlayersToPickAgain {
  name: string;
  picksNeeded: number;
}

export const useHandlePlayersWhoShouldPickAgain = (
  setPlayersToPickAgain: React.Dispatch<React.SetStateAction<PlayersToPickAgain[]>>
) => {
  const { player, handleNumberOfPicks } = useGameContext();

  useEffect(() => {
    const handleUpdatePlayersThatShouldPickAgain = (data: { champions: Champion[]; players: PlayersToPickAgain[] }) => {
      setPlayersToPickAgain(data.players);
      handleNumberOfPicks(data.players.filter((p) => p.name === player)[0].picksNeeded);
    };
    socket.on(GAME_ACTIONS.CHAMPIONS_BANNED, handleUpdatePlayersThatShouldPickAgain);

    return () => {
      socket.off(GAME_ACTIONS.CHAMPIONS_BANNED, handleUpdatePlayersThatShouldPickAgain);
    };
  }, [player]);
};
