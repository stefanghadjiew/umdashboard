import { Button } from '@components/Button';

export const RefreshButton = () => {
  const handleRefresh = () => {
    // eslint-disable-next-line no-restricted-globals
    window.location.reload();
  };

  return <Button onClick={handleRefresh}>🔄 Refresh</Button>;
};
