import { useEffect, useState } from 'react';

import { Socket } from 'socket.io-client';

import { GAME_ACTIONS } from 'pages/GameAction';
import { type Champion } from 'pages/PickPhase';

interface Picks {
  Team1: Champion[];
  Team2: Champion[];
}

export const useGetTeamPicksAfterRefresh = (socket: Socket, gameId?: string | null) => {
  const [team1Champions, setTeam1Champions] = useState<Champion[] | null>(null);
  const [team2Champions, setTeam2Champions] = useState<Champion[] | null>(null);
  useEffect(() => {
    const updateChampions = (picks: Picks) => {
      setTeam1Champions(picks.Team1);
      setTeam2Champions(picks.Team2);
    };
    socket.emit(GAME_ACTIONS.GET_TEAM_PICKS_AFTER_REFRESH, { gameId });

    socket.on(GAME_ACTIONS.SEND_TEAM_PICKS_AFTER_REFRESH, updateChampions);

    return () => {
      socket.off(GAME_ACTIONS.SEND_TEAM_PICKS_AFTER_REFRESH, updateChampions);
    };
  }, [gameId, socket]);
  return { team1ChampionsRefreshed: team1Champions, team2ChampionsRefreshed: team2Champions };
};
