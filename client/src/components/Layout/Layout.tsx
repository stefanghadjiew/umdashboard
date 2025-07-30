import classes from './Layout.module.scss';

import { Outlet } from 'react-router';
import { useLocation } from 'react-router-dom';

export const Layout = () => {
  const { pathname } = useLocation();
  const shouldDisplayLogo = !pathname.includes('Team1') && !pathname.includes('Team2');
  return (
    <div className={classes.layout}>
      <img
        className={classes.layout__logo}
        src="https://restorationgames.com/wp-content/uploads/2023/12/Shop_Collection__UM.png"
        alt="unmatched-logo"
      />
      {shouldDisplayLogo && (
        <img
          className={classes.layout__noEquals}
          src="https://restorationgames.com/wp-content/uploads/2023/12/UM-Tagline_Web.png"
        />
      )}
      <Outlet />
    </div>
  );
};
