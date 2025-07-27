import classes from './RevealPicks.module.scss';

import { useState } from 'react';

import { socket } from 'socket';

import { Button, ChampionCard, RefreshButton, ResetGameButton } from '@components';

import { useGameContext } from 'pages/GameAction/contexts/GameProvider';

import { useGatherTeamPicksInfo } from './hooks/useGatherTeamPicksInfo';
import { useGetTeamPicksAfterRefresh } from './hooks/useGetTeamPicksAfterRefresh';
import { useHandlePlayersWhoShouldPickAgain } from './hooks/useHandlePlayersWhoShouldPickAgain';
import { useNavigateBackPlayersWhoPickAgain } from './hooks/useNavigatePlayersWhoPickAgainBack';

import { GAME_ACTIONS } from 'pages/GameAction';

interface PlayersToPickAgain {
  name: string;
  picksNeeded: number;
}

export const RevealPicks = () => {
  const { gameId, gameMaster, player } = useGameContext();
  const [playersToPickAgain, setPlayersToPickAgain] = useState<PlayersToPickAgain[]>([]);
  const { team1Champions, team2Champions } = useGatherTeamPicksInfo(socket, gameId);
  const { team1ChampionsRefreshed, team2ChampionsRefreshed } = useGetTeamPicksAfterRefresh(socket, gameId);

  const isGameMaster = player === gameMaster;
  const storedExcludedTiers = localStorage.getItem('excludedTiers');
  const excludedTiers = storedExcludedTiers ? JSON.parse(storedExcludedTiers) : [];

  const team1Picks = team1Champions || team1ChampionsRefreshed;
  const team2Picks = team2Champions || team2ChampionsRefreshed;
  const team1PicksByName = team1Picks?.map((c) => c.name);
  const team2PicksByName = team2Picks?.map((c) => c.name);
  const champsPickedByBothTeams = team1PicksByName?.filter((c) => team2PicksByName?.includes(c));

  const handleBanDuplicates = () => {
    if (champsPickedByBothTeams?.length === 0) {
      return;
    }
    socket.emit(GAME_ACTIONS.BAN_CHAMPIONS, { gameId, champions: champsPickedByBothTeams, excludedTiers });
  };
  const renderTeam1Champions = team1Picks?.map((c) => (
    <ChampionCard style={{ width: 70, height: 100 }} key={c._id} name={c.name} tier={c.tier} />
  ));

  const renderTeam2Champions = team2Picks?.map((c) => (
    <ChampionCard style={{ width: 70, height: 100 }} key={c._id} name={c.name} tier={c.tier} />
  ));

  useHandlePlayersWhoShouldPickAgain(setPlayersToPickAgain);

  useNavigateBackPlayersWhoPickAgain(playersToPickAgain);

  const renderBanButton = isGameMaster ? (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', marginTop: '1rem' }}>
      <ResetGameButton />
      <Button
        onClick={handleBanDuplicates}
        className={champsPickedByBothTeams?.length === 0 ? classes['btn--disabled'] : ''}
      >
        Ban Duplicates
      </Button>
      <RefreshButton />
    </div>
  ) : (
    <RefreshButton />
  );

  return (
    <>
      <div className={classes.revealPicks}>
        <div className={classes['revealPicks__team']}>
          <div className={classes['revealPicks__team__champions']}>{renderTeam1Champions}</div>
        </div>
        <h2 style={{ margin: '1rem 0', textAlign: 'center' }}>VS</h2>
        <div className={classes['revealPicks__team']}>
          <div className={classes['revealPicks__team__champions']}>{renderTeam2Champions}</div>
        </div>
      </div>
      {renderBanButton}
    </>
  );
};
