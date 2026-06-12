'use client';

import { Database, BookOpen, BarChart3, Globe } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: 'Dados',
      items: [
        { label: 'Censo 2022', href: 'https://www.ibge.gov.br/estatisticas/sociais/populacao/22827-censo-demografico-2022.html' },
        { label: 'SIDRA', href: 'https://sidra.ibge.gov.br/' },
        { label: 'Tabela 10056', href: 'https://sidra.ibge.gov.br/tabela/10056' },
        { label: 'Tabela 10253', href: 'https://sidra.ibge.gov.br/tabela/10253' },
      ],
    },
    {
      title: 'Temas',
      items: [
        { label: 'Frequencia Escolar', href: '/' },
        { label: 'Situacao de Ocupacao', href: '/' },
        { label: 'Meio de Transporte', href: '/' },
        { label: 'Local de Trabalho', href: '/' },
      ],
    },
    {
      title: 'Institucional',
      items: [
        { label: 'IBGE', href: 'https://www.ibge.gov.br/' },
        { label: 'Portal Educacional', href: '/' },
        { label: 'Politica de Privacidade', href: '#' },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-background mt-auto">
      {/* Decorative gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Top section: Logo + Description */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:max-w-xs shrink-0">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-md bg-primary/20 border border-primary/30 flex items-center justify-center">
                <span className="font-display-gothic text-xs font-bold text-primary tracking-widest">I</span>
              </div>
              <div>
                <span className="font-display-gothic text-sm font-semibold text-foreground tracking-widest">IBGE</span>
                <span className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase ml-2 font-display-gothic">Portal</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Analise interativa dos dados do Censo Demografico 2022 do IBGE, com foco na educacao,
              ocupacao, transporte e local de trabalho da populacao brasileira.
            </p>
            {/* Stat badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-card border border-border">
                <Database size={11} className="text-primary" />
                <span className="text-[10px] text-muted-foreground">4 Tabelas</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-card border border-border">
                <BarChart3 size={11} className="text-chart-2" />
                <span className="text-[10px] text-muted-foreground">5 Regioes</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-card border border-border">
                <Globe size={11} className="text-emerald-500" />
                <span className="text-[10px] text-muted-foreground">27 UFs</span>
              </div>
            </div>
          </div>

          {/* Link sections */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
            {sections.map((section) => (
              <div key={section.title}>
                <h4 className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-semibold mb-3 font-display-gothic">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <BookOpen size={10} className="text-muted-foreground/50" />
            <span>Fonte: IBGE/SIDRA — Censo Demografico 2022</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <span>Portal Educacional</span>
            <span className="text-border">|</span>
            <span>{currentYear}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
