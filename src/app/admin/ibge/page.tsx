'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase';

interface IbgeRow {
  id: string;
  indicador: string;
  descricao: string | null;
  ano: number;
  regiao: string;
  uf: string | null;
  valor: number;
  unidade: string | null;
  categoria: string;
  subcategoria: string | null;
}

interface FormState {
  indicador: string;
  descricao: string;
  ano: string;
  regiao: string;
  uf: string;
  valor: string;
  unidade: string;
  categoria: string;
  subcategoria: string;
}

const emptyForm: FormState = {
  indicador: '',
  descricao: '',
  ano: '',
  regiao: '',
  uf: '',
  valor: '',
  unidade: '',
  categoria: '',
  subcategoria: '',
};

export default function AdminIbge() {
  const [data, setData] = useState<IbgeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategoria, setFilterCategoria] = useState('all');
  const [filterRegiao, setFilterRegiao] = useState('all');
  const [categorias, setCategorias] = useState<string[]>([]);
  const [regioes, setRegioes] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('tb_ibge_data').select('*').order('ano', { ascending: false }).limit(50);
    if (filterCategoria !== 'all') query = query.eq('categoria', filterCategoria);
    if (filterRegiao !== 'all') query = query.eq('regiao', filterRegiao);
    const { data: rows, error } = await query;
    if (!error && rows) setData(rows as IbgeRow[]);
    setLoading(false);
  }, [filterCategoria, filterRegiao]);

  const loadFilters = async () => {
    const [catRes, regRes] = await Promise.all([
      supabase.from('tb_ibge_data').select('categoria'),
      supabase.from('tb_ibge_data').select('regiao'),
    ]);
    if (catRes.data) {
      const unique = [...new Set(catRes.data.map((d: any) => d.categoria).filter(Boolean))];
      setCategorias(unique.sort());
    }
    if (regRes.data) {
      const unique = [...new Set(regRes.data.map((d: any) => d.regiao).filter(Boolean))];
      setRegioes(unique.sort());
    }
  };

  useEffect(() => {
    loadFilters();
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (row: IbgeRow) => {
    setEditingId(row.id);
    setForm({
      indicador: row.indicador,
      descricao: row.descricao || '',
      ano: String(row.ano),
      regiao: row.regiao,
      uf: row.uf || '',
      valor: String(row.valor),
      unidade: row.unidade || '',
      categoria: row.categoria,
      subcategoria: row.subcategoria || '',
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.indicador || !form.ano || !form.regiao || !form.valor || !form.categoria) return;
    setSaving(true);
    const payload = {
      indicador: form.indicador,
      descricao: form.descricao || null,
      ano: parseInt(form.ano),
      regiao: form.regiao,
      uf: form.uf || null,
      valor: parseFloat(form.valor),
      unidade: form.unidade || null,
      categoria: form.categoria,
      subcategoria: form.subcategoria || null,
    };

    if (editingId) {
      await supabase.from('tb_ibge_data').update(payload).eq('id', editingId);
    } else {
      await supabase.from('tb_ibge_data').insert(payload);
    }

    setShowForm(false);
    setSaving(false);
    await loadData();
    await loadFilters();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Excluir este registro? Esta ação é irreversível.')) return;
    await supabase.from('tb_ibge_data').delete().eq('id', id);
    await loadData();
  };

  const updateForm = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-display-gothic text-white">Banco IBGE</h1>
          <p className="text-sm text-zinc-500 mt-1">Gerenciamento de dados IBGE</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            className="border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button
            size="sm"
            onClick={openAdd}
            className="bg-red-900 hover:bg-red-800 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Dado
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-wrap gap-3"
      >
        <Select value={filterCategoria} onValueChange={setFilterCategoria}>
          <SelectTrigger className="w-48 bg-zinc-900 border-zinc-800 text-white">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            <SelectItem value="all" className="text-zinc-400">Todas Categorias</SelectItem>
            {categorias.map((c) => (
              <SelectItem key={c} value={c} className="text-white">{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterRegiao} onValueChange={setFilterRegiao}>
          <SelectTrigger className="w-48 bg-zinc-900 border-zinc-800 text-white">
            <SelectValue placeholder="Região" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            <SelectItem value="all" className="text-zinc-400">Todas Regiões</SelectItem>
            {regioes.map((r) => (
              <SelectItem key={r} value={r} className="text-white">{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-display-gothic text-white">
                  {editingId ? 'Editar Dado' : 'Novo Dado IBGE'}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowForm(false)}
                  className="text-zinc-500 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label className="text-zinc-400 text-xs">Indicador *</Label>
                  <Input
                    value={form.indicador}
                    onChange={(e) => updateForm('indicador', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-zinc-400 text-xs">Descrição</Label>
                  <Input
                    value={form.descricao}
                    onChange={(e) => updateForm('descricao', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  />
                </div>
                <div>
                  <Label className="text-zinc-400 text-xs">Ano *</Label>
                  <Input
                    type="number"
                    value={form.ano}
                    onChange={(e) => updateForm('ano', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  />
                </div>
                <div>
                  <Label className="text-zinc-400 text-xs">Região *</Label>
                  <Input
                    value={form.regiao}
                    onChange={(e) => updateForm('regiao', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  />
                </div>
                <div>
                  <Label className="text-zinc-400 text-xs">UF</Label>
                  <Input
                    value={form.uf}
                    onChange={(e) => updateForm('uf', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  />
                </div>
                <div>
                  <Label className="text-zinc-400 text-xs">Valor *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={form.valor}
                    onChange={(e) => updateForm('valor', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  />
                </div>
                <div>
                  <Label className="text-zinc-400 text-xs">Unidade</Label>
                  <Input
                    value={form.unidade}
                    onChange={(e) => updateForm('unidade', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  />
                </div>
                <div>
                  <Label className="text-zinc-400 text-xs">Categoria *</Label>
                  <Input
                    value={form.categoria}
                    onChange={(e) => updateForm('categoria', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  />
                </div>
                <div>
                  <Label className="text-zinc-400 text-xs">Subcategoria</Label>
                  <Input
                    value={form.subcategoria}
                    onChange={(e) => updateForm('subcategoria', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="border-zinc-700 text-zinc-400"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-red-900 hover:bg-red-800 text-white"
                >
                  {saving ? 'Salvando...' : editingId ? 'Salvar Alterações' : 'Criar Registro'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Data Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-zinc-900 border-zinc-800 shadow-gothic-card">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left p-4 text-zinc-500 font-medium">Indicador</th>
                    <th className="text-left p-4 text-zinc-500 font-medium">Ano</th>
                    <th className="text-left p-4 text-zinc-500 font-medium">Região</th>
                    <th className="text-left p-4 text-zinc-500 font-medium">Valor</th>
                    <th className="text-left p-4 text-zinc-500 font-medium">Unidade</th>
                    <th className="text-left p-4 text-zinc-500 font-medium">Categoria</th>
                    <th className="text-left p-4 text-zinc-500 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="border-b border-zinc-800/50">
                        {[...Array(7)].map((_, j) => (
                          <td key={j} className="p-4">
                            <div className="h-4 bg-zinc-800 rounded animate-pulse w-20" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-zinc-500">
                        Nenhum dado encontrado.
                      </td>
                    </tr>
                  ) : (
                    data.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                      >
                        <td className="p-4 text-white max-w-[200px] truncate">{row.indicador}</td>
                        <td className="p-4 text-zinc-400">{row.ano}</td>
                        <td className="p-4 text-zinc-400">{row.regiao}</td>
                        <td className="p-4 text-white font-medium">
                          {typeof row.valor === 'number' ? row.valor.toLocaleString('pt-BR') : row.valor}
                        </td>
                        <td className="p-4 text-zinc-500">{row.unidade || '—'}</td>
                        <td className="p-4">
                          <Badge variant="outline" className="border-zinc-700 text-zinc-400 text-xs">
                            {row.categoria}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-zinc-500 hover:text-amber-400 hover:bg-zinc-800"
                              onClick={() => openEdit(row)}
                              title="Editar"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-zinc-800"
                              onClick={() => handleDelete(row.id)}
                              title="Excluir"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
