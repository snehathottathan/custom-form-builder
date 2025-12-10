/**
 * @author Sneha T
 * IsHydrated logic custom hook
 */

import { useState, useEffect } from 'react';

/**
 * 
 * @returns 
 */
export const useIsHydrated = () => { 

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {

    // This runs only on the client after mounting/hydration
    setIsHydrated(true);
    
  }, []);

  return isHydrated;
};