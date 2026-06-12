'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Skull, Trophy, ArrowLeft, Crown, Clock, Target, Zap, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface RankingEntry {
  id: string;
  username: string;
  pontuacao: number;
  total_acertos: number;
  total_questoes: number;
  percentual: number;
  data_tentativa: string;
}

export default function QuizLobby() {
  const router = useRouter();
  const { profile, loading: authLoading } = useAuth();
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
        .limit(5);

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

  const positionColors = ['text-yellow-400', 'text-zinc-300', 'text-amber-600'];
  const positionIcons = [<Crown key="1" className="w-4 h-4 text-yellow-400" />, <Crown key="2" className="w-4 h-4 text-zinc-300" />, <Crown key="3" className="w-4 h-4 text-amber-600" />];

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Skull className="w-6 h-6 text-red-500" />
            <h1 className="font-display-gothic text-xl text-white tracking-wide">Desafio IBGE</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="grid md:grid-cols-5 gap-6">
          {/* Left: Quiz Info & Start */}
          <div className="md:col-span-3 space-y-6">
            {/* Title Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center md:text-left"
            >
              <h2 className="font-display-gothic text-4xl md:text-5xl text-white tracking-wider mb-2">
                Desafio IBGE
              </h2>
              <p className="text-zinc-400 text-lg">
                Teste seus conhecimentos sobre os dados do Censo Demográfico 2022
              </p>
            </motion.div>

            {/* Rules Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="bg-zinc-900 border-zinc-800 shadow-gothic-card">
                <CardHeader>
                  <CardTitle className="text-white font-display-gothic text-lg flex items-center gap-2">
                    <Target className="w-5 h-5 text-red-500" />
                    Regras do Desafio
                  </CardTitle>
                  <CardDescription className="text-zinc-500">
                    Como funciona a pontuação
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-red-400" />
                        <span className="text-white font-semibold text-sm">Questões</span>
                      </div>
                      <p className="text-2xl font-bold text-white">10</p>
                      <p className="text-xs text-zinc-500 mt-1">perguntas</p>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-red-400" />
                        <span className="text-white font-semibold text-sm">Tempo</span>
                      </div>
                      <p className="text-2xl font-bold text-white">30s</p>
                      <p className="text-xs text-zinc-500 mt-1">por questão</p>
                    </div>
                    <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-red-400" />
                        <span className="text-white font-semibold text-sm">Pontos</span>
                      </div>
                      <p className="text-2xl font-bold text-white">150</p>
                      <p className="text-xs text-zinc-500 mt-1">máx / questão</p>
                    </div>
                  </div>

                  <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/30">
                    <h4 className="text-white text-sm font-semibold mb-2">Sistema de Pontuação</h4>
                    <ul className="space-y-1 text-sm text-zinc-400">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">&#9670;</span>
                        <span>Resposta correta: <span className="text-white font-medium">100 pontos</span> base</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">&#9670;</span>
                        <span>Bônus de velocidade: até <span className="text-white font-medium">+50 pontos</span> (proporcional ao tempo restante)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">&#9670;</span>
                        <span>Resposta errada ou tempo esgotado: <span className="text-white font-medium">0 pontos</span></span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Start Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center md:items-start gap-3"
            >
              <Button
                onClick={() => router.push('/quiz/play')}
                size="lg"
                className="bg-red-900 hover:bg-red-800 text-white font-display-gothic text-lg tracking-wider px-8 py-6 transition-all duration-300 hover:shadow-gothic-crimson-glow animate-pulse-crimson"
              >
                <Zap className="w-5 h-5 mr-2" />
                Iniciar Desafio
              </Button>
              {authLoading && (
                <p className="text-zinc-500 text-sm">Verificando autenticação...</p>
              )}
              {!authLoading && !profile && (
                <p className="text-zinc-500 text-sm">
                  Faça <Link href="/login" className="text-red-400 hover:underline">login</Link> para salvar seu resultado no ranking
                </p>
              )}
            </motion.div>
          </div>

          {/* Right: Mini Leaderboard */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-zinc-900 border-zinc-800 shadow-gothic-card">
                <CardHeader>
                  <CardTitle className="text-white font-display-gothic text-lg flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Top 5 Ranking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingLeaderboard ? (
                    <div className="space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3 animate-pulse">
                          <div className="w-6 h-6 bg-zinc-800 rounded-full" />
                          <div className="flex-1">
                            <div className="h-3 bg-zinc-800 rounded w-24 mb-1" />
                            <div className="h-2 bg-zinc-800/50 rounded w-16" />
                          </div>
                          <div className="h-4 bg-zinc-800 rounded w-12" />
                        </div>
                      ))}
                    </div>
                  ) : leaderboard.length === 0 ? (
                    <div className="text-center py-8">
                      <Trophy className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                      <p className="text-zinc-500 text-sm">Nenhum resultado ainda</p>
                      <p className="text-zinc-600 text-xs mt-1">Seja o primeiro a jogar!</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {leaderboard.map((entry, index) => (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.4 + index * 0.08 }}
                          className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors ${
                            profile && entry.username === profile.username
                              ? 'bg-red-950/30 border border-red-900/40'
                              : 'hover:bg-zinc-800/50'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            index < 3 ? 'bg-zinc-800' : 'bg-zinc-800/50'
                          }`}>
                            {index < 3 ? positionIcons[index] : (
                              <span className="text-zinc-500">{index + 1}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${
                              index < 3 ? positionColors[index] : 'text-zinc-300'
                            }`}>
                              {entry.username}
                            </p>
                            <p className="text-xs text-zinc-500">
                              {entry.total_acertos}/{entry.total_questoes} acertos
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-bold ${
                              index < 3 ? positionColors[index] : 'text-white'
                            }`}>
                              {entry.pontuacao.toLocaleString('pt-BR')}
                            </p>
                            <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-500 px-1 py-0">
                              pts
                            </Badge>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {leaderboard.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-zinc-800">
                      <Link href="/quiz/result">
                        <Button variant="ghost" size="sm" className="w-full text-zinc-400 hover:text-white hover:bg-zinc-800">
                          Ver ranking completo
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
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
