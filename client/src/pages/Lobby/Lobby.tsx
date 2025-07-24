import classes from './Lobby.module.scss';

import { useState } from 'react';

import { useNavigate, useParams } from 'react-router';

import classNames from 'classnames';
import { socket } from 'socket';

import { BackButton, Button } from '@components';

import { useGameContext } from 'pages/GameAction/contexts/GameProvider';

import { GAME_ACTIONS } from 'pages/GameAction';

import { useUpdateTeams } from './useUpdateTeams';
const teams = ['Team1', 'Team2'];

export const Lobby = () => {
  const [copied, setCopied] = useState(false);
  const { gameId, player } = useGameContext();
  const { team1Players, team2Players } = useUpdateTeams(socket, gameId);
  const { action, mode } = useParams();
  const navigate = useNavigate();

  const shouldDisableJoinTeam1Button = team1Players?.length === 2;
  const shouldDisableJoinTeam2Button = team2Players?.length === 2;
  const joinTeam1BtnClasses = {
    [classes['btn--disabled']]: shouldDisableJoinTeam1Button
  };
  const joinTeam2BtnClasses = {
    [classes['btn--disabled']]: shouldDisableJoinTeam2Button
  };

  const handleCopyToClipboard = async () => {
    if (gameId) {
      await navigator.clipboard.writeText(gameId);
      setCopied(true);
    }
  };
  const handleJoinTeam1 = () => {
    if (shouldDisableJoinTeam1Button) {
      return;
    }
    socket.emit(GAME_ACTIONS.JOIN_TEAM, { team: teams[0], gameId, player });
    navigate(`/game/${action}/${mode}/lobby/${teams[0]}/pick`);
  };
  const handleJoinTeam2 = () => {
    if (shouldDisableJoinTeam2Button) {
      return;
    }
    socket.emit(GAME_ACTIONS.JOIN_TEAM, { team: teams[1], gameId, player });
    navigate(`/game/${action}/${mode}/lobby/${teams[1]}/pick`);
  };

  return (
    <div className={classes.lobby}>
      <div className={classes.clipboard}>
        <h2>Current game is:</h2>
        <h3>{gameId}</h3>
        <Button onClick={handleCopyToClipboard}>{copied ? '✅ Copied' : 'Copy'}</Button>
      </div>
      <div className={classes.buttons}>
        <Button
          disabled={shouldDisableJoinTeam1Button}
          onClick={handleJoinTeam1}
          className={classNames(joinTeam1BtnClasses)}
        >
          🎮 Join Team 1{' '}
        </Button>
        <Button
          disabled={shouldDisableJoinTeam2Button}
          onClick={handleJoinTeam2}
          className={classNames(joinTeam2BtnClasses)}
        >
          🎮 Join Team 2{' '}
        </Button>
        <BackButton />
      </div>
    </div>
  );
};
