'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThemeOption {
  name: string;
  label: string;
  icon: React.ElementType;
  preview: { bg: string; accent: string };
}

const THEMES: ThemeOption[] = [
  {
    name: 'gothic',
    label: 'Gothic Dark',
    icon: Moon,
    preview: { bg: '#0a0a0c', accent: '#b91c1c' },
  },
  {
    name: 'light',
    label: 'Light Clean',
    icon: Sun,
    preview: { bg: '#ffffff', accent: '#991b1b' },
  },
  {
    name: 'midnight',
    label: 'Midnight Blue',
    icon: Moon,
    preview: { bg: '#0f172a', accent: '#d97706' },
  },
  {
    name: 'forest',
    label: 'Forest Dark',
    icon: Moon,
    preview: { bg: '#052e16', accent: '#d97706' },
  },
  {
    name: 'rose',
    label: 'Rose Light',
    icon: Sun,
    preview: { bg: '#fdf2f8', accent: '#e11d48' },
  },
];

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
        <Palette size={16} />
      </button>
    );
  }

  const currentTheme = THEMES.find(t => t.name === theme) || THEMES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
        aria-label="Selecionar tema"
      >
        <Palette size={16} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden"
            >
              <div className="p-2 border-b border-border">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold px-2">
                  Tema do Portal
                </p>
              </div>
              <div className="p-1.5 space-y-0.5">
                {THEMES.map((t) => {
                  const Icon = t.icon;
                  const isActive = theme === t.name;
                  return (
                    <button
                      key={t.name}
                      onClick={() => {
                        setTheme(t.name);
                        setOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/15 text-foreground font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                      }`}
                    >
                      {/* Color preview circle */}
                      <div
                        className="w-5 h-5 rounded-full border-2 shrink-0"
                        style={{
                          backgroundColor: t.preview.bg,
                          borderColor: isActive ? t.preview.accent : 'rgba(128,128,128,0.3)',
                          boxShadow: isActive ? `0 0 8px ${t.preview.accent}40` : 'none',
                        }}
                      >
                        <div
                          className="w-2 h-2 rounded-full mx-auto mt-[2px]"
                          style={{ backgroundColor: t.preview.accent }}
                        />
                      </div>
                      <span className="flex-1 text-left">{t.label}</span>
                      {isActive && (
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: t.preview.accent }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
