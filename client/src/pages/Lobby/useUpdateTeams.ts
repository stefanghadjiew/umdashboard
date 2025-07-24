import { useEffect, useState } from 'react';

import { Socket } from 'socket.io-client';

import { GAME_ACTIONS } from 'pages/GameAction';

interface Player {
  name: string;
  team: 'Team1' | 'Team2';
}

const teams = ['Team1', 'Team2'];

export const useUpdateTeams = (socket: Socket, gameId?: string | null) => {
  const [team1Players, setTeam1Players] = useState<Player[] | null>(null);
  const [team2Players, setTeam2Players] = useState<Player[] | null>(null);

  useEffect(() => {
    const updateTeams = (players: Player[]) => {
      const team1Players = players.filter((p) => p.team === teams[0]);
      const team2Players = players.filter((p) => p.team === teams[1]);
      setTeam1Players(team1Players);
      setTeam2Players(team2Players);
    };
    if (gameId) {
      socket.emit(GAME_ACTIONS.GET_PLAYERS, { gameId }, (response: { players?: Player[]; error?: string }) => {
        if (response.players) {
          updateTeams(response.players);
        }
      });
    }

    return () => {
      socket.off(GAME_ACTIONS.GET_PLAYERS);
    };
  }, [gameId]);

  return { team1Players, team2Players };
};
