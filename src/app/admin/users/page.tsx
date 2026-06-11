'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, RefreshCw, Shield, Ban, Trash2, UserCog } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  is_banned: boolean;
  created_at: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('tb_users').select('*').order('created_at', { ascending: false });
    if (search) {
      query = query.or(`username.ilike.%${search}%,email.ilike.%${search}%`);
    }
    const { data, error } = await query;
    if (!error && data) setUsers(data as User[]);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const toggleRole = async (user: User) => {
    setActionLoading(user.id);
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    await supabase.from('tb_users').update({ role: newRole }).eq('id', user.id);
    await loadUsers();
    setActionLoading(null);
  };

  const toggleBan = async (user: User) => {
    setActionLoading(user.id);
    await supabase.from('tb_users').update({ is_banned: !user.is_banned }).eq('id', user.id);
    await loadUsers();
    setActionLoading(null);
  };

  const deleteUser = async (user: User) => {
    if (!window.confirm(`Excluir usuário "${user.username}"? Esta ação é irreversível.`)) return;
    setActionLoading(user.id);
    await supabase.from('tb_users').delete().eq('id', user.id);
    await loadUsers();
    setActionLoading(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-display-gothic text-white">Usuários</h1>
          <p className="text-sm text-zinc-500 mt-1">Gerenciamento de contas</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadUsers}
          className="border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Buscar por username ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-red-800"
          />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-zinc-900 border-zinc-800 shadow-gothic-card">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left p-4 text-zinc-500 font-medium">Username</th>
                    <th className="text-left p-4 text-zinc-500 font-medium">Email</th>
                    <th className="text-left p-4 text-zinc-500 font-medium">Role</th>
                    <th className="text-left p-4 text-zinc-500 font-medium">Status</th>
                    <th className="text-left p-4 text-zinc-500 font-medium">Cadastro</th>
                    <th className="text-left p-4 text-zinc-500 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {loading ? (
                      [...Array(5)].map((_, i) => (
                        <tr key={i} className="border-b border-zinc-800/50">
                          {[...Array(6)].map((_, j) => (
                            <td key={j} className="p-4">
                              <div className="h-4 bg-zinc-800 rounded animate-pulse w-20" />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-zinc-500">
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
                          className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                        >
                          <td className="p-4 font-medium text-white">{user.username}</td>
                          <td className="p-4 text-zinc-400">{user.email}</td>
                          <td className="p-4">
                            <Badge
                              variant="outline"
                              className={
                                user.role === 'ADMIN'
                                  ? 'border-red-800 bg-red-950/30 text-red-300'
                                  : 'border-zinc-700 bg-zinc-800 text-zinc-400'
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
                                  ? 'border-red-800 bg-red-950/30 text-red-300'
                                  : 'border-emerald-800 bg-emerald-950/30 text-emerald-300'
                              }
                            >
                              {user.is_banned ? 'Banido' : 'Ativo'}
                            </Badge>
                          </td>
                          <td className="p-4 text-zinc-500 text-xs">
                            {new Date(user.created_at).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-zinc-500 hover:text-amber-400 hover:bg-zinc-800"
                                onClick={() => toggleRole(user)}
                                disabled={actionLoading === user.id}
                                title={user.role === 'ADMIN' ? 'Rebaixar para USER' : 'Promover a ADMIN'}
                              >
                                <Shield className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-zinc-500 hover:text-orange-400 hover:bg-zinc-800"
                                onClick={() => toggleBan(user)}
                                disabled={actionLoading === user.id}
                                title={user.is_banned ? 'Desbanir' : 'Banir'}
                              >
                                <Ban className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-zinc-800"
                                onClick={() => deleteUser(user)}
                                disabled={actionLoading === user.id}
                                title="Excluir"
                              >
                                <Trash2 className="h-4 w-4" />
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
      </motion.div>
    </div>
  );
}
