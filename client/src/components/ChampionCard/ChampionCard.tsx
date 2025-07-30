import classes from './ChampionCard.module.scss';

import { memo } from 'react';

import { resources } from '@assets';
import classNames from 'classnames';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  tier: string;
  onClick?: () => void;
  className?: string;
}

export const ChampionCard = memo(({ name, /* tier, */ onClick, className, ...rest }: Props) => {
  const image = resources[name] ?? '';
  const cardClasses = classNames(classes.championCard, className);
  const styles = { ...rest.style, backgroundImage: `url(${image})` };
  return (
    <div {...rest} className={cardClasses} style={styles} onClick={onClick}>
      {/* <div className={classes['championCard__name']}>{name}</div>
      <div className={classes['championCard__tier']}>{tier}</div> */}
    </div>
  );
});
