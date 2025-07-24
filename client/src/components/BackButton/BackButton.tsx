import { useNavigate } from 'react-router';

import { Button } from '@components/Button';

export const BackButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    // eslint-disable-next-line no-restricted-globals
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return <Button onClick={handleClick}>Back</Button>;
};
