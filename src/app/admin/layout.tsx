'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Database,
  HelpCircle,
  FileText,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Usuários', icon: Users },
  { href: '/admin/ibge', label: 'Banco IBGE', icon: Database },
  { href: '/admin/questions', label: 'Questões', icon: HelpCircle },
  { href: '/admin/logs', label: 'Logs', icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-60 fixed top-0 left-0 h-screen bg-zinc-900 border-r border-zinc-800 flex flex-col z-50">
        {/* Logo Section */}
        <div className="p-5 border-b border-zinc-800">
          <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Admin</p>
          <h1 className="text-lg font-display-gothic text-white">IBGE Portal</h1>
          <div className="flex items-center gap-2 mt-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
            </span>
            <span className="text-xs text-zinc-400 truncate">
              {profile?.username || 'Carregando...'}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-red-950/30 text-red-300 border-l-2 border-red-800'
                      : 'text-zinc-500 hover:text-white hover:bg-zinc-800/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-zinc-800">
          <motion.button
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-zinc-800/50 transition-colors w-full"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </motion.button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-60 p-6">
        {children}
      </main>
    </div>
  );
}
