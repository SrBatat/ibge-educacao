'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trophy, Home, RotateCcw, Crown, Clock, Target, Medal, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface RankingEntry {
  id: string;
  username: string;
  pontuacao: number;
  total_acertos: number;
  total_questoes: number;
  tempo_gasto: number;
  percentual: number;
  data_tentativa: string;
}

type ResultCategory = 'Perfeito' | 'Excelente' | 'Bom' | 'Regular' | 'Tente Novamente';

function getCategory(percentage: number): ResultCategory {
  if (percentage === 100) return 'Perfeito';
  if (percentage >= 80) return 'Excelente';
  if (percentage >= 60) return 'Bom';
  if (percentage >= 40) return 'Regular';
  return 'Tente Novamente';
}

function getCategoryStyle(category: ResultCategory) {
  switch (category) {
    case 'Perfeito':
      return {
        bg: 'bg-yellow-950/20',
        border: 'border-yellow-700/40',
        text: 'text-yellow-400',
        icon: <Star className="w-8 h-8 text-yellow-400" />,
        glow: 'shadow-[0_0_40px_rgba(234,179,8,0.15)]',
      };
    case 'Excelente':
      return {
        bg: 'bg-emerald-950/20',
        border: 'border-emerald-700/40',
        text: 'text-emerald-400',
        icon: <Trophy className="w-8 h-8 text-emerald-400" />,
        glow: 'shadow-[0_0_40px_rgba(16,185,129,0.1)]',
      };
    case 'Bom':
      return {
        bg: 'bg-blue-950/20',
        border: 'border-blue-700/40',
        text: 'text-blue-400',
        icon: <Medal className="w-8 h-8 text-blue-400" />,
        glow: '',
      };
    case 'Regular':
      return {
        bg: 'bg-orange-950/20',
        border: 'border-orange-700/40',
        text: 'text-orange-400',
        icon: <Target className="w-8 h-8 text-orange-400" />,
        glow: '',
      };
    case 'Tente Novamente':
      return {
        bg: 'bg-red-950/20',
        border: 'border-red-700/40',
        text: 'text-red-400',
        icon: <RotateCcw className="w-8 h-8 text-red-400" />,
        glow: '',
      };
  }
}

const positionStyles = [
  { bg: 'bg-yellow-950/30', border: 'border-yellow-700/40', text: 'text-yellow-400', icon: '🥇' },
  { bg: 'bg-zinc-800/50', border: 'border-zinc-600/40', text: 'text-zinc-300', icon: '🥈' },
  { bg: 'bg-amber-950/30', border: 'border-amber-700/40', text: 'text-amber-600', icon: '🥉' },
];

function formatTime(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}m ${sec.toString().padStart(2, '0')}s`;
}

function ResultContent() {
  const searchParams = useSearchParams();
  const { profile } = useAuth();

  const pontuacao = parseInt(searchParams.get('pontuacao') || '0');
  const acertos = parseInt(searchParams.get('acertos') || '0');
  const total = parseInt(searchParams.get('total') || '10');
  const tempo = parseInt(searchParams.get('tempo') || '0');

  const percentage = total > 0 ? (acertos / total) * 100 : 0;
  const category = getCategory(percentage);
  const categoryStyle = getCategoryStyle(category);

  const [leaderboard, setLeaderboard] = useState<RankingEntry[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  async function fetchLeaderboard() {
    setLoadingLeaderboard(true);
    try {
      const { data, error } = await supabase
        .from('tb_ranking')
        .select('*')
        .order('pontuacao', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Erro ao carregar ranking:', error);
      } else if (data) {
        setLeaderboard(data as RankingEntry[]);
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
    } finally {
      setLoadingLeaderboard(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h1 className="font-display-gothic text-xl text-white tracking-wide">Resultado</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 space-y-8">
        {/* Result Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        >
          <Card className={`bg-zinc-900 border-zinc-800 ${categoryStyle.glow}`}>
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-6">
                {/* Category Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2, type: 'spring', stiffness: 200 }}
                  className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${categoryStyle.bg} border ${categoryStyle.border}`}
                >
                  {categoryStyle.icon}
                </motion.div>

                {/* Category Label */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <h2 className={`font-display-gothic text-3xl md:text-4xl tracking-wider ${categoryStyle.text}`}>
                    {category}
                  </h2>
                </motion.div>

                {/* Score */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <p className="text-zinc-500 text-sm mb-1">Pontuação</p>
                  <p className="text-5xl md:text-6xl font-bold text-white font-display-gothic">
                    {pontuacao.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-zinc-600 text-xs mt-1">pontos</p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="grid grid-cols-3 gap-4 max-w-md mx-auto"
                >
                  <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/30">
                    <Target className="w-5 h-5 text-red-400 mx-auto mb-2" />
                    <p className="text-white font-bold text-lg">{acertos}/{total}</p>
                    <p className="text-zinc-500 text-xs">Acertos</p>
                  </div>
                  <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/30">
                    <Star className="w-5 h-5 text-yellow-500 mx-auto mb-2" />
                    <p className="text-white font-bold text-lg">{Math.round(percentage)}%</p>
                    <p className="text-zinc-500 text-xs">Precisão</p>
                  </div>
                  <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/30">
                    <Clock className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                    <p className="text-white font-bold text-lg">{formatTime(tempo)}</p>
                    <p className="text-zinc-500 text-xs">Tempo</p>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link href="/quiz">
            <Button
              size="lg"
              className="bg-red-900 hover:bg-red-800 text-white font-display-gothic tracking-wider hover:shadow-gothic-crimson-glow transition-all duration-300 w-full sm:w-auto"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Jogar Novamente
            </Button>
          </Link>
          <Link href="/">
            <Button
              size="lg"
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white font-display-gothic tracking-wider w-full sm:w-auto"
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="bg-zinc-900 border-zinc-800 shadow-gothic-card">
            <CardHeader>
              <CardTitle className="text-white font-display-gothic text-lg flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                Ranking — Top 10
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingLeaderboard ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                      <div className="w-8 h-8 bg-zinc-800 rounded-lg" />
                      <div className="flex-1">
                        <div className="h-3 bg-zinc-800 rounded w-28 mb-1" />
                        <div className="h-2 bg-zinc-800/50 rounded w-20" />
                      </div>
                      <div className="h-4 bg-zinc-800 rounded w-16" />
                    </div>
                  ))}
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="text-center py-8">
                  <Crown className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                  <p className="text-zinc-500 text-sm">Nenhum resultado no ranking</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {/* Header row */}
                  <div className="grid grid-cols-[2.5rem_1fr_auto_auto] gap-2 px-2 pb-2 border-b border-zinc-800">
                    <span className="text-xs text-zinc-600">#</span>
                    <span className="text-xs text-zinc-600">Jogador</span>
                    <span className="text-xs text-zinc-600 text-right min-w-[3rem]">Acertos</span>
                    <span className="text-xs text-zinc-600 text-right min-w-[4.5rem]">Pontos</span>
                  </div>

                  {leaderboard.map((entry, index) => {
                    const isCurrentUser = profile && entry.username === profile.username;
                    const posStyle = index < 3 ? positionStyles[index] : null;

                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.8 + index * 0.06 }}
                        className={`grid grid-cols-[2.5rem_1fr_auto_auto] gap-2 items-center px-2 py-2.5 rounded-lg transition-colors ${
                          isCurrentUser
                            ? 'bg-red-950/30 border border-red-900/40'
                            : posStyle
                              ? `${posStyle.bg} border ${posStyle.border}`
                              : 'hover:bg-zinc-800/30'
                        }`}
                      >
                        {/* Position */}
                        <div className="flex items-center justify-center">
                          {index < 3 ? (
                            <span className="text-lg">{posStyle!.icon}</span>
                          ) : (
                            <span className="text-zinc-500 text-sm font-mono">{index + 1}</span>
                          )}
                        </div>

                        {/* Username */}
                        <div className="min-w-0">
                          <p className={`text-sm font-medium truncate ${
                            isCurrentUser
                              ? 'text-red-300'
                              : posStyle
                                ? posStyle.text
                                : 'text-zinc-300'
                          }`}>
                            {entry.username}
                            {isCurrentUser && (
                              <Badge className="ml-2 bg-red-900/50 text-red-300 border-red-800 text-[10px] px-1.5 py-0">
                                você
                              </Badge>
                            )}
                          </p>
                          <p className="text-xs text-zinc-600">
                            {formatTime(entry.tempo_gasto)}
                          </p>
                        </div>

                        {/* Accuracy */}
                        <div className="text-right min-w-[3rem]">
                          <p className="text-xs text-zinc-400">
                            {entry.total_acertos}/{entry.total_questoes}
                          </p>
                        </div>

                        {/* Points */}
                        <div className="text-right min-w-[4.5rem]">
                          <p className={`text-sm font-bold ${
                            isCurrentUser
                              ? 'text-red-300'
                              : posStyle
                                ? posStyle.text
                                : 'text-white'
                          }`}>
                            {entry.pontuacao.toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950 mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-4 text-center">
          <p className="text-zinc-600 text-xs">
            Dados baseados no Censo Demográfico 2022 — IBGE
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function QuizResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Trophy className="w-12 h-12 text-yellow-500 animate-pulse mx-auto" />
            <p className="font-display-gothic text-2xl text-white tracking-wider">Carregando Resultado</p>
          </div>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
