import { useEffect } from 'react';

import { useNavigate, useParams } from 'react-router';

import { useGameContext } from 'pages/GameAction/contexts/GameProvider';

interface PlayersToPickAgain {
  name: string;
  picksNeeded: number;
}

export const useNavigateBackPlayersWhoPickAgain = (playersToPickAgain: PlayersToPickAgain[]) => {
  const { player } = useGameContext();
  const navigate = useNavigate();
  const { action, mode, team } = useParams();

  useEffect(() => {
    if (player && playersToPickAgain.map((p) => p.name).includes(player)) {
      navigate(`/game/${action}/${mode}/lobby/${team}/pick`);
    }
  }, [navigate, player, playersToPickAgain, action, mode, team]);
};
