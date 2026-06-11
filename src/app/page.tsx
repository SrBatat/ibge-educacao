'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, GraduationCap, Users, TrendingUp, MapPin, Bus,
  ChevronDown, Info, BarChart3, PieChart, Activity, Globe,
  ArrowUpRight, ArrowDownRight, Minus, Search, Filter
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, PieChart as RechartsPie, Pie, Cell,
  LineChart, Line, AreaChart, Area, ComposedChart, ReferenceLine
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  frequenciaEscolar, situacaoOcupacao, localTrabalho, meioTransporte,
  regioes, estadosPorRegiao, ageGroups, ageGroupKeys, transportLabels, transportKeys,
  type FrequenciaEscolar
} from '@/lib/ibge-data';

// --- Color Palette (IBGE Gothic) ---
const COLORS = {
  crimson: '#b91c1c',
  crimsonLight: '#ef4444',
  purple: '#7c3aed',
  purpleLight: '#a78bfa',
  emerald: '#16a34a',
  emeraldLight: '#4ade80',
  amber: '#d97706',
  amberLight: '#fbbf24',
  sky: '#0284c7',
  skyLight: '#38bdf8',
  rose: '#e11d48',
  teal: '#0d9488',
  slate: '#64748b',
};

const CHART_COLORS = [
  COLORS.crimson, COLORS.purple, COLORS.emerald,
  COLORS.amber, COLORS.sky, COLORS.rose
];

// --- Custom Tooltip ---
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload) return null;
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 shadow-xl text-sm">
      <p className="text-zinc-300 font-medium mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-zinc-400">{entry.name}:</span>
          <span className="text-white font-semibold">{typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}%</span>
        </p>
      ))}
    </div>
  );
}

// --- KPI Card Component ---
function KPICard({ title, value, subtitle, icon: Icon, trend, color = COLORS.crimson }: {
  title: string; value: string; subtitle: string; icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral'; color?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-zinc-950 border-zinc-800 hover:border-zinc-700 transition-all duration-300 group">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">{title}</p>
              <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
              <div className="flex items-center gap-1.5">
                {trend === 'up' && <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />}
                {trend === 'down' && <ArrowDownRight className="w-3.5 h-3.5 text-red-400" />}
                {trend === 'neutral' && <Minus className="w-3.5 h-3.5 text-zinc-500" />}
                <span className="text-xs text-zinc-500">{subtitle}</span>
              </div>
            </div>
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
              style={{ backgroundColor: `${color}20`, color }}
            >
              <Icon className="w-5 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// --- Section Header ---
function SectionHeader({ title, description, icon: Icon }: { title: string; description: string; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-8 rounded-lg bg-red-950 flex items-center justify-center">
        <Icon className="w-4 h-4 text-red-400" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="text-xs text-zinc-500">{description}</p>
      </div>
    </div>
  );
}

// --- Education Tab ---
function EducacaoTab() {
  const [selectedRegiao, setSelectedRegiao] = useState<string>('Brasil');
  const [viewMode, setViewMode] = useState<'regioes' | 'estados'>('regioes');

  const currentData = useMemo(() => {
    return frequenciaEscolar.find(d => d.regiao === selectedRegiao) || frequenciaEscolar[0];
  }, [selectedRegiao]);

  // Chart data: Frequency by age group comparing men vs women
  const barChartData = useMemo(() => {
    return ageGroups.map((label, i) => ({
      name: label,
      Homens: currentData.homens[ageGroupKeys[i]],
      Mulheres: currentData.mulheres[ageGroupKeys[i]],
    }));
  }, [currentData]);

  // Radar chart data for regions
  const radarData = useMemo(() => {
    return ageGroups.map((label, i) => {
      const entry: Record<string, string | number> = { name: label.replace(' anos', '') };
      regioes.filter(r => r !== 'Brasil').forEach(regiao => {
        const data = frequenciaEscolar.find(d => d.regiao === regiao);
        if (data) {
          const avg = (data.homens[ageGroupKeys[i]] + data.mulheres[ageGroupKeys[i]]) / 2;
          entry[regiao] = Math.round(avg * 10) / 10;
        }
      });
      return entry;
    });
  }, []);

  // Regional comparison data
  const regionalComparison = useMemo(() => {
    return regioes.filter(r => r !== 'Brasil').map(regiao => {
      const data = frequenciaEscolar.find(d => d.regiao === regiao);
      if (!data) return { name: regiao };
      const totalAvg = ageGroupKeys.reduce((sum, key) => sum + (data.homens[key] + data.mulheres[key]) / 2, 0) / 6;
      const infantilAvg = ((data.homens['0a3'] + data.mulheres['0a3']) + (data.homens['4a5'] + data.mulheres['4a5'])) / 4;
      const fundamentalAvg = (data.homens['6a14'] + data.mulheres['6a14']) / 2;
      const medioAvg = (data.homens['15a17'] + data.mulheres['15a17']) / 2;
      const superiorAvg = (data.homens['18a24'] + data.mulheres['18a24']) / 2;
      return {
        name: regiao,
        'Educação Infantil': Math.round(infantilAvg * 10) / 10,
        'Ensino Fundamental': Math.round(fundamentalAvg * 10) / 10,
        'Ensino Médio': Math.round(medioAvg * 10) / 10,
        'Ensino Superior': Math.round(superiorAvg * 10) / 10,
      };
    });
  }, []);

  // States data
  const stateData = useMemo(() => {
    const regiao = selectedRegiao === 'Brasil' ? 'Sudeste' : selectedRegiao;
    const states = estadosPorRegiao[regiao] || [];
    return states.map(estado => {
      const data = frequenciaEscolar.find(d => d.regiao === estado);
      if (!data) return { name: estado };
      return {
        name: estado.replace('Rio Grande do ', 'RG do ').replace('Mato Grosso do ', 'MG do '),
        '0-3 anos': Math.round(((data.homens['0a3'] + data.mulheres['0a3']) / 2) * 10) / 10,
        '6-14 anos': Math.round(((data.homens['6a14'] + data.mulheres['6a14']) / 2) * 10) / 10,
        '15-17 anos': Math.round(((data.homens['15a17'] + data.mulheres['15a17']) / 2) * 10) / 10,
        '18-24 anos': Math.round(((data.homens['18a24'] + data.mulheres['18a24']) / 2) * 10) / 10,
      };
    });
  }, [selectedRegiao]);

  // Gender gap analysis
  const genderGapData = useMemo(() => {
    return ageGroups.map((label, i) => ({
      name: label.replace(' anos', ''),
      gap: Math.round((currentData.mulheres[ageGroupKeys[i]] - currentData.homens[ageGroupKeys[i]]) * 100) / 100,
    }));
  }, [currentData]);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          title="Educação Infantil (0-5)"
          value={`${Math.round(((currentData.homens['0a3'] + currentData.mulheres['0a3']) / 2 + (currentData.homens['4a5'] + currentData.mulheres['4a5']) / 2) / 2)}%`}
          subtitle="Média de frequência"
          icon={BookOpen}
          color={COLORS.purple}
        />
        <KPICard
          title="Ensino Fundamental"
          value={`${Math.round((currentData.homens['6a14'] + currentData.mulheres['6a14']) / 2)}%`}
          subtitle="6 a 14 anos"
          icon={GraduationCap}
          color={COLORS.emerald}
        />
        <KPICard
          title="Ensino Médio"
          value={`${Math.round((currentData.homens['15a17'] + currentData.mulheres['15a17']) / 2)}%`}
          subtitle="15 a 17 anos"
          icon={TrendingUp}
          color={COLORS.amber}
        />
        <KPICard
          title="Ensino Superior"
          value={`${Math.round((currentData.homens['18a24'] + currentData.mulheres['18a24']) / 2)}%`}
          subtitle="18 a 24 anos"
          icon={Users}
          color={COLORS.sky}
        />
      </div>

      {/* Region Selector + Main Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 bg-zinc-950 border-zinc-800">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-white text-base font-display-gothic">Frequência Escolar por Idade e Sexo</CardTitle>
                <CardDescription className="text-zinc-500 text-xs">Taxa bruta de frequência escolar — {selectedRegiao} — 2022</CardDescription>
              </div>
              <Select value={selectedRegiao} onValueChange={setSelectedRegiao}>
                <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-700 text-white text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {regioes.map(r => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={barChartData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 10 }} axisLine={{ stroke: '#3f3f46' }} />
                <YAxis tick={{ fill: '#a1a1aa', fontSize: 10 }} axisLine={{ stroke: '#3f3f46' }} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Homens" fill={COLORS.sky} radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="Mulheres" fill={COLORS.crimson} radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gender Gap Chart */}
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-base font-display-gothic">Gap de Gênero</CardTitle>
            <CardDescription className="text-zinc-500 text-xs">Diferença Mulheres - Homens (p.p.)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart data={genderGapData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 9 }} axisLine={{ stroke: '#3f3f46' }} />
                <YAxis tick={{ fill: '#a1a1aa', fontSize: 10 }} axisLine={{ stroke: '#3f3f46' }} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={0} stroke="#52526a" />
                <Bar dataKey="gap" name="Gap (p.p.)" radius={[4, 4, 0, 0]} maxBarSize={30}>
                  {genderGapData.map((entry, index) => (
                    <Cell key={index} fill={entry.gap >= 0 ? COLORS.emerald : COLORS.crimson} />
                  ))}
                </Bar>
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Regional Radar + Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-base font-display-gothic">Perfil Regional da Educação</CardTitle>
            <CardDescription className="text-zinc-500 text-xs">Comparação entre Grandes Regiões — Radar</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#27272a" />
                <PolarAngleAxis dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 9 }} />
                <PolarRadiusAxis tick={{ fill: '#52526a', fontSize: 8 }} domain={[0, 100]} />
                {regioes.filter(r => r !== 'Brasil').map((regiao, i) => (
                  <Radar key={regiao} name={regiao} dataKey={regiao} stroke={CHART_COLORS[i]} fill={CHART_COLORS[i]} fillOpacity={0.1} />
                ))}
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-base font-display-gothic">Comparação por Nível de Ensino</CardTitle>
            <CardDescription className="text-zinc-500 text-xs">Grandes Regiões — Taxa de frequência escolar (%)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={regionalComparison} layout="vertical" barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#a1a1aa', fontSize: 10 }} domain={[0, 100]} axisLine={{ stroke: '#3f3f46' }} />
                <YAxis dataKey="name" type="category" tick={{ fill: '#a1a1aa', fontSize: 10 }} axisLine={{ stroke: '#3f3f46' }} width={90} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="Educação Infantil" fill={COLORS.purple} maxBarSize={12} radius={[0, 2, 2, 0]} />
                <Bar dataKey="Ensino Fundamental" fill={COLORS.emerald} maxBarSize={12} radius={[0, 2, 2, 0]} />
                <Bar dataKey="Ensino Médio" fill={COLORS.amber} maxBarSize={12} radius={[0, 2, 2, 0]} />
                <Bar dataKey="Ensino Superior" fill={COLORS.sky} maxBarSize={12} radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* State-level detail */}
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-white text-base font-display-gothic">Detalhamento por Estado</CardTitle>
              <CardDescription className="text-zinc-500 text-xs">Frequência escolar por UF na região selecionada</CardDescription>
            </div>
            <Select value={selectedRegiao} onValueChange={setSelectedRegiao}>
              <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-700 text-white text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(estadosPorRegiao).map(r => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {stateData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stateData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 9 }} axisLine={{ stroke: '#3f3f46' }} />
                <YAxis tick={{ fill: '#a1a1aa', fontSize: 10 }} domain={[0, 100]} axisLine={{ stroke: '#3f3f46' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="0-3 anos" fill={COLORS.purple} maxBarSize={20} radius={[3, 3, 0, 0]} />
                <Bar dataKey="6-14 anos" fill={COLORS.emerald} maxBarSize={20} radius={[3, 3, 0, 0]} />
                <Bar dataKey="15-17 anos" fill={COLORS.amber} maxBarSize={20} radius={[3, 3, 0, 0]} />
                <Bar dataKey="18-24 anos" fill={COLORS.sky} maxBarSize={20} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-zinc-600 text-sm">
              Selecione uma região para ver os estados
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base font-display-gothic">Tabela Completa — Frequência Escolar</CardTitle>
          <CardDescription className="text-zinc-500 text-xs">Taxa bruta por grupo de idade e sexo — Censo 2022</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-2 px-2 text-zinc-400 font-medium" rowSpan={2}>Região</th>
                  <th className="text-center py-2 px-1 text-sky-400 font-medium" colSpan={6}>Homens</th>
                  <th className="text-center py-2 px-1 text-rose-400 font-medium" colSpan={6}>Mulheres</th>
                </tr>
                <tr className="border-b border-zinc-800">
                  {ageGroups.concat(ageGroups).map((g, i) => (
                    <th key={i} className="text-center py-1 px-1 text-zinc-500 font-normal">{g.replace(' anos', '')}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {frequenciaEscolar.filter(d => regioes.includes(d.regiao)).map((row, ri) => (
                  <tr key={ri} className={`border-b border-zinc-900 ${row.regiao === selectedRegiao ? 'bg-zinc-900/50' : 'hover:bg-zinc-900/30'}`}>
                    <td className="py-1.5 px-2 text-white font-medium">{row.regiao}</td>
                    {ageGroupKeys.map(key => (
                      <td key={`h-${key}`} className="text-center py-1.5 px-1 text-zinc-300">{row.homens[key].toFixed(1)}</td>
                    ))}
                    {ageGroupKeys.map(key => (
                      <td key={`m-${key}`} className="text-center py-1.5 px-1 text-zinc-300">{row.mulheres[key].toFixed(1)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --- Occupation Tab - Static data computations ---
const occupationChartData = situacaoOcupacao.map(d => ({
  name: d.regiao,
  'Ocupadas (Total)': Math.round(d.total.ocupadas * 10) / 10,
  'Não Ocupadas (Total)': Math.round(d.total.naoOcupadas * 10) / 10,
  'Ocupadas (Homens)': Math.round(d.homens.ocupadas * 10) / 10,
  'Ocupadas (Mulheres)': Math.round(d.mulheres.ocupadas * 10) / 10,
}));

const brOcupacao = situacaoOcupacao.find(d => d.regiao === 'Brasil');
const occupationPieData = brOcupacao
  ? [
      { name: 'Ocupadas', value: Math.round(brOcupacao.total.ocupadas * 10) / 10, fill: COLORS.emerald },
      { name: 'Não Ocupadas', value: Math.round(brOcupacao.total.naoOcupadas * 10) / 10, fill: COLORS.crimson },
    ]
  : [];

// --- Occupation Tab ---
function OcupacaoTab() {

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Taxa de Ocupação Brasil" value="53,5%" subtitle="Pessoas de 14+ anos" icon={Users} trend="neutral" color={COLORS.emerald} />
        <KPICard title="Homens Ocupados" value="62,9%" subtitle="vs 37,1% não ocupados" icon={TrendingUp} trend="up" color={COLORS.sky} />
        <KPICard title="Mulheres Ocupadas" value="44,9%" subtitle="vs 55,1% não ocupadas" icon={Users} trend="down" color={COLORS.crimson} />
        <KPICard title="Gap de Gênero" value="18,1 p.p." subtitle="Diferença ocupação H-M" icon={Activity} color={COLORS.amber} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main bar chart */}
        <Card className="lg:col-span-2 bg-zinc-950 border-zinc-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-base font-display-gothic">Situação de Ocupação por Região</CardTitle>
            <CardDescription className="text-zinc-500 text-xs">Pessoas de 14+ anos — Censo 2022</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={occupationChartData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 10 }} axisLine={{ stroke: '#3f3f46' }} />
                <YAxis tick={{ fill: '#a1a1aa', fontSize: 10 }} domain={[0, 80]} axisLine={{ stroke: '#3f3f46' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="Ocupadas (Homens)" fill={COLORS.sky} maxBarSize={20} radius={[3, 3, 0, 0]} />
                <Bar dataKey="Ocupadas (Mulheres)" fill={COLORS.crimson} maxBarSize={20} radius={[3, 3, 0, 0]} />
                <Bar dataKey="Não Ocupadas (Total)" fill={COLORS.slate} maxBarSize={20} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie chart */}
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-base font-display-gothic">Ocupação — Brasil</CardTitle>
            <CardDescription className="text-zinc-500 text-xs">Distribuição percentual</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <RechartsPie>
                <Pie data={occupationPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={45} paddingAngle={3} label={({ name, value }) => `${value}%`}>
                  {occupationPieData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </RechartsPie>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {occupationPieData.map((entry, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.fill }} />
                  <span className="text-zinc-400">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Education & Occupation insight */}
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base font-display-gothic">Educação e Ocupação — Análise Cruzada</CardTitle>
          <CardDescription className="text-zinc-500 text-xs">Relação entre frequência escolar e ocupação por região</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {situacaoOcupacao.filter(d => d.regiao !== 'Brasil').map((d, i) => {
              const freqData = frequenciaEscolar.find(f => f.regiao === d.regiao);
              const superiorFreq = freqData ? Math.round((freqData.homens['18a24'] + freqData.mulheres['18a24']) / 2) : 0;
              const ocupacao = Math.round(d.total.ocupadas);
              return (
                <motion.div
                  key={d.regiao}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-zinc-900 rounded-lg p-4 border border-zinc-800"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-medium text-sm">{d.regiao}</span>
                    <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-400">Censo 2022</Badge>
                  </div>
                  <div className="space-y-2.5">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-zinc-500">Freq. Superior (18-24)</span>
                        <span className="text-emerald-400">{superiorFreq}%</span>
                      </div>
                      <Progress value={superiorFreq} className="h-1.5 bg-zinc-800" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-zinc-500">Taxa de Ocupação</span>
                        <span className="text-sky-400">{ocupacao}%</span>
                      </div>
                      <Progress value={ocupacao} className="h-1.5 bg-zinc-800" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-zinc-500">Ocupação Feminina</span>
                        <span className="text-rose-400">{Math.round(d.mulheres.ocupadas)}%</span>
                      </div>
                      <Progress value={Math.round(d.mulheres.ocupadas)} className="h-1.5 bg-zinc-800" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base font-display-gothic">Tabela Completa — Situação de Ocupação</CardTitle>
          <CardDescription className="text-zinc-500 text-xs">Pessoas de 14+ anos por região e sexo — Censo 2022</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-2 px-2 text-zinc-400 font-medium" rowSpan={2}>Região</th>
                  <th className="text-center py-2 px-1 text-emerald-400 font-medium" colSpan={2}>Total</th>
                  <th className="text-center py-2 px-1 text-sky-400 font-medium" colSpan={2}>Homens</th>
                  <th className="text-center py-2 px-1 text-rose-400 font-medium" colSpan={2}>Mulheres</th>
                </tr>
                <tr className="border-b border-zinc-800">
                  {['Ocupadas', 'Não Ocupadas', 'Ocupadas', 'Não Ocupadas', 'Ocupadas', 'Não Ocupadas'].map((h, i) => (
                    <th key={i} className="text-center py-1 px-1 text-zinc-500 font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {situacaoOcupacao.map((row, ri) => (
                  <tr key={ri} className="border-b border-zinc-900 hover:bg-zinc-900/30">
                    <td className="py-1.5 px-2 text-white font-medium">{row.regiao}</td>
                    <td className="text-center py-1.5 px-1 text-zinc-300">{row.total.ocupadas.toFixed(1)}%</td>
                    <td className="text-center py-1.5 px-1 text-zinc-300">{row.total.naoOcupadas.toFixed(1)}%</td>
                    <td className="text-center py-1.5 px-1 text-zinc-300">{row.homens.ocupadas.toFixed(1)}%</td>
                    <td className="text-center py-1.5 px-1 text-zinc-300">{row.homens.naoOcupadas.toFixed(1)}%</td>
                    <td className="text-center py-1.5 px-1 text-zinc-300">{row.mulheres.ocupadas.toFixed(1)}%</td>
                    <td className="text-center py-1.5 px-1 text-zinc-300">{row.mulheres.naoOcupadas.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --- Transport Tab - Static data computations ---
const brTransport = meioTransporte.find(d => d.regiao === 'Brasil');
const transportChartData = brTransport
  ? transportLabels.map((label, i) => ({
      name: label,
      Branca: brTransport.branca[transportKeys[i]],
      'Preta/Parda': brTransport.pretaParda[transportKeys[i]],
      Indígena: brTransport.indigena[transportKeys[i]],
    }))
  : [];

const regionalTransportData = meioTransporte.map(d => ({
  name: d.regiao,
  'A pé (Branca)': d.branca.aPe,
  'A pé (Preta/Parda)': d.pretaParda.aPe,
  'Automóvel (Branca)': d.branca.automovel,
  'Automóvel (Preta/Parda)': d.pretaParda.automovel,
}));

const racialGapData = brTransport
  ? [
      { name: 'A pé', gap: Math.round((brTransport.pretaParda.aPe - brTransport.branca.aPe) * 10) / 10 },
      { name: 'Automóvel', gap: Math.round((brTransport.pretaParda.automovel - brTransport.branca.automovel) * 10) / 10 },
      { name: 'Coletivo', gap: Math.round((brTransport.pretaParda.coletivo - brTransport.branca.coletivo) * 10) / 10 },
      { name: 'Motocicleta', gap: Math.round((brTransport.pretaParda.motocicleta - brTransport.branca.motocicleta) * 10) / 10 },
      { name: 'Bicicleta', gap: Math.round((brTransport.pretaParda.bicicleta - brTransport.branca.bicicleta) * 10) / 10 },
    ]
  : [];

// --- Transport Tab ---
function TransporteTab() {

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Automóvel (Branca)" value="41,8%" subtitle="Principal meio de transporte" icon={Bus} color={COLORS.emerald} />
        <KPICard title="Coletivo (Preta/Parda)" value="34,6%" subtitle="Principal meio de transporte" icon={Bus} color={COLORS.sky} />
        <KPICard title="A pé (Indígena)" value="37,5%" subtitle="Principal meio de transporte" icon={MapPin} color={COLORS.amber} />
        <KPICard title="Desigualdade Racial" value="21,2 p.p." subtitle="Gap automóvel Branca x Preta/Parda" icon={Activity} color={COLORS.crimson} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-base font-display-gothic">Meio de Transporte por Cor/Raça — Brasil</CardTitle>
            <CardDescription className="text-zinc-500 text-xs">Mulheres de 10+ anos ocupadas — Censo 2022</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={transportChartData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 9 }} axisLine={{ stroke: '#3f3f46' }} />
                <YAxis tick={{ fill: '#a1a1aa', fontSize: 10 }} axisLine={{ stroke: '#3f3f46' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="Branca" fill={COLORS.sky} maxBarSize={20} radius={[3, 3, 0, 0]} />
                <Bar dataKey="Preta/Parda" fill={COLORS.crimson} maxBarSize={20} radius={[3, 3, 0, 0]} />
                <Bar dataKey="Indígena" fill={COLORS.amber} maxBarSize={20} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-base font-display-gothic">Gap Racial no Transporte — Brasil</CardTitle>
            <CardDescription className="text-zinc-500 text-xs">Diferença Preta/Parda - Branca (p.p.)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={340}>
              <ComposedChart data={racialGapData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 10 }} axisLine={{ stroke: '#3f3f46' }} />
                <YAxis tick={{ fill: '#a1a1aa', fontSize: 10 }} axisLine={{ stroke: '#3f3f46' }} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={0} stroke="#52526a" />
                <Bar dataKey="gap" name="Gap (p.p.)" radius={[4, 4, 0, 0]} maxBarSize={35}>
                  {racialGapData.map((entry, index) => (
                    <Cell key={index} fill={entry.gap >= 0 ? COLORS.crimson : COLORS.emerald} />
                  ))}
                </Bar>
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Regional comparison */}
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base font-display-gothic">Desigualdade Regional no Acesso a Automóvel</CardTitle>
          <CardDescription className="text-zinc-500 text-xs">% de mulheres ocupadas que usam automóvel por cor/raça e região</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={meioTransporte} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="regiao" tick={{ fill: '#a1a1aa', fontSize: 10 }} axisLine={{ stroke: '#3f3f46' }} />
              <YAxis tick={{ fill: '#a1a1aa', fontSize: 10 }} axisLine={{ stroke: '#3f3f46' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="branca.automovel" name="Branca" fill={COLORS.sky} maxBarSize={25} radius={[3, 3, 0, 0]} />
              <Bar dataKey="pretaParda.automovel" name="Preta/Parda" fill={COLORS.crimson} maxBarSize={25} radius={[3, 3, 0, 0]} />
              <Bar dataKey="indigena.automovel" name="Indígena" fill={COLORS.amber} maxBarSize={25} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base font-display-gothic">Tabela Completa — Meio de Transporte</CardTitle>
          <CardDescription className="text-zinc-500 text-xs">Mulheres de 10+ anos ocupadas por cor/raça e região — Censo 2022</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-2 px-2 text-zinc-400 font-medium" rowSpan={2}>Região</th>
                  <th className="text-center py-2 px-1 text-sky-400 font-medium" colSpan={6}>Branca</th>
                  <th className="text-center py-2 px-1 text-red-400 font-medium" colSpan={6}>Preta/Parda</th>
                  <th className="text-center py-2 px-1 text-amber-400 font-medium" colSpan={6}>Indígena</th>
                </tr>
                <tr className="border-b border-zinc-800">
                  {transportLabels.concat(transportLabels).concat(transportLabels).map((l, i) => (
                    <th key={i} className="text-center py-1 px-1 text-zinc-500 font-normal">{l}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {meioTransporte.map((row, ri) => (
                  <tr key={ri} className="border-b border-zinc-900 hover:bg-zinc-900/30">
                    <td className="py-1.5 px-2 text-white font-medium">{row.regiao}</td>
                    {transportKeys.map(key => (
                      <td key={`b-${key}`} className="text-center py-1.5 px-1 text-zinc-300">{row.branca[key].toFixed(1)}</td>
                    ))}
                    {transportKeys.map(key => (
                      <td key={`p-${key}`} className="text-center py-1.5 px-1 text-zinc-300">{row.pretaParda[key].toFixed(1)}</td>
                    ))}
                    {transportKeys.map(key => (
                      <td key={`i-${key}`} className="text-center py-1.5 px-1 text-zinc-300">{row.indigena[key].toFixed(1)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --- Local de Trabalho Tab - Static data computations ---
const localChartData = localTrabalho.map(d => ({
  name: d.regiao,
  'No domicílio': Math.round(d.total.noDomicilio * 10) / 10,
  'Fora do domicílio': Math.round(d.total.foraDomicilio * 10) / 10,
  'Outro município': Math.round(d.total.outroMunicipio * 10) / 10,
}));

const workFromHomeData = localTrabalho.map(d => ({
  name: d.regiao,
  'Total': Math.round(d.total.noDomicilio * 10) / 10,
  'Homens': Math.round(d.homens.noDomicilio * 10) / 10,
  'Mulheres': Math.round(d.mulheres.noDomicilio * 10) / 10,
}));

// --- Local de Trabalho Tab ---
function LocalTrabalhoTab() {

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Trabalho no Domicílio" value="16,6%" subtitle="Brasil — Total" icon={MapPin} color={COLORS.purple} />
        <KPICard title="Trabalho Fora do Domicílio" value="69,9%" subtitle="Brasil — Total" icon={Globe} color={COLORS.emerald} />
        <KPICard title="Trabalho Outro Município" value="10,5%" subtitle="Brasil — Total" icon={MapPin} color={COLORS.amber} />
        <KPICard title="Home Office Feminino" value="18,9%" subtitle="vs 14,8% masculino" icon={Users} trend="up" color={COLORS.crimson} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-base font-display-gothic">Local de Trabalho por Região</CardTitle>
            <CardDescription className="text-zinc-500 text-xs">Pessoas de 10+ anos ocupadas — Censo 2022</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={localChartData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 10 }} axisLine={{ stroke: '#3f3f46' }} />
                <YAxis tick={{ fill: '#a1a1aa', fontSize: 10 }} domain={[0, 80]} axisLine={{ stroke: '#3f3f46' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="No domicílio" fill={COLORS.purple} maxBarSize={20} radius={[3, 3, 0, 0]} stackId="a" />
                <Bar dataKey="Fora do domicílio" fill={COLORS.emerald} maxBarSize={20} radius={[3, 3, 0, 0]} stackId="a" />
                <Bar dataKey="Outro município" fill={COLORS.amber} maxBarSize={20} radius={[3, 3, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-base font-display-gothic">Home Office por Gênero e Região</CardTitle>
            <CardDescription className="text-zinc-500 text-xs">Trabalho no domicílio de residência (%)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={workFromHomeData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 10 }} axisLine={{ stroke: '#3f3f46' }} />
                <YAxis tick={{ fill: '#a1a1aa', fontSize: 10 }} axisLine={{ stroke: '#3f3f46' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="Homens" fill={COLORS.sky} maxBarSize={20} radius={[3, 3, 0, 0]} />
                <Bar dataKey="Mulheres" fill={COLORS.crimson} maxBarSize={20} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card className="bg-zinc-950 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-base font-display-gothic">Tabela Completa — Local de Trabalho</CardTitle>
          <CardDescription className="text-zinc-500 text-xs">Pessoas de 10+ anos ocupadas por região e sexo — Censo 2022</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-2 px-2 text-zinc-400 font-medium" rowSpan={2}>Região</th>
                  <th className="text-center py-2 px-1 text-purple-400 font-medium" colSpan={3}>Total</th>
                  <th className="text-center py-2 px-1 text-sky-400 font-medium" colSpan={3}>Homens</th>
                  <th className="text-center py-2 px-1 text-rose-400 font-medium" colSpan={3}>Mulheres</th>
                </tr>
                <tr className="border-b border-zinc-800">
                  {['No domicílio', 'Fora domicílio', 'Outro município', 'No domicílio', 'Fora domicílio', 'Outro município', 'No domicílio', 'Fora domicílio', 'Outro município'].map((h, i) => (
                    <th key={i} className="text-center py-1 px-1 text-zinc-500 font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {localTrabalho.map((row, ri) => (
                  <tr key={ri} className="border-b border-zinc-900 hover:bg-zinc-900/30">
                    <td className="py-1.5 px-2 text-white font-medium">{row.regiao}</td>
                    <td className="text-center py-1.5 px-1 text-zinc-300">{row.total.noDomicilio.toFixed(1)}</td>
                    <td className="text-center py-1.5 px-1 text-zinc-300">{row.total.foraDomicilio.toFixed(1)}</td>
                    <td className="text-center py-1.5 px-1 text-zinc-300">{row.total.outroMunicipio.toFixed(1)}</td>
                    <td className="text-center py-1.5 px-1 text-zinc-300">{row.homens.noDomicilio.toFixed(1)}</td>
                    <td className="text-center py-1.5 px-1 text-zinc-300">{row.homens.foraDomicilio.toFixed(1)}</td>
                    <td className="text-center py-1.5 px-1 text-zinc-300">{row.homens.outroMunicipio.toFixed(1)}</td>
                    <td className="text-center py-1.5 px-1 text-zinc-300">{row.mulheres.noDomicilio.toFixed(1)}</td>
                    <td className="text-center py-1.5 px-1 text-zinc-300">{row.mulheres.foraDomicilio.toFixed(1)}</td>
                    <td className="text-center py-1.5 px-1 text-zinc-300">{row.mulheres.outroMunicipio.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --- Main Page ---
export default function Home() {
  const [activeTab, setActiveTab] = useState('educacao');

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-red-700 to-red-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">IBGE</span>
              </div>
              <div>
                <h1 className="text-sm font-semibold text-white tracking-wide font-display-gothic">Portal IBGE</h1>
                <p className="text-[10px] text-zinc-500 -mt-0.5">Dados do Censo 2022 — Educação & Sociedade</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-400 gap-1">
                <Activity className="w-2.5 h-2.5" />
                Censo 2022
              </Badge>
              <Badge variant="outline" className="text-[10px] border-emerald-900 text-emerald-400 gap-1">
                <Globe className="w-2.5 h-2.5" />
                SIDRA
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-zinc-950 to-zinc-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-900/10 rounded-full blur-[120px]" />
        <div className="absolute top-10 right-1/4 w-[300px] h-[200px] bg-purple-900/10 rounded-full blur-[80px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-display-gothic">
              Educação & Sociedade
            </h2>
            <p className="text-zinc-400 mt-2 max-w-2xl text-sm leading-relaxed">
              Análise interativa dos dados do <span className="text-white font-medium">Censo Demográfico 2022</span> do IBGE,
              com foco na frequência escolar, situação de ocupação, meio de transporte e local de trabalho.
              Fonte: <span className="text-red-400">SIDRA/IBGE</span> — Tabelas 10056, 10253, 10329 e 8424.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-zinc-900 border border-zinc-800 p-1 h-auto gap-1">
            <TabsTrigger
              value="educacao"
              className="data-[state=active]:bg-red-900/30 data-[state=active]:text-red-300 data-[state=active]:border-red-800 text-zinc-400 text-xs px-4 py-2 border border-transparent rounded-md transition-all"
            >
              <GraduationCap className="w-3.5 h-3.5 mr-1.5" />
              Frequência Escolar
            </TabsTrigger>
            <TabsTrigger
              value="ocupacao"
              className="data-[state=active]:bg-sky-900/30 data-[state=active]:text-sky-300 data-[state=active]:border-sky-800 text-zinc-400 text-xs px-4 py-2 border border-transparent rounded-md transition-all"
            >
              <Users className="w-3.5 h-3.5 mr-1.5" />
              Ocupação
            </TabsTrigger>
            <TabsTrigger
              value="transporte"
              className="data-[state=active]:bg-amber-900/30 data-[state=active]:text-amber-300 data-[state=active]:border-amber-800 text-zinc-400 text-xs px-4 py-2 border border-transparent rounded-md transition-all"
            >
              <Bus className="w-3.5 h-3.5 mr-1.5" />
              Transporte
            </TabsTrigger>
            <TabsTrigger
              value="local"
              className="data-[state=active]:bg-purple-900/30 data-[state=active]:text-purple-300 data-[state=active]:border-purple-800 text-zinc-400 text-xs px-4 py-2 border border-transparent rounded-md transition-all"
            >
              <MapPin className="w-3.5 h-3.5 mr-1.5" />
              Local de Trabalho
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'educacao' && <EducacaoTab />}
              {activeTab === 'ocupacao' && <OcupacaoTab />}
              {activeTab === 'transporte' && <TransporteTab />}
              {activeTab === 'local' && <LocalTrabalhoTab />}
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-red-700 to-red-900 rounded flex items-center justify-center">
                <span className="text-white font-bold text-[8px]">IBGE</span>
              </div>
              <span className="text-xs text-zinc-500">
                Dados extraídos do SIDRA/IBGE — Censo Demográfico 2022
              </span>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-zinc-600">
              <span>Tabela 10056 — Frequência Escolar</span>
              <span>Tabela 10253 — Ocupação</span>
              <span>Tabela 10329 — Local de Trabalho</span>
              <span>Tabela 8424 — Transporte</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
