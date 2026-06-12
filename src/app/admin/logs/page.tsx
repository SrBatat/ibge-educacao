'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { FileText, RefreshCw, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LogEntry {
  id: string;
  username: string | null;
  acao: string;
  detalhes: any;
  created_at: string;
}

const ACAO_COLORS: Record<string, string> = {
  LOGIN: 'bg-emerald-950/50 text-emerald-400 border-emerald-800',
  LOGOUT: 'bg-zinc-800/50 text-zinc-400 border-zinc-700',
  QUIZ_START: 'bg-blue-950/50 text-blue-400 border-blue-800',
  QUIZ_FINISH: 'bg-purple-950/50 text-purple-400 border-purple-800',
  ADMIN_ACTION: 'bg-red-950/50 text-red-400 border-red-800',
};

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    let query = supabase.from('tb_access_logs').select('*').order('created_at', { ascending: false }).limit(100);
    if (filter !== 'all') query = query.eq('acao', filter);
    const { data, error } = await query;
    if (!error && data) setLogs(data as LogEntry[]);
    setLoading(false);
  };

  useEffect(() => { fetchLogs(); }, [filter]);

  const filtered = logs.filter(l =>
    !search || l.username?.toLowerCase().includes(search.toLowerCase()) || l.acao.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (d: string) => new Date(d).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide font-display-gothic">Logs de Acesso</h1>
          <p className="text-sm text-zinc-500 mt-1">Auditoria de ações e eventos do sistema</p>
        </div>
        <Button onClick={fetchLogs} variant="outline" size="sm" className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 gap-2">
          <RefreshCw size={14} /> Atualizar
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por username ou ação..." className="pl-9 bg-zinc-900 border-zinc-700 text-white placeholder-zinc-600 text-sm" />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-700 text-white text-sm">
            <SelectValue placeholder="Filtrar ação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as ações</SelectItem>
            <SelectItem value="LOGIN">LOGIN</SelectItem>
            <SelectItem value="LOGOUT">LOGOUT</SelectItem>
            <SelectItem value="QUIZ_START">QUIZ_START</SelectItem>
            <SelectItem value="QUIZ_FINISH">QUIZ_FINISH</SelectItem>
            <SelectItem value="ADMIN_ACTION">ADMIN_ACTION</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base font-display-gothic flex items-center gap-2">
            <FileText className="w-4 h-4 text-zinc-500" /> Registros de Auditoria
          </CardTitle>
          <CardDescription className="text-zinc-500 text-xs">{filtered.length} registros encontrados</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 border-2 border-zinc-700 border-t-red-700 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left py-2 px-3 text-zinc-500 font-medium uppercase tracking-widest">Usuário</th>
                    <th className="text-left py-2 px-3 text-zinc-500 font-medium uppercase tracking-widest">Ação</th>
                    <th className="text-left py-2 px-3 text-zinc-500 font-medium uppercase tracking-widest">Detalhes</th>
                    <th className="text-left py-2 px-3 text-zinc-500 font-medium uppercase tracking-widest">Data/Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((log, i) => (
                    <motion.tr key={log.id} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }} className="border-b border-zinc-900 hover:bg-zinc-800/30 transition-colors">
                      <td className="py-2 px-3 text-white font-medium">{log.username || '—'}</td>
                      <td className="py-2 px-3">
                        <Badge variant="outline" className={`text-[10px] ${ACAO_COLORS[log.acao] || 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                          {log.acao}
                        </Badge>
                      </td>
                      <td className="py-2 px-3 text-zinc-400 max-w-[200px] truncate">{log.detalhes ? JSON.stringify(log.detalhes) : '—'}</td>
                      <td className="py-2 px-3 text-zinc-500 tabular-nums">{formatDate(log.created_at)}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
