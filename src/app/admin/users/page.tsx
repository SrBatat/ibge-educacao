'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, RefreshCw, Shield, Ban, Trash2, UserCog, Trophy, XCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  is_banned: boolean;
  created_at: string;
}

interface RankingEntry {
  id: string;
  user_id: string;
  username: string;
  pontuacao: number;
  total_acertos: number;
  total_questoes: number;
  tempo_gasto: number;
  percentual: number;
  data_tentativa: string;
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [search, setSearch] = useState('');
  const [rankingSearch, setRankingSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [rankingLoading, setRankingLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Get auth token for API calls
  const getAuthToken = useCallback(async () => {
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    return currentSession?.access_token || '';
  }, []);

  // Toast notification system
  const addToast = useCallback((type: Toast['type'], message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  // Load users via API
  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getAuthToken();
      const params = new URLSearchParams();
      if (search) params.set('search', search);

      const res = await fetch(`/api/admin/users?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) {
        addToast('error', data.error || 'Erro ao carregar usuários');
        setUsers([]);
      } else {
        setUsers(data.users || []);
      }
    } catch (err) {
      addToast('error', 'Erro de conexão ao carregar usuários');
      setUsers([]);
    }
    setLoading(false);
  }, [search, getAuthToken, addToast]);

  // Load ranking via API
  const loadRanking = useCallback(async () => {
    setRankingLoading(true);
    try {
      const token = await getAuthToken();
      const params = new URLSearchParams();
      if (rankingSearch) params.set('search', rankingSearch);

      const res = await fetch(`/api/admin/ranking?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) {
        addToast('error', data.error || 'Erro ao carregar ranking');
        setRanking([]);
      } else {
        setRanking(data.ranking || []);
      }
    } catch (err) {
      addToast('error', 'Erro de conexão ao carregar ranking');
      setRanking([]);
    }
    setRankingLoading(false);
  }, [rankingSearch, getAuthToken, addToast]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    loadRanking();
  }, [loadRanking]);

  // --- User Actions ---
  const toggleBan = async (user: User) => {
    setActionLoading(user.id);
    try {
      const token = await getAuthToken();
      const action = user.is_banned ? 'unban' : 'ban';
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();
      if (!res.ok) {
        addToast('error', data.error || 'Erro ao alterar status de ban');
      } else {
        addToast('success', user.is_banned
          ? `Usuário "${user.username}" desbanido com sucesso`
          : `Usuário "${user.username}" banido com sucesso`
        );
        await loadUsers();
      }
    } catch (err) {
      addToast('error', 'Erro de conexão');
    }
    setActionLoading(null);
  };

  const toggleRole = async (user: User) => {
    setActionLoading(user.id);
    try {
      const token = await getAuthToken();
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'toggle_role' }),
      });

      const data = await res.json();
      if (!res.ok) {
        addToast('error', data.error || 'Erro ao alterar cargo');
      } else {
        const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
        addToast('success', `Usuário "${user.username}" agora é ${newRole}`);
        await loadUsers();
      }
    } catch (err) {
      addToast('error', 'Erro de conexão');
    }
    setActionLoading(null);
  };

  const deleteUser = async (user: User) => {
    if (!window.confirm(`Excluir usuário "${user.username}" e todos seus dados do ranking? Esta ação é irreversível.`)) return;
    setActionLoading(user.id);
    try {
      const token = await getAuthToken();
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) {
        addToast('error', data.error || 'Erro ao excluir usuário');
      } else {
        addToast('success', data.message || `Usuário "${user.username}" excluído com sucesso`);
        await loadUsers();
        await loadRanking();
      }
    } catch (err) {
      addToast('error', 'Erro de conexão');
    }
    setActionLoading(null);
  };

  // --- Ranking Actions ---
  const deleteRankingEntry = async (entry: RankingEntry) => {
    if (!window.confirm(`Remover entrada de "${entry.username}" (${entry.pontuacao} pts) do ranking?`)) return;
    setActionLoading(`ranking-${entry.id}`);
    try {
      const token = await getAuthToken();
      const res = await fetch(`/api/admin/ranking/${entry.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) {
        addToast('error', data.error || 'Erro ao remover entrada do ranking');
      } else {
        addToast('success', data.message || 'Entrada removida do ranking');
        await loadRanking();
      }
    } catch (err) {
      addToast('error', 'Erro de conexão');
    }
    setActionLoading(null);
  };

  const deleteAllUserRanking = async (userId: string, username: string) => {
    const userEntries = ranking.filter(e => e.user_id === userId);
    if (userEntries.length === 0) {
      addToast('info', `Nenhuma entrada no ranking para "${username}"`);
      return;
    }
    if (!window.confirm(`Remover TODAS as ${userEntries.length} entrada(s) de "${username}" do ranking?`)) return;

    setActionLoading(`ranking-user-${userId}`);
    try {
      const token = await getAuthToken();
      // Delete each entry
      let successCount = 0;
      for (const entry of userEntries) {
        const res = await fetch(`/api/admin/ranking/${entry.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) successCount++;
      }
      addToast('success', `${successCount} entrada(s) de "${username}" removida(s) do ranking`);
      await loadRanking();
    } catch (err) {
      addToast('error', 'Erro de conexão');
    }
    setActionLoading(null);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-[100] space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium max-w-sm ${
                toast.type === 'success'
                  ? 'bg-emerald-600 text-white'
                  : toast.type === 'error'
                    ? 'bg-red-600 text-white'
                    : 'bg-blue-600 text-white'
              }`}
            >
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
              {toast.type === 'error' && <XCircle className="w-4 h-4 shrink-0" />}
              {toast.type === 'info' && <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-display-gothic text-foreground">Gerenciamento</h1>
          <p className="text-sm text-muted-foreground mt-1">Usuários e Ranking</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => { loadUsers(); loadRanking(); }}
          className="border-input text-muted-foreground hover:text-foreground hover:border-ring"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="bg-card border border-border p-1 h-auto gap-1">
          <TabsTrigger
            value="users"
            className="data-[state=active]:bg-primary/15 data-[state=active]:text-foreground text-muted-foreground text-xs px-4 py-2 border border-transparent rounded-md transition-all"
          >
            <UserCog className="w-3.5 h-3.5 mr-1.5" />
            Usuários ({users.length})
          </TabsTrigger>
          <TabsTrigger
            value="ranking"
            className="data-[state=active]:bg-primary/15 data-[state=active]:text-foreground text-muted-foreground text-xs px-4 py-2 border border-transparent rounded-md transition-all"
          >
            <Trophy className="w-3.5 h-3.5 mr-1.5" />
            Ranking ({ranking.length})
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por username ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          {/* Users Table */}
          <Card className="bg-card border-border">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 text-muted-foreground font-medium">Username</th>
                      <th className="text-left p-4 text-muted-foreground font-medium">Email</th>
                      <th className="text-left p-4 text-muted-foreground font-medium">Cargo</th>
                      <th className="text-left p-4 text-muted-foreground font-medium">Status</th>
                      <th className="text-left p-4 text-muted-foreground font-medium">Cadastro</th>
                      <th className="text-left p-4 text-muted-foreground font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {loading ? (
                        [...Array(5)].map((_, i) => (
                          <tr key={i} className="border-b border-border/50">
                            {[...Array(6)].map((_, j) => (
                              <td key={j} className="p-4">
                                <div className="h-4 bg-secondary rounded animate-pulse w-20" />
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : users.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-muted-foreground">
                            Nenhum usuário encontrado.
                          </td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <motion.tr
                            key={user.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={`border-b border-border/50 hover:bg-secondary/30 transition-colors ${user.is_banned ? 'opacity-60' : ''}`}
                          >
                            <td className="p-4 font-medium text-foreground">
                              {user.username}
                              {user.is_banned && (
                                <Badge className="ml-2 bg-red-100/50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-red-300 dark:border-red-800 text-[10px] px-1.5 py-0">
                                  banido
                                </Badge>
                              )}
                            </td>
                            <td className="p-4 text-muted-foreground">{user.email}</td>
                            <td className="p-4">
                              <Badge
                                variant="outline"
                                className={
                                  user.role === 'ADMIN'
                                    ? 'border-red-400 dark:border-red-800 bg-red-100/50 dark:bg-red-950/30 text-red-700 dark:text-red-300'
                                    : 'border-input bg-secondary text-muted-foreground'
                                }
                              >
                                {user.role}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <Badge
                                variant="outline"
                                className={
                                  user.is_banned
                                    ? 'border-red-400 dark:border-red-800 bg-red-100/50 dark:bg-red-950/30 text-red-700 dark:text-red-300'
                                    : 'border-emerald-400 dark:border-emerald-800 bg-emerald-100/50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300'
                                }
                              >
                                {user.is_banned ? 'Banido' : 'Ativo'}
                              </Badge>
                            </td>
                            <td className="p-4 text-muted-foreground text-xs">
                              {new Date(user.created_at).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-muted-foreground hover:text-amber-500 hover:bg-secondary"
                                  onClick={() => toggleRole(user)}
                                  disabled={actionLoading === user.id}
                                  title={user.role === 'ADMIN' ? 'Rebaixar para USER' : 'Promover a ADMIN'}
                                >
                                  <Shield className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className={`h-8 w-8 text-muted-foreground hover:text-orange-500 hover:bg-secondary ${user.is_banned ? 'text-orange-500' : ''}`}
                                  onClick={() => toggleBan(user)}
                                  disabled={actionLoading === user.id}
                                  title={user.is_banned ? 'Desbanir' : 'Banir'}
                                >
                                  <Ban className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-secondary"
                                  onClick={() => deleteUser(user)}
                                  disabled={actionLoading === user.id}
                                  title="Excluir usuário e dados"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-muted-foreground hover:text-yellow-500 hover:bg-secondary"
                                  onClick={() => deleteAllUserRanking(user.id, user.username)}
                                  disabled={actionLoading === `ranking-user-${user.id}`}
                                  title="Remover do ranking"
                                >
                                  <Trophy className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ranking Tab */}
        <TabsContent value="ranking" className="space-y-4">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por username no ranking..."
              value={rankingSearch}
              onChange={(e) => setRankingSearch(e.target.value)}
              className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          {/* Ranking Table */}
          <Card className="bg-card border-border">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 text-muted-foreground font-medium w-10">#</th>
                      <th className="text-left p-4 text-muted-foreground font-medium">Jogador</th>
                      <th className="text-left p-4 text-muted-foreground font-medium">Pontuação</th>
                      <th className="text-left p-4 text-muted-foreground font-medium">Acertos</th>
                      <th className="text-left p-4 text-muted-foreground font-medium">Precisão</th>
                      <th className="text-left p-4 text-muted-foreground font-medium">Tempo</th>
                      <th className="text-left p-4 text-muted-foreground font-medium">Data</th>
                      <th className="text-left p-4 text-muted-foreground font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {rankingLoading ? (
                        [...Array(5)].map((_, i) => (
                          <tr key={i} className="border-b border-border/50">
                            {[...Array(8)].map((_, j) => (
                              <td key={j} className="p-4">
                                <div className="h-4 bg-secondary rounded animate-pulse w-16" />
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : ranking.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-muted-foreground">
                            Nenhuma entrada no ranking.
                          </td>
                        </tr>
                      ) : (
                        ranking.map((entry, index) => (
                          <motion.tr
                            key={entry.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                          >
                            <td className="p-4">
                              <span className={`font-bold text-sm ${index < 3 ? 'text-yellow-600 dark:text-yellow-400' : 'text-muted-foreground'}`}>
                                {index + 1}
                              </span>
                            </td>
                            <td className="p-4 font-medium text-foreground">{entry.username}</td>
                            <td className="p-4">
                              <span className="font-bold text-foreground">{entry.pontuacao.toLocaleString('pt-BR')}</span>
                              <span className="text-muted-foreground text-xs ml-1">pts</span>
                            </td>
                            <td className="p-4 text-muted-foreground">{entry.total_acertos}/{entry.total_questoes}</td>
                            <td className="p-4 text-muted-foreground">{entry.percentual.toFixed(1)}%</td>
                            <td className="p-4 text-muted-foreground text-xs">
                              {Math.floor(entry.tempo_gasto / 60)}m {String(entry.tempo_gasto % 60).padStart(2, '0')}s
                            </td>
                            <td className="p-4 text-muted-foreground text-xs">
                              {new Date(entry.data_tentativa).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="p-4">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-secondary"
                                onClick={() => deleteRankingEntry(entry)}
                                disabled={actionLoading === `ranking-${entry.id}`}
                                title="Remover do ranking"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
