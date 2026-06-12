'use client';

import { useRef, useEffect, useCallback } from 'react';

/**
 * Animated counter hook — smoothly counts from 0 to `end` using RAF.
 * Returns a ref to attach to a <span> element.
 */
export function useCountUp(end: number, duration = 1500) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  const animate = useCallback(() => {
    if (!ref.current || hasAnimated.current) return;
    hasAnimated.current = true;
    const start = 0;
    const startTime = performance.now();

    const step = (currentTime: number) => {
      if (!ref.current) return;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * eased;
      ref.current.textContent = current.toFixed(current % 1 === 0 && end % 1 === 0 ? 0 : 1);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [end, duration]);

  useEffect(() => {
    animate();
  }, [animate]);

  return ref;
}
