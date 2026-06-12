'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Trophy, Shield, LogOut, User, Menu, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NAV_LINKS = [
  { href: '/', label: 'Dashboard', icon: BarChart3, activeColor: 'crimson' },
  { href: '/quiz', label: 'Quiz', icon: Trophy, activeColor: 'crimson' },
] as const;

export default function Navbar() {
  const { profile, signOut, isAdmin } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    setMobileOpen(false);
    router.push('/login');
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-gothic-950/80 backdrop-blur-md border-b border-gothic-700/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group" onClick={() => setMobileOpen(false)}>
            {/* Gothic sigil icon */}
            <div className="w-8 h-8 rounded-md bg-crimson-900/40 border border-crimson-700/30 flex items-center justify-center group-hover:border-crimson-500/50 group-hover:shadow-crimson-glow transition-all duration-300">
              <span className="font-display-gothic text-xs font-bold text-crimson-300 tracking-widest">I</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display-gothic text-lg font-bold text-white tracking-widest group-hover:text-crimson-300 transition-colors">IBGE</span>
              <span className="hidden sm:inline text-[10px] text-gothic-500 tracking-[0.3em] uppercase font-display-gothic">Portal</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                    active
                      ? 'bg-crimson-900/30 text-white border border-crimson-800/30'
                      : 'text-gothic-500 hover:text-white hover:bg-gothic-900/50 border border-transparent'
                  }`}
                >
                  <link.icon size={14} />
                  {link.label}
                </Link>
              );
            })}
            {isAdmin() && (
              <Link
                href="/admin"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                  isActive('/admin')
                    ? 'bg-imperial-900/30 text-white border border-imperial-800/30'
                    : 'text-gothic-500 hover:text-white hover:bg-gothic-900/50 border border-transparent'
                }`}
              >
                <Shield size={14} />
                Admin
              </Link>
            )}
          </nav>
        </div>

        {/* Right side — User info + Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <div className="w-7 h-7 rounded-full bg-crimson-900/40 border border-crimson-700/20 flex items-center justify-center">
              <User size={13} className="text-crimson-300" />
            </div>
            <span className="text-gothic-500 font-mono-gothic text-[11px] max-w-[120px] truncate">
              {profile?.username || 'Usuário'}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-gothic-500 hover:text-white hover:bg-gothic-900/50 h-8 w-8 p-0"
          >
            <LogOut size={14} />
          </Button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-md text-gothic-500 hover:text-white hover:bg-gothic-900/50 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Menu Panel */}
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="md:hidden bg-gothic-950 border-b border-gothic-700/50 overflow-hidden z-50"
            >
              <div className="px-4 py-3 space-y-1">
                {/* User info in mobile */}
                <div className="flex items-center gap-2 pb-3 mb-2 border-b border-gothic-800/50">
                  <div className="w-8 h-8 rounded-full bg-crimson-900/40 border border-crimson-700/20 flex items-center justify-center">
                    <User size={14} className="text-crimson-300" />
                  </div>
                  <span className="text-gothic-400 font-mono-gothic text-xs">
                    {profile?.username || 'Usuário'}
                  </span>
                </div>

                {NAV_LINKS.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        active
                          ? 'bg-crimson-900/20 text-white border-l-2 border-crimson-500'
                          : 'text-gothic-500 hover:text-white hover:bg-gothic-900/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <link.icon size={16} />
                        {link.label}
                      </div>
                      <ChevronRight size={14} className="text-gothic-600" />
                    </Link>
                  );
                })}
                {isAdmin() && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive('/admin')
                        ? 'bg-imperial-900/20 text-white border-l-2 border-imperial-500'
                        : 'text-gothic-500 hover:text-white hover:bg-gothic-900/40'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Shield size={16} />
                      Admin
                    </div>
                    <ChevronRight size={14} className="text-gothic-600" />
                  </Link>
                )}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
