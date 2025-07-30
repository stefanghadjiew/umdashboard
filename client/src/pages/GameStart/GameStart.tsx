import classes from './GameStart.module.scss';

import { useEffect, useState } from 'react';

import { socket } from 'socket';

import { ChampionCard, RefreshButton, ResetGameButton } from '@components';

import { useGameContext } from 'pages/GameAction/contexts/GameProvider';

import { type Champion, GAME_ACTIONS } from '@pages';

interface PlayerChampPick {
  player: string;
  champions: Champion[];
}

interface Picks {
  Team1: PlayerChampPick[];
  Team2: PlayerChampPick[];
}

export const GameStart = () => {
  const [team1Picks, setTeam1Picks] = useState<Champion[]>([]);
  const [team2Picks, setTeam2Picks] = useState<Champion[]>([]);
  const { player, gameMaster, gameId } = useGameContext();

  const isGameMaster = player === gameMaster;

  useEffect(() => {
    socket.emit(GAME_ACTIONS.GET_FINAL_PICKS_BY_PLAYERS, { gameId });
  }, [gameId]);

  useEffect(() => {
    const handleStartGameRevealPicks = (data: Picks) => {
      setTeam1Picks(data.Team1.map((tp) => tp.champions).flat());
      setTeam2Picks(data.Team2.map((tp) => tp.champions).flat());
    };
    socket.on(GAME_ACTIONS.START_GAME_REVEAL_PICKS, handleStartGameRevealPicks);

    return () => {
      socket.off(GAME_ACTIONS.START_GAME_REVEAL_PICKS, handleStartGameRevealPicks);
    };
  }, [gameId]);

  const renderTeamChampions = (picks: Champion[]) => {
    return picks?.map((c) => {
      return <ChampionCard key={c._id} name={c.name} tier={c.tier} style={{ width: 100, height: 150 }} />;
    });
  };

  return (
    <div className={classes['gameStart']}>
      <div className={classes['gameStart__team']}>
        <div className={classes['gameStart__team__champions']}>{renderTeamChampions(team1Picks)}</div>
      </div>
      <h2 style={{ margin: '1rem 0', textAlign: 'center' }}>VS</h2>
      <div className={classes['gameStart__team']}>
        <div className={classes['gameStart__team__champions']}>{renderTeamChampions(team2Picks)}</div>
      </div>
      <div className={classes['buttons__wrapper']}>
        <RefreshButton />
        {isGameMaster && <ResetGameButton />}
      </div>
    </div>
  );
};
