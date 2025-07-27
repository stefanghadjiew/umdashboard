import classes from './PickPhase.module.scss';

import { useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { socket } from 'socket';

import { Button, ChampionCard, RefreshButton } from '@components';

import { useGameContext } from 'pages/GameAction/contexts/GameProvider';

import { useExcludeChampionTiers } from './hooks/useExcludeChampions';
import { useExcludeTiers } from './hooks/useExcludeTiers';
import { useGetChampionsAfterBanForOtherPlayers } from './hooks/useGetChampionsAfterBanForOtherPlayers';
import { useGetExcludedChampionsForOtherPlayers } from './hooks/useGetExcludedChampionsForOtherPlayers';
import { useJoinGameboard } from './hooks/useJoinGameboard';
import { useSetLocalStorageDataForGameMaster } from './hooks/useSetLocalStorageDataForGameMaster';

import { GAME_ACTIONS } from 'pages/GameAction';

export interface Champion {
  _id: string;
  name: string;
  tier: 'S+' | 'S' | 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C';
}

export const PickPhase = () => {
  const [allChampions, setAllChampions] = useState<Champion[]>([]);
  const [pickedChampions, setPickedChampions] = useState<Champion[]>([]);
  const [excludedTiers, setExcludedTiers] = useState<('S+' | 'D+')[]>(() => {
    const stored = localStorage.getItem('excludedTiers');
    return stored ? JSON.parse(stored) : [];
  });
  const { team, mode, action } = useParams();
  const navigate = useNavigate();
  const { player, gameId, gameMaster, numberOfPicks } = useGameContext();
  const isGameMaster = player === gameMaster;

  const shouldDisableExclude = (tier: 'S+' | 'D+') => allChampions.every((c) => c.tier !== tier);

  const handlePickChampion = (champion: Champion) => {
    if (pickedChampions.includes(champion)) {
      setPickedChampions((prev) => prev.filter((c) => c.name !== champion.name));
      return;
    }
    if (pickedChampions.length === +numberOfPicks) {
      setPickedChampions((prev) => [...prev.slice(0, -1), champion]);
      return;
    }
    setPickedChampions([...pickedChampions, champion]);
  };
  const handleExcludeTiers = (tier: 'S+' | 'D+') => {
    setExcludedTiers((prev) => (prev.includes(tier) ? prev.filter((t) => t !== tier) : [...prev, tier]));
  };
  const handleOnReady = () => {
    socket.emit(GAME_ACTIONS.PICK_CHAMPIONS, { gameId, team, player, champions: pickedChampions });
    navigate(`/game/${action}/${mode}/lobby/${team}/pick/reveal`);
  };
  useJoinGameboard(setAllChampions);

  useExcludeChampionTiers(excludedTiers);

  useGetExcludedChampionsForOtherPlayers();

  useExcludeTiers(setAllChampions);

  useSetLocalStorageDataForGameMaster(excludedTiers);

  useGetChampionsAfterBanForOtherPlayers(setAllChampions);

  const renderChampions = allChampions?.map((c) => {
    const isPicked = pickedChampions.some((champion) => champion._id === c._id);
    return (
      <ChampionCard
        key={c._id}
        name={c.name}
        tier={c.tier}
        onClick={() => handlePickChampion(c)}
        className={isPicked ? classes['champion--picked'] : ''}
      />
    );
  });

  return (
    <>
      <div className={classes.championContainer}>{renderChampions}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '.25rem' }}>
        {isGameMaster && (
          <>
            <Button
              onClick={() => handleExcludeTiers('S+')}
              className={shouldDisableExclude('S+') ? classes['btn--disabled'] : ''}
            >
              Exclude S+
            </Button>
            <Button
              onClick={() => handleExcludeTiers('D+')}
              className={shouldDisableExclude('D+') ? classes['btn--disabled'] : ''}
            >
              Exclude D+
            </Button>
          </>
        )}
        <Button
          onClick={handleOnReady}
          className={pickedChampions.length === numberOfPicks ? '' : classes['btn--disabled']}
        >
          Ready
        </Button>
        <RefreshButton />
      </div>
    </>
  );
};
