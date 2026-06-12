'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useCountUp } from '@/hooks/useCountUp';

// Default color if none provided
const DEFAULT_COLOR = '#b91c1c';

interface KPICardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
  delay?: number;
}

export default function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = DEFAULT_COLOR,
  delay = 0,
}: KPICardProps) {
  // Parse the numeric part from the value string
  const numericMatch = value.match(/[\d]+[,.]?[\d]*/);
  const numericValue = numericMatch ? parseFloat(numericMatch[0].replace(',', '.')) : 0;
  const prefix = numericMatch ? value.substring(0, value.indexOf(numericMatch[0])) : '';
  const suffix = numericMatch ? value.substring(value.indexOf(numericMatch[0]) + numericMatch[0].length) : value;
  const countRef = useCountUp(numericValue);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, scale: 1.01 }}
    >
      <Card className="relative overflow-hidden bg-gothic-900 border-gothic-700/40 hover:border-gothic-600/60 hover:shadow-gothic-card-hover transition-all duration-300 group">
        {/* Subtle top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5 opacity-60 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
        />

        <CardContent className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1.5 sm:space-y-2 min-w-0 flex-1">
              <p className="text-[10px] sm:text-xs text-gothic-500 uppercase tracking-wider font-medium truncate">
                {title}
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-mono-gothic number-glow">
                {prefix}<span ref={countRef}>0</span>{suffix}
              </p>
              <div className="flex items-center gap-1.5">
                {trend === 'up' && <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 shrink-0" />}
                {trend === 'down' && <ArrowDownRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-400 shrink-0" />}
                {trend === 'neutral' && <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gothic-500 shrink-0" />}
                <span className="text-[10px] sm:text-xs text-gothic-500 truncate">{subtitle}</span>
              </div>
            </div>
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
              style={{
                backgroundColor: `${color}15`,
                color,
                boxShadow: `0 0 0 0 ${color}00`,
              }}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>

          {/* Bottom decorative line */}
          <div
            className="mt-3 h-0.5 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"
            style={{ backgroundColor: color }}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
