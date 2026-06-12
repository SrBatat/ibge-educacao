'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      const errorMessage = this.state.error?.message || 'Erro desconhecido';
      const isDev = process.env.NODE_ENV === 'development';

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 sm:p-8">
          <div className="max-w-md w-full text-center space-y-6">
            {/* Error icon with glow */}
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-crimson-900/20 rounded-full blur-xl animate-glow-pulse" />
              <div className="relative w-20 h-20 mx-auto rounded-full bg-gothic-900 border border-crimson-800/40 flex items-center justify-center">
                <AlertTriangle className="w-9 h-9 text-crimson-300" />
              </div>
            </div>

            {/* Title */}
            <div>
              <h3 className="text-xl font-semibold text-white font-display-gothic tracking-wider">
                Algo deu errado
              </h3>
              <p className="text-sm text-gothic-500 mt-2">
                Ocorreu um erro inesperado ao processar esta pagina. Tente recarregar ou volte ao inicio.
              </p>
            </div>

            {/* Error details (dev only) */}
            {isDev && this.state.error && (
              <div className="bg-gothic-900 border border-gothic-700/40 rounded-lg p-4 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <Bug size={12} className="text-crimson-300" />
                  <span className="text-[10px] text-crimson-300 uppercase tracking-wider font-semibold">Detalhes do Erro</span>
                </div>
                <pre className="text-[11px] text-gothic-400 font-mono-gothic overflow-x-auto whitespace-pre-wrap break-all">
                  {errorMessage}
                </pre>
                {this.state.errorInfo?.componentStack && (
                  <pre className="text-[10px] text-gothic-600 font-mono-gothic mt-2 overflow-x-auto whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                onClick={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
                className="bg-crimson-700 hover:bg-crimson-500 text-white gap-2 w-full sm:w-auto"
              >
                <RefreshCw size={14} /> Tentar novamente
              </Button>
              <Link href="/" className="w-full sm:w-auto">
                <Button variant="outline" className="border-gothic-700 text-gothic-400 hover:text-white hover:bg-gothic-900 gap-2 w-full">
                  <Home size={14} /> Voltar ao inicio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
