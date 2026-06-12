'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center gap-6 text-center px-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
        >
          <ShieldAlert className="w-20 h-20 text-red-500" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-8xl font-bold text-red-500 font-display-gothic"
        >
          403
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-2xl font-semibold text-white font-display-gothic"
        >
          Acesso Restrito
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="text-muted-foreground max-w-md"
        >
          Apenas administradores podem acessar esta área.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="flex items-center gap-3 mt-4"
        >
          <Button
            variant="outline"
            className="border-input text-card-foreground hover:bg-secondary hover:text-foreground"
            onClick={() => router.push('/')}
          >
            Voltar ao Dashboard
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90 text-white"
            onClick={() => router.push('/login')}
          >
            Fazer Login
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
