import classes from './GameAction.module.scss';

import { Link, useNavigate } from 'react-router';

import { socket } from 'socket';

import { Button, RefreshButton } from '@components';

import { type Game, useGameContext } from 'pages/GameAction/contexts/GameProvider';

import { useAsyncEmits } from 'pages/hooks/useAsyncEmits';

export enum GAME_ACTIONS {
  CREATE_GAME = 'create-game',
  SELECT_MODE = 'select-mode',
  GET_CURRENT_ACTIVE_GAMES = 'get-active-games',
  JOIN_GAME = 'join-game',
  JOIN_TEAM = 'join-team',
  GET_PLAYERS = 'get-players',
  JOIN_GAMEBOARD = 'join-gameboard',
  PICK_CHAMPIONS = 'pick-champions',
  GET_CHAMPIONS = 'get-champions',
  TEAM_PICKS_UPDATED = 'team-picks-updated',
  GET_TEAM_PICKS_AFTER_REFRESH = 'team-picks-refresh',
  SEND_TEAM_PICKS_AFTER_REFRESH = 'send-team-picks-refresh',
  EXCLUDE_CHAMPION_TIERS = 'exclude-champion-tiers', // only GM
  CHAMPION_TIERS_EXCLUDED = 'champion-tiers-excluded',
  GET_EXCLUDED_CHAMPIONS = 'get-excluded-champions',
  RECIEVE_EXCLUDED_CHAMPIONS = 'recieve-excluded-champions',
  BAN_CHAMPIONS = 'ban-champions',
  CHAMPIONS_BANNED = 'champions-banned',
  RESET_GAME = 'reset-game',
  GAME_RESET = 'game-reset',
  PLAYER_PICKING_CHAMPIONS = 'player-picking-champions',
  CHAMPIONS_PICKED_BY_PLAYER = 'champions-picked-by-player',
  PLAYER_FINAL_PICK = 'player-final-pick',
  FINAL_PICKS_BY_PLAYERS = 'final-picks-by-players',
  GET_FINAL_PICKS_BY_PLAYERS = 'get-final-picks-by-players',
  START_GAME_REVEAL_PICKS = 'start-game-reveal-picks'
}

socket.connect();

// TODO: Aligh this with the GameProvider component
const handleClearOldGame = () => {
  localStorage.removeItem('gameId');
  localStorage.removeItem('gameMaster');
  localStorage.removeItem('excludedTiers');
  localStorage.removeItem('playersToPickAgain');
};
export const GameAction = () => {
  const { player, handleCreateGameId, handleCreateGameMaster, activeGames, handleCreatePlayer } = useGameContext();
  const asyncEmit = useAsyncEmits();
  const navigate = useNavigate();

  const handlePlayer = (): string | null => {
    let playerName = player;
    if (!playerName) {
      playerName = prompt('Please type your nickname');
      if (!playerName) {
        return null;
      }
    }
    return playerName;
  };
  const handleCreateGame = async () => {
    const player = handlePlayer();
    if (!player) {
      return;
    }
    handleClearOldGame();
    handleCreateGameMaster(player);
    handleCreatePlayer(player);
    const response = (await asyncEmit(socket, GAME_ACTIONS.CREATE_GAME, { createdBy: player })) as Record<
      'gameId',
      string
    >;
    handleCreateGameId(response.gameId);
    navigate('/game/create/mode');
  };
  const handleJoinGame = async (game: Game) => {
    const player = handlePlayer();
    if (!player) {
      return;
    }
    const gameToJoin = activeGames?.filter((g) => g._id === game._id)[0];
    if (!gameToJoin) {
      return;
    }
    handleCreatePlayer(player);
    const response = (await asyncEmit(socket, GAME_ACTIONS.JOIN_GAME, { gameId: gameToJoin._id, player })) as Record<
      'mode',
      '1vs1' | '2vs2' | null | undefined
    >;
    handleCreateGameId(gameToJoin._id);
    navigate(`/game/join/${response.mode}/lobby`);
  };
  const renderActiveGames = activeGames.map((game) => (
    <Link key={game._id} to="" onClick={() => handleJoinGame(game)}>{`🎮 Join ${game.createdBy}'s Game`}</Link>
  ));

  return (
    <div className={classes.game}>
      <div className={classes['game__active-games']}>{renderActiveGames}</div>
      <Button onClick={handleCreateGame}>🎮 New Game</Button>
      {/* <Button onClick={handleJoinGame}>🎮 Join Game</Button> */}
      <RefreshButton />
    </div>
  );
};
