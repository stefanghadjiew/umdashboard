import { socket } from 'socket';

import { Button } from '@components';

import { GAME_ACTIONS } from '@pages';

export const ResetGameButton = () => {
  const handleResetGame = () => {
    socket.emit(GAME_ACTIONS.RESET_GAME);
  };

  return <Button onClick={handleResetGame}>Reset Game</Button>;
};
