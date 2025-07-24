import { BrowserRouter, Route, type RouteObject, Routes } from 'react-router-dom';

import { GameProvider } from 'pages/GameAction/contexts/GameProvider';

import { useSiteRouteDefinitions } from './routes';

const renderRoutes = (routes: RouteObject[]) =>
  routes.map((route) => {
    const { path, element, children, id, index } = route;

    if (index) {
      return (
        <Route index element={element} key={id}>
          {children && renderRoutes(children)}
        </Route>
      );
    }
    return (
      <Route path={path} element={element} key={id}>
        {children && renderRoutes(children)}
      </Route>
    );
  });

export const AppRoutes = () => {
  const routeDefinitions = useSiteRouteDefinitions();
  return (
    <BrowserRouter>
      <GameProvider>
        <Routes>{renderRoutes(routeDefinitions)}</Routes>;
      </GameProvider>
    </BrowserRouter>
  );
};
