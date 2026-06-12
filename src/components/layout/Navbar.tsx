'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BarChart3, Trophy, Shield, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const { profile, signOut, isAdmin } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-gothic-950/80 backdrop-blur-md border-b border-gothic-700/50"
    >
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-display-gothic text-lg font-bold text-white tracking-widest group-hover:text-crimson-300 transition-colors">IBGE</span>
            <span className="hidden sm:inline text-xs text-gothic-500 tracking-widest uppercase font-display-gothic">Portal</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${pathname === '/' ? 'bg-crimson-900/30 text-white' : 'text-gothic-500 hover:text-white hover:bg-gothic-900/50'}`}>
              <BarChart3 size={14} /> Dashboard
            </Link>
            <Link href="/quiz" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${pathname?.startsWith('/quiz') ? 'bg-crimson-900/30 text-white' : 'text-gothic-500 hover:text-white hover:bg-gothic-900/50'}`}>
              <Trophy size={14} /> Quiz
            </Link>
            {isAdmin() && (
              <Link href="/admin" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${pathname?.startsWith('/admin') ? 'bg-imperial-900/30 text-white' : 'text-gothic-500 hover:text-white hover:bg-gothic-900/50'}`}>
                <Shield size={14} /> Admin
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-7 h-7 rounded-full bg-crimson-900/50 flex items-center justify-center">
              <User size={13} className="text-crimson-300" />
            </div>
            <span className="hidden sm:inline text-gothic-500 font-mono">{profile?.username || 'Usuário'}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gothic-500 hover:text-white hover:bg-gothic-900/50 h-8 w-8 p-0">
            <LogOut size={14} />
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
