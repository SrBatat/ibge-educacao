'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useEffect } from 'react';

const DARK_THEMES = ['gothic', 'midnight', 'forest'];
const LIGHT_THEMES = ['light', 'rose'];

function DarkClassSync({ children }: { children: React.ReactNode }) {
  // next-themes uses data-theme attribute; we also need to toggle
  // the `dark` class so that shadcn/ui `dark:` variants continue to work.
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const html = document.documentElement;
      const theme = html.getAttribute('data-theme') || 'gothic';
      if (DARK_THEMES.includes(theme)) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    // Set initial state
    const theme = document.documentElement.getAttribute('data-theme') || 'gothic';
    if (DARK_THEMES.includes(theme)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="gothic"
      themes={['gothic', 'light', 'midnight', 'forest', 'rose']}
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      <DarkClassSync>{children}</DarkClassSync>
    </NextThemesProvider>
  );
}
