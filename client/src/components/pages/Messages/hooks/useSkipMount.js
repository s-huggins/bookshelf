import { useEffect, useRef } from 'react';

export default (effect, ...deps) => {
  const firstCycle = useRef(true);

  useEffect(() => {
    if (firstCycle.current) {
      firstCycle.current = false;
      return;
    }

    const cleanUp = effect();
    if (cleanUp) return cleanUp;
  }, [...deps]);
};
