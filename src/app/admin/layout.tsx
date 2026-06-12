'use client';

import React, { useEffect } from 'react';
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
  ShieldAlert,
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
  const { profile, loading, isAdmin, signOut } = useAuth();

  // Admin guard: redirect non-admins to /forbidden
  useEffect(() => {
    if (!loading && profile && !isAdmin()) {
      router.replace('/forbidden');
    }
  }, [loading, profile, isAdmin, router]);

  // Also redirect if not logged in
  useEffect(() => {
    if (!loading && !profile) {
      router.replace('/login');
    }
  }, [loading, profile, router]);

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // If not admin, show forbidden screen while redirecting
  if (!profile || !isAdmin()) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <ShieldAlert className="w-16 h-16 text-primary mx-auto" />
          <h2 className="text-2xl font-display-gothic text-foreground">Acesso Restrito</h2>
          <p className="text-muted-foreground">Apenas administradores podem acessar esta área.</p>
          <Link href="/">
            <button className="text-primary hover:underline text-sm">Voltar ao Dashboard</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-60 fixed top-0 left-0 h-screen bg-card border-r border-border flex flex-col z-50">
        {/* Logo Section */}
        <div className="p-5 border-b border-border">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Admin</p>
          <h1 className="text-lg font-display-gothic text-foreground">IBGE Portal</h1>
          <div className="flex items-center gap-2 mt-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {profile.username}
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
                      ? 'bg-primary/15 text-foreground border-l-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
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
        <div className="p-3 border-t border-border">
          <motion.button
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-secondary/50 transition-colors w-full"
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
