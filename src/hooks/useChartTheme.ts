'use client';

import { useEffect, useState } from 'react';

/**
 * Reads chart-specific CSS custom properties from the active theme
 * and returns them as a convenient object for Recharts components.
 */
export function useChartTheme() {
  const [colors, setColors] = useState({
    grid: '#27272a',
    axis: '#3f3f46',
    tick: '#a1a1aa',
    reference: '#52526a',
  });

  useEffect(() => {
    function readColors() {
      const root = document.documentElement;
      const style = getComputedStyle(root);
      setColors({
        grid: style.getPropertyValue('--chart-grid').trim() || '#27272a',
        axis: style.getPropertyValue('--chart-axis').trim() || '#3f3f46',
        tick: style.getPropertyValue('--chart-tick').trim() || '#a1a1aa',
        reference: style.getPropertyValue('--chart-reference').trim() || '#52526a',
      });
    }

    readColors();

    // Re-read when theme changes
    const observer = new MutationObserver(readColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class'],
    });

    return () => observer.disconnect();
  }, []);

  return colors;
}
