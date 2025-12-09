import { useState, useEffect } from 'react';

export const useIsHydrated = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // This runs only on the client after mounting/hydration
    setIsHydrated(true);
  }, []);

  return isHydrated;
};