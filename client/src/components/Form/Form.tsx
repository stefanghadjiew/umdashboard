import classes from './Form.module.scss';

import { useNavigate } from 'react-router';

import { socket } from 'socket';

import { BackButton, Button } from '@components';

import { useGameContext } from 'pages/GameAction/contexts/GameProvider';

import { useAsyncEmits } from 'pages/hooks/useAsyncEmits';

import { GAME_ACTIONS } from '@pages';

const playerInputs = [
  {
    id: 'add-player',
    label: 'Nickname',
    name: 'add-player'
  }
];

const joinGameInputs = [
  {
    id: 'join-game',
    name: 'join-game',
    label: 'Game ID:'
  }
];

export const Form = ({ isPlayer }: { isPlayer?: boolean }) => {
  const asyncEmit = useAsyncEmits();
  const navigate = useNavigate();
  const formInputs = isPlayer ? playerInputs : joinGameInputs;
  const { handleCreatePlayer, handleCreateGameId, player } = useGameContext();

  const buttonText = isPlayer ? 'Save' : '🎮 Join Game';

  const handlePlayer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const playerName = formData.get('add-player') as string;
    handleCreatePlayer(playerName);
    navigate('/');
  };
  const handleJoinGame = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const gameIdInput = document.getElementById(joinGameInputs[0].id) as HTMLInputElement;
    const gameId = gameIdInput?.value;
    if (!gameId) {
      return;
    }
    const response = (await asyncEmit(socket, GAME_ACTIONS.JOIN_GAME, { gameId, player })) as Record<
      'mode',
      '1vs1' | '2vs2' | null | undefined
    >;
    handleCreateGameId(gameId);
    navigate(`/game/join/${response.mode}/lobby`);
  };
  const handleFormSubmit = isPlayer ? handlePlayer : handleJoinGame;

  return (
    <div className={classes.formWrapper}>
      <form className={classes['formWrapper__form']} onSubmit={handleFormSubmit}>
        {formInputs.map((input) => {
          return (
            <div className={classes['formWrapper__form__inputs']} key={input.id}>
              <label aria-required htmlFor={input.id}>
                {input.label}
              </label>
              <input id={input.id} name={input.name} type="text" />
            </div>
          );
        })}
        <Button>{buttonText}</Button>
        <BackButton />
      </form>
    </div>
  );
};
