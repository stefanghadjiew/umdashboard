import classes from './PickPhase.module.scss';

import { useMemo, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { socket } from 'socket';

import { Button, ChampionCard } from '@components';

import { useGameContext } from 'pages/GameAction/contexts/GameProvider';

import { useGetChampionsAfterExcludedTiers } from './hooks/useGetChampionsAfterExcludedTiers';
import { useJoinGameboard } from './hooks/useJoinGameboard';
import { useShowTeammatePicks } from './hooks/useShowTeammatePicks';
import { useToggleChampionPick } from 'pages/hooks';

import { GAME_ACTIONS } from 'pages/GameAction';

export interface Champion {
  _id: string;
  name: string;
  tier: 'S+' | 'S' | 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C';
}

export const PickPhase = () => {
  const [allChampions, setAllChampions] = useState<Champion[]>([]);
  const [teammatePickedChamps, setTeammatePickedChamps] = useState<Champion[]>([]);
  const { player, gameId, gameMaster, numberOfPicks } = useGameContext();
  const { pickedChampions, handlePickChampion } = useToggleChampionPick(+numberOfPicks, teammatePickedChamps, socket);
  const { team, mode, action } = useParams();
  const navigate = useNavigate();
  const isGameMaster = player === gameMaster;

  const shouldDisableExclude = (tier: 'S+' | 'D+') => allChampions.every((c) => c.tier !== tier);

  const handleExcludeTiers = () => {
    socket.emit(GAME_ACTIONS.EXCLUDE_CHAMPION_TIERS, { gameId, excludedTiers: ['S+', 'D+'] });
  };
  const handleOnReady = () => {
    socket.emit(GAME_ACTIONS.PICK_CHAMPIONS, { gameId, team, player, champions: pickedChampions });
    navigate(`/game/${action}/${mode}/lobby/${team}/pick/reveal`);
  };
  useJoinGameboard(setAllChampions, gameId ?? '');

  useGetChampionsAfterExcludedTiers(setAllChampions);

  useShowTeammatePicks(setTeammatePickedChamps, socket);

  const renderChampions = useMemo(
    () =>
      allChampions?.map((c) => {
        const isPickedByTeamMember = teammatePickedChamps.some((champion) => champion._id === c._id);
        const isPicked = pickedChampions.some((champion) => champion._id === c._id);

        let championClassName = '';
        if (isPicked) {
          championClassName = classes['champion--picked'];
        } else if (isPickedByTeamMember) {
          championClassName = classes['champion--picked_teammember'];
        }
        return (
          <ChampionCard
            key={c._id}
            name={c.name}
            tier={c.tier}
            onClick={() => handlePickChampion(c)}
            className={championClassName}
          />
        );
      }),
    [allChampions, teammatePickedChamps, pickedChampions, handlePickChampion]
  );

  return (
    <>
      <div className={classes.championContainer}>{renderChampions}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '.25rem' }}>
        {isGameMaster && (
          <Button
            onClick={() => handleExcludeTiers()}
            className={shouldDisableExclude('S+') ? classes['btn--disabled'] : ''}
          >
            Exclude S+/D+
          </Button>
        )}
        <Button
          onClick={handleOnReady}
          className={pickedChampions.length === numberOfPicks ? '' : classes['btn--disabled']}
        >
          Ready
        </Button>
      </div>
    </>
  );
};
