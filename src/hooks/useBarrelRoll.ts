import { useState, useCallback } from 'react';

const useBarrelRoll = () => {
  const [isBarrelRolling, setIsBarrelRolling] = useState(false);

  const triggerBarrelRoll = useCallback(() => {
    setIsBarrelRolling(true);
    setTimeout(() => setIsBarrelRolling(false), 1000);
  }, []);

  return {
    isBarrelRolling,
    triggerBarrelRoll,
  };
};

export default useBarrelRoll; 