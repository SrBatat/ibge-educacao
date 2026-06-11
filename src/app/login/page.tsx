'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr('');
    const { error } = await signIn(email, password);
    if (error) {
      setErr('Credenciais inválidas. Verifique e-mail e senha.');
      setLoading(false);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-purple-900/10 rounded-full blur-3xl" />
      </div>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative w-full max-w-md">
        <div className="text-center mb-10">
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }} className="text-4xl font-bold text-white tracking-widest uppercase font-display-gothic">
            IBGE
          </motion.h1>
          <p className="text-xs tracking-[0.4em] text-zinc-500 mt-1 uppercase font-display-gothic">Portal Analítico</p>
          <div className="h-px bg-gradient-to-r from-transparent via-red-800 to-transparent mt-4" />
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-gothic-card">
          <h2 className="text-xl text-white mb-6 tracking-wider font-display-gothic">Acesso ao Sistema</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-widest mb-2">E-mail</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-transparent border-0 border-b border-zinc-700 text-white placeholder-zinc-600 py-2 px-0 text-sm focus:outline-none focus:border-red-700 transition-colors duration-200" placeholder="seu@email.com" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-widest mb-2">Senha</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-transparent border-0 border-b border-zinc-700 text-white placeholder-zinc-600 py-2 px-0 pr-8 text-sm focus:outline-none focus:border-red-700 transition-colors duration-200" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-0 bottom-2 text-zinc-500 hover:text-white transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {err && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-red-400 text-xs bg-red-950/30 border border-red-900/50 rounded-md p-3">
                <AlertCircle size={14} />
                <span>{err}</span>
              </motion.div>
            )}
            <button type="submit" disabled={loading} className="w-full mt-2 bg-red-800 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-gothic-crimson-glow">
              {loading ? <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><LogIn size={16} /> Entrar</>}
            </button>
          </form>
          <p className="mt-6 text-center text-xs text-zinc-500">
            Não tem conta?{' '}
            <Link href="/register" className="text-red-400 hover:text-white transition-colors">Cadastre-se</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
