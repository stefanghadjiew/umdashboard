import classes from './RevealPicks.module.scss';

import { useCallback, useState } from 'react';

import { useNavigate, useParams } from 'react-router';

import { socket } from 'socket';

import { Button, ChampionCard, RefreshButton } from '@components';

import { useGameContext } from 'pages/GameAction/contexts/GameProvider';

import {
  useGatherTeamPicksInfo,
  useGetTeamPicksAfterRefresh,
  useHandlePlayersWhoShouldPickAgain,
  useNavigateBackPlayersWhoPickAgain,
  useShowTeammatePick
} from './hooks';

import { GAME_ACTIONS } from 'pages/GameAction';
import type { Champion } from 'pages/PickPhase';

interface PlayersToPickAgain {
  name: string;
  picksNeeded: number;
}

export const RevealPicks = () => {
  const [pickedChampion, setPickedChampion] = useState<Champion | null>(null);
  const [teammatePickedChamp, setTeammatePickedChamp] = useState<Champion[]>([]);
  const { gameId, gameMaster, player } = useGameContext();
  const [playersToPickAgain, setPlayersToPickAgain] = useState<PlayersToPickAgain[]>([]);
  const { team1Champions, team2Champions } = useGatherTeamPicksInfo(socket, gameId);
  const { team1ChampionsRefreshed, team2ChampionsRefreshed } = useGetTeamPicksAfterRefresh(socket, gameId);
  const { team, action, mode } = useParams();
  const navigate = useNavigate();

  const isGameMaster = player === gameMaster;

  const team1Picks = team1Champions || team1ChampionsRefreshed;
  const team2Picks = team2Champions || team2ChampionsRefreshed;
  const team1PicksByName = team1Picks?.map((c) => c.name);
  const team2PicksByName = team2Picks?.map((c) => c.name);
  const champsPickedByBothTeams = team1PicksByName?.filter((c) => team2PicksByName?.includes(c));

  const handlePickChampion = (champion: Champion) => {
    setPickedChampion((prev) => {
      let updated: Champion | null;
      if (teammatePickedChamp.map((c) => c.name).includes(champion.name)) {
        return prev;
      }
      if (prev?._id === champion._id) {
        updated = null;
      } else {
        updated = champion;
      }
      socket.emit(GAME_ACTIONS.PLAYER_FINAL_PICK, { gameId, champion: updated, player, team });
      return updated;
    });
  };
  const handleBanDuplicates = useCallback(() => {
    if (champsPickedByBothTeams?.length === 0) {
      return;
    }
    socket.emit(GAME_ACTIONS.BAN_CHAMPIONS, { gameId, champions: champsPickedByBothTeams });
  }, [champsPickedByBothTeams, gameId]);

  const handleOnStartGame = () => {
    if (!pickedChampion) {
      return;
    }
    navigate(`/game/${action}/${mode}/lobby/${team}/pick/reveal/final`);
  };
  const renderChampions = (picks: Champion[] | null, allowedTeam: 'Team1' | 'Team2') => {
    return picks?.map((c) => {
      const isPickedByTeamMember = teammatePickedChamp.some((champion) => champion._id === c._id);
      const isPicked = pickedChampion?._id === c._id;
      const isSelectable = team === allowedTeam;

      return (
        <ChampionCard
          key={c._id}
          name={c.name}
          tier={c.tier}
          onClick={isSelectable ? () => handlePickChampion(c) : undefined}
          style={{
            width: 70,
            height: 100,
            border: isPickedByTeamMember ? '10px solid red' : isPicked ? '10px solid green' : 'none',
            cursor: isSelectable ? 'pointer' : 'not-allowed'
          }}
        />
      );
    });
  };
  const renderTeam1Champions = renderChampions(team1Picks, 'Team1');

  const renderTeam2Champions = renderChampions(team2Picks, 'Team2');
  useHandlePlayersWhoShouldPickAgain(setPlayersToPickAgain);

  useNavigateBackPlayersWhoPickAgain(playersToPickAgain);

  useShowTeammatePick(setTeammatePickedChamp, socket);

  const startGameButton = (
    <Button onClick={handleOnStartGame} className={pickedChampion ? '' : classes['btn--disabled']}>
      Start Game
    </Button>
  );

  const renderBanButton = isGameMaster ? (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', marginTop: '1rem' }}>
      <Button
        onClick={handleBanDuplicates}
        className={champsPickedByBothTeams?.length === 0 ? classes['btn--disabled'] : ''}
      >
        Ban Duplicates
      </Button>
      <RefreshButton />
      {startGameButton}
    </div>
  ) : (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', marginTop: '1rem' }}>
      <RefreshButton />
      {startGameButton}
    </div>
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
