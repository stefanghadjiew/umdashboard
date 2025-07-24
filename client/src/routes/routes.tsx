import { Form, Layout } from '@components';

import { siteMap } from './constants';

import { GameAction, GameModes, Lobby, PickPhase, RevealPicks } from '@pages';

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
          path: siteMap.addPlayer,
          id: '7',
          element: <Form isPlayer />
        },
        {
          path: siteMap.joinGame,
          id: '8',
          element: <Form />
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
          id: '10'
        }
      ]
    }
  ];
};
