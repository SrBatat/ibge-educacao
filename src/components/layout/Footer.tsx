'use client';

export default function Footer() {
  return (
    <footer className="border-t border-gothic-700/50 bg-gothic-950 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-display-gothic text-sm font-semibold text-white tracking-widest">IBGE</span>
          <span className="text-xs text-gothic-500">Portal Analítico — Censo 2022</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-gothic-600">
          <span>Dados: IBGE/SIDRA</span>
          <span className="text-gothic-700">|</span>
          <span>Portal Educacional</span>
        </div>
      </div>
    </footer>
  );
}
