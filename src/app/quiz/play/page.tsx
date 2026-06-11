'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Clock, CheckCircle2, XCircle, ChevronRight, ArrowRight, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface QuizQuestion {
  id: string;
  pergunta: string;
  opcao_a: string;
  opcao_b: string;
  opcao_c: string;
  opcao_d: string;
  resposta_correta: string;
  pontos: number;
  dificuldade: string;
  categoria: string;
  explicacao: string | null;
  ativo: boolean;
}

type GameState = 'LOADING' | 'PLAYING' | 'ANSWERED' | 'FINISHED';

const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const;
const OPTION_KEYS = ['opcao_a', 'opcao_b', 'opcao_c', 'opcao_d'] as const;
const TIME_PER_QUESTION = 30;
const BASE_POINTS = 100;
const MAX_BONUS = 50;

const difficultyColors: Record<string, string> = {
  FACIL: 'text-emerald-400 border-emerald-800/50',
  MEDIO: 'text-yellow-400 border-yellow-800/50',
  DIFICIL: 'text-red-400 border-red-800/50',
};

const difficultyLabels: Record<string, string> = {
  FACIL: 'Fácil',
  MEDIO: 'Médio',
  DIFICIL: 'Difícil',
};

export default function QuizPlay() {
  const router = useRouter();
  const { profile } = useAuth();

  const [gameState, setGameState] = useState<GameState>('LOADING');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const questionStartTime = useRef<number>(0);

  const currentQuestion = questions[currentIndex] as QuizQuestion | undefined;

  // Fetch questions on mount
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const { data, error: fetchError } = await supabase
          .from('tb_quiz_questions')
          .select('*')
          .eq('ativo', true)
          .limit(10);

        if (fetchError) {
          console.error('Erro ao buscar questões:', fetchError);
          setError('Erro ao carregar questões. Tente novamente.');
          return;
        }

        if (!data || data.length === 0) {
          setError('Nenhuma questão disponível no momento.');
          return;
        }

        // Shuffle the questions
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setQuestions(shuffled);
        setGameState('PLAYING');
        questionStartTime.current = Date.now();
      } catch (err) {
        console.error('Erro inesperado:', err);
        setError('Erro inesperado ao carregar questões.');
      }
    }

    fetchQuestions();
  }, []);

  // Timer logic
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleTimeUp = useCallback(() => {
    stopTimer();
    setSelectedOption('TIMEOUT');
    setGameState('ANSWERED');
  }, [stopTimer]);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      setTimeLeft(TIME_PER_QUESTION);
      questionStartTime.current = Date.now();

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => stopTimer();
    }
  }, [gameState, currentIndex, handleTimeUp, stopTimer]);

  // Handle answer selection
  function handleAnswer(option: string) {
    if (gameState !== 'PLAYING' || !currentQuestion) return;

    stopTimer();
    setSelectedOption(option);
    setGameState('ANSWERED');

    const elapsed = Math.floor((Date.now() - questionStartTime.current) / 1000);
    setTotalTime((prev) => prev + elapsed);

    const isCorrect = option === currentQuestion.resposta_correta;
    if (isCorrect) {
      const timeRemaining = Math.max(0, TIME_PER_QUESTION - elapsed);
      const bonus = Math.round((timeRemaining / TIME_PER_QUESTION) * MAX_BONUS);
      const questionScore = BASE_POINTS + bonus;
      setScore((prev) => prev + questionScore);
      setCorrectCount((prev) => prev + 1);
    }
  }

  // Next question or finish
  async function handleNext() {
    if (currentIndex >= questions.length - 1) {
      setGameState('FINISHED');
      await saveResult();
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setGameState('PLAYING');
    }
  }

  // Save result to database
  async function saveResult() {
    const finalTotalTime = totalTime + (TIME_PER_QUESTION - timeLeft);
    const totalQuestions = questions.length;
    const percentual = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

    // Try to save to ranking if user is logged in
    if (profile) {
      try {
        await supabase.from('tb_ranking').insert({
          user_id: profile.id,
          username: profile.username,
          pontuacao: score,
          total_acertos: correctCount,
          total_questoes: totalQuestions,
          tempo_gasto: finalTotalTime,
          percentual: Math.round(percentual * 100) / 100,
        });
      } catch (err) {
        console.error('Erro ao salvar resultado:', err);
      }
    }

    // Navigate to results page with URL params
    const params = new URLSearchParams({
      pontuacao: score.toString(),
      acertos: correctCount.toString(),
      total: totalQuestions.toString(),
      tempo: finalTotalTime.toString(),
    });
    router.push(`/quiz/result?${params.toString()}`);
  }

  // Loading state
  if (gameState === 'LOADING') {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto" />
          <p className="font-display-gothic text-2xl text-white tracking-wider">Preparando o Desafio</p>
          <p className="text-zinc-500 text-sm">Carregando questões...</p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4 max-w-md px-4"
        >
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
          <p className="font-display-gothic text-2xl text-white tracking-wider">Erro</p>
          <p className="text-zinc-400">{error}</p>
          <Button
            onClick={() => router.push('/quiz')}
            variant="outline"
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            Voltar ao Lobby
          </Button>
        </motion.div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const isCorrect = selectedOption === currentQuestion.resposta_correta;
  const isTimeout = selectedOption === 'TIMEOUT';
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;
  const timerPercent = (timeLeft / TIME_PER_QUESTION) * 100;

  const getOptionStyle = (optionKey: string) => {
    if (gameState !== 'ANSWERED') {
      return 'bg-zinc-900 border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800 cursor-pointer';
    }

    if (optionKey === currentQuestion.resposta_correta) {
      return 'bg-emerald-950/50 border-emerald-600 cursor-default';
    }
    if (optionKey === selectedOption && !isCorrect) {
      return 'bg-red-950/50 border-red-600 cursor-default';
    }
    return 'bg-zinc-900/50 border-zinc-800 cursor-default opacity-50';
  };

  const getOptionIcon = (optionKey: string) => {
    if (gameState !== 'ANSWERED') return null;
    if (optionKey === currentQuestion.resposta_correta) {
      return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
    }
    if (optionKey === selectedOption && !isCorrect) {
      return <XCircle className="w-5 h-5 text-red-400" />;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Top Progress Bar */}
      <div className="sticky top-0 z-20 bg-zinc-950 border-b border-zinc-800">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                {currentIndex + 1} / {questions.length}
              </Badge>
              {currentQuestion.categoria && (
                <Badge variant="outline" className="border-zinc-700 text-zinc-500">
                  {currentQuestion.categoria}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-zinc-400">
                Pontos: <span className="text-white font-bold">{score}</span>
              </div>
            </div>
          </div>
          <Progress value={progressPercent} className="h-1.5 bg-zinc-800" />
        </div>
      </div>

      {/* Timer Bar */}
      <div className="max-w-3xl mx-auto w-full px-4 pt-4">
        <div className="flex items-center gap-3 mb-6">
          <Clock className={`w-4 h-4 ${timeLeft <= 10 ? 'text-red-500' : 'text-zinc-500'}`} />
          <div className="flex-1">
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full transition-colors duration-300 ${
                  timeLeft > 10 ? 'bg-red-800' : 'bg-red-500'
                }`}
                initial={{ width: '100%' }}
                animate={{ width: `${timerPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          <span className={`text-sm font-mono font-bold min-w-[3ch] text-right ${
            timeLeft <= 10 ? 'text-red-500' : 'text-zinc-400'
          }`}>
            {timeLeft}
          </span>
        </div>
      </div>

      {/* Question Card */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            {/* Question */}
            <Card className="bg-zinc-900 border-zinc-800 shadow-gothic-card mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge
                    variant="outline"
                    className={`${difficultyColors[currentQuestion.dificuldade] || 'text-zinc-400 border-zinc-700'} text-xs`}
                  >
                    {difficultyLabels[currentQuestion.dificuldade] || currentQuestion.dificuldade}
                  </Badge>
                </div>
                <h2 className="text-white text-lg md:text-xl font-medium leading-relaxed">
                  {currentQuestion.pergunta}
                </h2>
              </CardContent>
            </Card>

            {/* Options */}
            <div className="space-y-3">
              {OPTION_KEYS.map((key, idx) => {
                const optionText = currentQuestion[key] as string;
                const optionLabel = OPTION_LABELS[idx];
                const isDisabled = gameState === 'ANSWERED';

                return (
                  <motion.button
                    key={key}
                    onClick={() => !isDisabled && handleAnswer(optionLabel)}
                    disabled={isDisabled}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${getOptionStyle(optionLabel)}`}
                    whileHover={gameState === 'PLAYING' ? { scale: 1.01 } : {}}
                    whileTap={gameState === 'PLAYING' ? { scale: 0.99 } : {}}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                      gameState === 'ANSWERED' && optionLabel === currentQuestion.resposta_correta
                        ? 'bg-emerald-900 text-emerald-300'
                        : gameState === 'ANSWERED' && optionLabel === selectedOption && !isCorrect
                          ? 'bg-red-900 text-red-300'
                          : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {optionLabel}
                    </div>
                    <span className={`flex-1 text-sm md:text-base ${
                      gameState === 'ANSWERED' && optionLabel === currentQuestion.resposta_correta
                        ? 'text-emerald-200'
                        : gameState === 'ANSWERED' && optionLabel === selectedOption && !isCorrect
                          ? 'text-red-200'
                          : 'text-zinc-300'
                    }`}>
                      {optionText}
                    </span>
                    {getOptionIcon(optionLabel)}
                  </motion.button>
                );
              })}
            </div>

            {/* Feedback Section */}
            <AnimatePresence>
              {gameState === 'ANSWERED' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 space-y-4"
                >
                  {/* Result Feedback */}
                  <div className={`p-4 rounded-xl border ${
                    isTimeout
                      ? 'bg-zinc-900 border-zinc-700'
                      : isCorrect
                        ? 'bg-emerald-950/30 border-emerald-800/50'
                        : 'bg-red-950/30 border-red-800/50'
                  }`}>
                    <div className="flex items-center gap-3 mb-2">
                      {isTimeout ? (
                        <>
                          <Clock className="w-5 h-5 text-zinc-400" />
                          <span className="text-zinc-300 font-semibold">Tempo esgotado!</span>
                        </>
                      ) : isCorrect ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          <span className="text-emerald-300 font-semibold">Correto!</span>
                          <Badge className="bg-emerald-900/50 text-emerald-300 border-emerald-700 text-xs ml-auto">
                            +{BASE_POINTS + Math.round((Math.max(0, TIME_PER_QUESTION - Math.floor((Date.now() - questionStartTime.current) / 1000)) / TIME_PER_QUESTION) * MAX_BONUS)} pts
                          </Badge>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-red-400" />
                          <span className="text-red-300 font-semibold">Incorreto</span>
                        </>
                      )}
                    </div>

                    {!isCorrect && !isTimeout && (
                      <p className="text-zinc-400 text-sm">
                        Resposta correta: <span className="text-white font-medium">{currentQuestion.resposta_correta}</span>
                      </p>
                    )}

                    {currentQuestion.explicacao && (
                      <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
                        <span className="text-zinc-300 font-medium">Explicação:</span> {currentQuestion.explicacao}
                      </p>
                    )}
                  </div>

                  {/* Next Button */}
                  <Button
                    onClick={handleNext}
                    size="lg"
                    className={`w-full font-display-gothic text-base tracking-wider transition-all duration-300 ${
                      currentIndex >= questions.length - 1
                        ? 'bg-red-900 hover:bg-red-800 hover:shadow-gothic-crimson-glow text-white'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'
                    }`}
                  >
                    {currentIndex >= questions.length - 1 ? (
                      <>
                        Ver Resultado
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      <>
                        Próxima Questão
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
