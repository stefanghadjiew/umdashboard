import { Layout } from '@components';

import { siteMap } from './constants';

import { GameAction, GameModes, GameStart, Lobby, PickPhase, RevealPicks } from '@pages';

export const useSiteRouteDefinitions = () => {
  return [
    {
      path: siteMap.home,
      element: <Layout />,
      children: [
        {
          element: <GameAction />,
          index: true,
          id: '1'
        },
        {
          path: siteMap.mode,
          element: <GameModes />,
          id: '2'
        },
        {
          path: siteMap.lobby,
          element: <Lobby />,
          id: '3'
        },
        {
          path: siteMap.pickPhase,
          element: <PickPhase />,
          id: '4'
        },
        {
          path: siteMap.revealPicks,
          element: <RevealPicks />,
          id: '5'
        },
        {
          path: siteMap.gameStart,
          element: <GameStart />,
          id: '6'
        }
      ]
    }
  ];
};
