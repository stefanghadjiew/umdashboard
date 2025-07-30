export const siteMap = {
  home: '/',
  game: '/game/:action',
  mode: '/game/:action/:mode',
  lobby: '/game/:action/:mode/lobby',
  pickPhase: '/game/:action/:mode/lobby/:team/pick',
  revealPicks: '/game/:action/:mode/lobby/:team/pick/reveal',
  gameStart: '/game/:action/:mode/lobby/:team/pick/reveal/final'
};
