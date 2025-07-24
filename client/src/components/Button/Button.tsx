import classes from './Button.module.scss';

import classNames from 'classnames';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
}

export const Button = ({ children, onClick, className, ...rest }: ButtonProps) => {
  const btnClasses = classNames(classes.btn, className);
  return (
    <button {...rest} onClick={onClick} className={btnClasses}>
      {children}
    </button>
  );
};
