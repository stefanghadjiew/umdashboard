export const siteMap = {
  home: '/',
  game: '/game/:action',
  mode: '/game/:action/:mode',
  lobby: '/game/:action/:mode/lobby',
  addPlayer: '/game/add-player',
  joinGame: '/game/join-game',
  pickPhase: '/game/:action/:mode/lobby/:team/pick',
  revealPicks: '/game/:action/:mode/lobby/:team/pick/reveal'
};
