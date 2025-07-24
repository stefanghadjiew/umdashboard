import classes from './GameAction.module.scss';

import { useNavigate } from 'react-router';

import { socket } from 'socket';

import { Button } from '@components';

import { useGameContext } from 'pages/GameAction/contexts/GameProvider';

import { useAsyncEmits } from 'pages/hooks/useAsyncEmits';

export enum GAME_ACTIONS {
  CREATE_GAME = 'create-game',
  SELECT_MODE = 'select-mode',
  JOIN_GAME = 'join-game',
  JOIN_TEAM = 'join-team',
  GET_PLAYERS = 'get-players',
  JOIN_GAMEBOARD = 'join-gameboard',
  PICK_CHAMPIONS = 'pick-champions',
  GET_CHAMPIONS = 'get-champions',
  TEAM_PICKS_UPDATED = 'team-picks-updated',
  GET_TEAM_PICKS_AFTER_REFRESH = 'team-picks-refresh',
  SEND_TEAM_PICKS_AFTER_REFRESH = 'send-team-picks-refresh',
  EXCLUDE_CHAMPIONS = 'exclude-champions',
  CHAMPIONS_EXCLUDED = 'champions-excluded',
  GET_EXCLUDED_CHAMPIONS = 'get-excluded-champions',
  RECIEVE_EXCLUDED_CHAMPIONS = 'recieve-excluded-champions',
  BAN_CHAMPIONS = 'ban-champions',
  CHAMPIONS_BANNED = 'champions-banned',
  RESET_GAME = 'reset-game',
  GAME_RESET = 'game-reset'
}

socket.connect();

const handleClearOldGame = () => {
  localStorage.removeItem('gameId');
  localStorage.removeItem('gameMaster');
  localStorage.removeItem('excludedTiers');
  localStorage.removeItem('playersToPickAgain');
};
export const GameAction = () => {
  const { player, handleCreateGameId, handleCreateGameMaster } = useGameContext();
  const asyncEmit = useAsyncEmits();
  const navigate = useNavigate();

  const handleCreateGame = async () => {
    if (!player) {
      navigate('/game/add-player');
      return;
    }
    handleClearOldGame();
    const response = (await asyncEmit(socket, GAME_ACTIONS.CREATE_GAME, { createdBy: player })) as Record<
      'gameId',
      string
    >;
    handleCreateGameId(response.gameId);
    handleCreateGameMaster(player);
    navigate('/game/create/mode');
  };
  const handleJoinGame = () => {
    if (!player) {
      navigate('/game/add-player');
      return;
    }
    handleClearOldGame();
    navigate('/game/join-game');
  };
  return (
    <div className={classes.game}>
      <Button onClick={handleCreateGame}>🎮 New Game</Button>
      <Button onClick={handleJoinGame}>🎮 Join Game</Button>
    </div>
  );
};
