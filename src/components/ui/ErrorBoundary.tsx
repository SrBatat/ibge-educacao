'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
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
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-[300px] flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-crimson-900/30 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-crimson-300" />
            </div>
            <h3 className="text-lg font-semibold text-white font-display-gothic">Algo deu errado</h3>
            <p className="text-sm text-gothic-500 max-w-md">
              Ocorreu um erro inesperado. Tente recarregar a página.
            </p>
            <Button
              onClick={() => this.setState({ hasError: false, error: undefined })}
              className="bg-crimson-700 hover:bg-crimson-500 text-white gap-2"
            >
              <RefreshCw size={14} /> Tentar novamente
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
