import { useCallback, useState } from 'react';

import { useParams } from 'react-router-dom';

import { Socket } from 'socket.io-client';

import { useGameContext } from 'pages/GameAction/contexts/GameProvider';

import { GAME_ACTIONS } from '@pages';
import type { Champion } from 'pages/PickPhase';

export const useToggleChampionPick = (numberOfPicks: number, teammatePickedChamps: Champion[], socket: Socket) => {
  const [pickedChampions, setPickedChampions] = useState<Champion[]>([]);
  const { team } = useParams();
  const { player, gameId } = useGameContext();

  const handlePickChampion = useCallback(
    (champion: Champion) => {
      setPickedChampions((prev) => {
        let updated: Champion[];

        if (teammatePickedChamps.map((c) => c.name).includes(champion.name)) {
          return prev;
        }
        if (prev.some((c) => c.name === champion.name)) {
          updated = prev.filter((c) => c.name !== champion.name);
        } else if (prev.length === +numberOfPicks) {
          updated = [...prev.slice(0, -1), champion];
        } else {
          updated = [...prev, champion];
        }
        socket.emit(GAME_ACTIONS.PLAYER_PICKING_CHAMPIONS, {
          gameId,
          champions: updated,
          player,
          team
        });

        return updated;
      });
    },
    [teammatePickedChamps, numberOfPicks, gameId, player, team, socket]
  );

  return { pickedChampions, handlePickChampion };
};
