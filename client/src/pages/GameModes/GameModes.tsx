import classes from './GameModes.module.scss';

import { useNavigate } from 'react-router';

import { socket } from 'socket';

import { BackButton, Button } from '@components';

import { useGameContext } from 'pages/GameAction/contexts/GameProvider';

import { GAME_ACTIONS } from 'pages/GameAction';

const gameModes = ['1vs1', '2vs2'];

export const GameModes = () => {
  const { gameId } = useGameContext();
  const navigate = useNavigate();
  const handle1V1Mode = () => {
    socket.emit(GAME_ACTIONS.SELECT_MODE, { mode: gameModes[0], gameId });
    navigate(`/game/create/${gameModes[0]}/lobby`);
  };
  const handle2V2Mode = () => {
    socket.emit(GAME_ACTIONS.SELECT_MODE, { mode: gameModes[1], gameId });
    navigate(`/game/create/${gameModes[1]}/lobby`);
  };

  return (
    <div className={classes.gameModes}>
      <Button style={{ opacity: '0.5', pointerEvents: 'none', cursor: 'not-allowed' }} onClick={handle1V1Mode}>
        1 vs 1
      </Button>
      <Button onClick={handle2V2Mode}>2 vs 2</Button>
      <BackButton />
    </div>
  );
};
