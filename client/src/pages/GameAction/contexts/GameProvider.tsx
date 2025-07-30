import { createContext, useContext, useEffect, useState } from 'react';

import { useNavigate } from 'react-router';

import { socket } from 'socket';

import { useGetActiveGames } from './hooks/useGetActiveGames';

import { GAME_ACTIONS } from '../GameAction';

export interface Game {
  _id: string;
  mode?: '1v1' | '2v2';
  players: string[];
  createdBy: string;
}

type GameContextType = {
  activeGames: Game[];
  gameId: string | null;
  player: string | null;
  gameMaster: string | null;
  numberOfPicks: number;
  handleCreatePlayer: (player: string) => void;
  handleCreateGameId: (gameId: string) => void;
  handleCreateGameMaster: (gameMaster: string) => void;
  handleNumberOfPicks: (numberOfPicks: number) => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [gameId, setGameId] = useState<string | null>(() => localStorage.getItem('gameId'));
  const [player, setPlayer] = useState<string | null>(() => localStorage.getItem('player'));
  const [gameMaster, setGameMaster] = useState<string | null>(() => localStorage.getItem('gameMaster'));
  const [numberOfPicks, setNumberOfPicks] = useState(() => {
    const saved = localStorage.getItem('numberOfPicks');
    return saved ? +saved : 2;
  });
  const { activeGames } = useGetActiveGames(socket);
  const navigate = useNavigate();

  const handleNumberOfPicks = (numberOfPicks: number) => {
    setNumberOfPicks(numberOfPicks);
    localStorage.setItem('numberOfPicks', `${numberOfPicks}`);
  };
  const handleCreatePlayer = (player: string) => {
    setPlayer(player);
    localStorage.setItem('player', player);
  };
  const handleCreateGameId = (gameId: string) => {
    setGameId(gameId);
    localStorage.setItem('gameId', gameId);
  };
  const handleCreateGameMaster = (gameMaster: string) => {
    setGameMaster(gameMaster);
    localStorage.setItem('gameMaster', gameMaster);
  };
  const handleResetGame = () => {
    localStorage.removeItem('gameId');
    localStorage.removeItem('numberOfPicks');
    localStorage.removeItem('gameMaster');
    localStorage.removeItem('excludedTiers');
    navigate('/');
  };
  const contextValues = {
    activeGames,
    gameId,
    player,
    handleCreatePlayer,
    handleCreateGameId,
    handleCreateGameMaster,
    gameMaster,
    numberOfPicks,
    handleNumberOfPicks
  };

  useEffect(() => {
    socket.on(GAME_ACTIONS.GAME_RESET, handleResetGame);
  }, []);

  return <GameContext.Provider value={contextValues}>{children}</GameContext.Provider>;
};
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
