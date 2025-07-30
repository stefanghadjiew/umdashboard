import { socket } from 'socket';

import { Button } from '@components';

import { useGameContext } from 'pages/GameAction/contexts/GameProvider';

import { GAME_ACTIONS } from '@pages';

export const ResetGameButton = () => {
  const { gameId } = useGameContext();
  const handleResetGame = () => {
    socket.emit(GAME_ACTIONS.RESET_GAME, { gameId });
  };

  return <Button onClick={handleResetGame}>Reset Game</Button>;
};
