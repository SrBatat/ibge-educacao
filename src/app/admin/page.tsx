'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, HelpCircle, Trophy, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

interface KPI {
  label: string;
  value: string | number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

interface LogEntry {
  id: string;
  username: string;
  acao: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [recentLogs, setRecentLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [usersRes, questionsRes, rankingRes, logsRes] = await Promise.all([
        supabase.from('tb_users').select('id', { count: 'exact', head: true }),
        supabase.from('tb_quiz_questions').select('id', { count: 'exact', head: true }).eq('ativo', true),
        supabase.from('tb_ranking').select('id', { count: 'exact', head: true }),
        supabase.from('tb_access_logs').select('*').order('created_at', { ascending: false }).limit(10),
      ]);

      const totalUsers = usersRes.count ?? 0;
      const activeQuestions = questionsRes.count ?? 0;
      const quizAttempts = rankingRes.count ?? 0;
      const lastActivity = logsRes.data?.[0]?.created_at
        ? new Date(logsRes.data[0].created_at).toLocaleString('pt-BR')
        : '—';

      setKpis([
        {
          label: 'Total Usuários',
          value: totalUsers,
          icon: Users,
          iconBg: 'bg-red-950/50',
          iconColor: 'text-red-400',
        },
        {
          label: 'Questões Ativas',
          value: activeQuestions,
          icon: HelpCircle,
          iconBg: 'bg-amber-950/50',
          iconColor: 'text-amber-400',
        },
        {
          label: 'Tentativas Quiz',
          value: quizAttempts,
          icon: Trophy,
          iconBg: 'bg-emerald-950/50',
          iconColor: 'text-emerald-400',
        },
        {
          label: 'Última Atividade',
          value: lastActivity,
          icon: Clock,
          iconBg: 'bg-zinc-800',
          iconColor: 'text-zinc-400',
        },
      ]);

      setRecentLogs(logsRes.data ?? []);
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-display-gothic text-white">Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-1">Visão geral do sistema</p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className="bg-zinc-900 border-zinc-800 shadow-gothic-card">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-lg ${kpi.iconBg}`}>
                      <Icon className={`h-5 w-5 ${kpi.iconColor}`} />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-white">{kpi.value}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{kpi.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="bg-zinc-900 border-zinc-800 shadow-gothic-card">
          <CardContent className="p-5">
            <h2 className="text-lg font-display-gothic text-white mb-4">Atividade Recente</h2>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-10 bg-zinc-800 rounded animate-pulse" />
                ))}
              </div>
            ) : recentLogs.length === 0 ? (
              <p className="text-zinc-500 text-sm">Nenhuma atividade registrada.</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-zinc-800/50 border border-zinc-800"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-white">{log.username}</span>
                      <span className="text-xs text-zinc-500">{log.acao}</span>
                    </div>
                    <span className="text-xs text-zinc-600">
                      {new Date(log.created_at).toLocaleString('pt-BR')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
