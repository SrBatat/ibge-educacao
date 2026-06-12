'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { UserPlus, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { setErr('A senha deve ter pelo menos 6 caracteres.'); return; }
    setLoading(true);
    setErr('');
    const { error } = await signUp(email, password, username);
    if (error) {
      setErr(error.includes('duplicate') ? 'E-mail ou username já cadastrado.' : error);
      setLoading(false);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-chart-2/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      </div>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-foreground tracking-widest uppercase font-display-gothic">IBGE</h1>
          <p className="text-xs tracking-[0.4em] text-muted-foreground mt-1 uppercase font-display-gothic">Criar Conta</p>
          <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent mt-4" />
        </div>
        <div className="bg-card border border-border rounded-xl p-8 shadow-gothic-card">
          <h2 className="text-xl text-foreground mb-6 tracking-wider font-display-gothic">Cadastro</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="w-full bg-transparent border-0 border-b border-input text-foreground placeholder-muted-foreground py-2 px-0 text-sm focus:outline-none focus:border-primary transition-colors" placeholder="seu_username" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">E-mail</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-transparent border-0 border-b border-input text-foreground placeholder-muted-foreground py-2 px-0 text-sm focus:outline-none focus:border-primary transition-colors" placeholder="seu@email.com" />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">Senha</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="w-full bg-transparent border-0 border-b border-input text-foreground placeholder-muted-foreground py-2 px-0 pr-8 text-sm focus:outline-none focus:border-primary transition-colors" placeholder="Mínimo 6 caracteres" />
                <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-0 bottom-2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {err && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-destructive text-xs bg-destructive/10 border border-destructive/30 rounded-md p-3">
                <AlertCircle size={14} /><span>{err}</span>
              </motion.div>
            )}
            <button type="submit" disabled={loading} className="w-full mt-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-foreground font-medium text-sm py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-gothic-purple-glow">
              {loading ? <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><UserPlus size={16} /> Criar Conta</>}
            </button>
          </form>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Já tem conta?{' '}
            <Link href="/login" className="text-primary hover:text-foreground transition-colors">Faça login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
