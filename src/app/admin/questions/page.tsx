'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, RefreshCw, ToggleLeft, ToggleRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase';

interface Question {
  id: string;
  pergunta: string;
  opcao_a: string;
  opcao_b: string;
  opcao_c: string;
  opcao_d: string;
  resposta_correta: 'A' | 'B' | 'C' | 'D';
  pontos: number;
  dificuldade: 'FACIL' | 'MEDIO' | 'DIFICIL';
  categoria: string;
  explicacao: string | null;
  ativo: boolean;
  created_at: string;
}

interface FormState {
  pergunta: string;
  opcao_a: string;
  opcao_b: string;
  opcao_c: string;
  opcao_d: string;
  resposta_correta: string;
  pontos: string;
  dificuldade: string;
  categoria: string;
  explicacao: string;
}

const emptyForm: FormState = {
  pergunta: '',
  opcao_a: '',
  opcao_b: '',
  opcao_c: '',
  opcao_d: '',
  resposta_correta: 'A',
  pontos: '10',
  dificuldade: 'MEDIO',
  categoria: '',
  explicacao: '',
};

export default function AdminQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategoria, setFilterCategoria] = useState('all');
  const [filterDificuldade, setFilterDificuldade] = useState('all');
  const [filterAtivo, setFilterAtivo] = useState('all');
  const [categorias, setCategorias] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('tb_quiz_questions').select('*').order('created_at', { ascending: false });
    if (filterCategoria !== 'all') query = query.eq('categoria', filterCategoria);
    if (filterDificuldade !== 'all') query = query.eq('dificuldade', filterDificuldade);
    if (filterAtivo !== 'all') query = query.eq('ativo', filterAtivo === 'true');
    const { data, error } = await query;
    if (!error && data) setQuestions(data as Question[]);
    setLoading(false);
  }, [filterCategoria, filterDificuldade, filterAtivo]);

  const loadCategorias = async () => {
    const { data } = await supabase.from('tb_quiz_questions').select('categoria');
    if (data) {
      const unique = [...new Set(data.map((d: any) => d.categoria).filter(Boolean))];
      setCategorias(unique.sort());
    }
  };

  useEffect(() => {
    loadCategorias();
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (q: Question) => {
    setEditingId(q.id);
    setForm({
      pergunta: q.pergunta,
      opcao_a: q.opcao_a,
      opcao_b: q.opcao_b,
      opcao_c: q.opcao_c,
      opcao_d: q.opcao_d,
      resposta_correta: q.resposta_correta,
      pontos: String(q.pontos),
      dificuldade: q.dificuldade,
      categoria: q.categoria,
      explicacao: q.explicacao || '',
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.pergunta || !form.opcao_a || !form.opcao_b || !form.opcao_c || !form.opcao_d || !form.categoria) return;
    setSaving(true);
    const payload = {
      pergunta: form.pergunta,
      opcao_a: form.opcao_a,
      opcao_b: form.opcao_b,
      opcao_c: form.opcao_c,
      opcao_d: form.opcao_d,
      resposta_correta: form.resposta_correta,
      pontos: parseInt(form.pontos) || 10,
      dificuldade: form.dificuldade as 'FACIL' | 'MEDIO' | 'DIFICIL',
      categoria: form.categoria,
      explicacao: form.explicacao || null,
    };

    if (editingId) {
      await supabase.from('tb_quiz_questions').update(payload).eq('id', editingId);
    } else {
      await supabase.from('tb_quiz_questions').insert({ ...payload, ativo: true });
    }

    setShowForm(false);
    setSaving(false);
    await loadQuestions();
    await loadCategorias();
  };

  const toggleAtivo = async (q: Question) => {
    await supabase.from('tb_quiz_questions').update({ ativo: !q.ativo }).eq('id', q.id);
    await loadQuestions();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Excluir esta questão? Esta ação é irreversível.')) return;
    await supabase.from('tb_quiz_questions').delete().eq('id', id);
    await loadQuestions();
  };

  const updateForm = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const dificuldadeColor = (d: string) => {
    switch (d) {
      case 'FACIL': return 'border-emerald-800 bg-emerald-950/30 text-emerald-300';
      case 'MEDIO': return 'border-amber-800 bg-amber-950/30 text-amber-300';
      case 'DIFICIL': return 'border-red-800 bg-red-950/30 text-red-300';
      default: return 'border-input text-muted-foreground';
    }
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
          <h1 className="text-2xl font-display-gothic text-foreground">Questões</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerenciamento de questões do quiz</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadQuestions}
            className="border-input text-muted-foreground hover:text-foreground hover:border-ring"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button
            size="sm"
            onClick={openAdd}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Questão
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
          <SelectTrigger className="w-48 bg-card border-border text-foreground">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all" className="text-muted-foreground">Todas Categorias</SelectItem>
            {categorias.map((c) => (
              <SelectItem key={c} value={c} className="text-foreground">{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterDificuldade} onValueChange={setFilterDificuldade}>
          <SelectTrigger className="w-40 bg-card border-border text-foreground">
            <SelectValue placeholder="Dificuldade" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all" className="text-muted-foreground">Todas</SelectItem>
            <SelectItem value="FACIL" className="text-foreground">Fácil</SelectItem>
            <SelectItem value="MEDIO" className="text-foreground">Médio</SelectItem>
            <SelectItem value="DIFICIL" className="text-foreground">Difícil</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterAtivo} onValueChange={setFilterAtivo}>
          <SelectTrigger className="w-36 bg-card border-border text-foreground">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all" className="text-muted-foreground">Todos</SelectItem>
            <SelectItem value="true" className="text-foreground">Ativo</SelectItem>
            <SelectItem value="false" className="text-foreground">Inativo</SelectItem>
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
              className="bg-card border border-border rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-display-gothic text-foreground">
                  {editingId ? 'Editar Questão' : 'Nova Questão'}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowForm(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Pergunta *</Label>
                  <Textarea
                    value={form.pergunta}
                    onChange={(e) => updateForm('pergunta', e.target.value)}
                    className="bg-secondary border-input text-foreground mt-1 min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground text-xs">Opção A *</Label>
                    <Input
                      value={form.opcao_a}
                      onChange={(e) => updateForm('opcao_a', e.target.value)}
                      className="bg-secondary border-input text-foreground mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Opção B *</Label>
                    <Input
                      value={form.opcao_b}
                      onChange={(e) => updateForm('opcao_b', e.target.value)}
                      className="bg-secondary border-input text-foreground mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Opção C *</Label>
                    <Input
                      value={form.opcao_c}
                      onChange={(e) => updateForm('opcao_c', e.target.value)}
                      className="bg-secondary border-input text-foreground mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Opção D *</Label>
                    <Input
                      value={form.opcao_d}
                      onChange={(e) => updateForm('opcao_d', e.target.value)}
                      className="bg-secondary border-input text-foreground mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-muted-foreground text-xs">Resposta Correta *</Label>
                    <Select value={form.resposta_correta} onValueChange={(v) => updateForm('resposta_correta', v)}>
                      <SelectTrigger className="bg-secondary border-input text-foreground mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="A" className="text-foreground">A</SelectItem>
                        <SelectItem value="B" className="text-foreground">B</SelectItem>
                        <SelectItem value="C" className="text-foreground">C</SelectItem>
                        <SelectItem value="D" className="text-foreground">D</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Pontos</Label>
                    <Input
                      type="number"
                      value={form.pontos}
                      onChange={(e) => updateForm('pontos', e.target.value)}
                      className="bg-secondary border-input text-foreground mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Dificuldade *</Label>
                    <Select value={form.dificuldade} onValueChange={(v) => updateForm('dificuldade', v)}>
                      <SelectTrigger className="bg-secondary border-input text-foreground mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="FACIL" className="text-foreground">Fácil</SelectItem>
                        <SelectItem value="MEDIO" className="text-foreground">Médio</SelectItem>
                        <SelectItem value="DIFICIL" className="text-foreground">Difícil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-muted-foreground text-xs">Categoria *</Label>
                  <Input
                    value={form.categoria}
                    onChange={(e) => updateForm('categoria', e.target.value)}
                    className="bg-secondary border-input text-foreground mt-1"
                  />
                </div>

                <div>
                  <Label className="text-muted-foreground text-xs">Explicação</Label>
                  <Textarea
                    value={form.explicacao}
                    onChange={(e) => updateForm('explicacao', e.target.value)}
                    className="bg-secondary border-input text-foreground mt-1 min-h-[60px]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="border-input text-muted-foreground"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {saving ? 'Salvando...' : editingId ? 'Salvar Alterações' : 'Criar Questão'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-card border-border shadow-gothic-card">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-muted-foreground font-medium">Pergunta</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">Categoria</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">Dificuldade</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">Pontos</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">Ativo</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="border-b border-border/50">
                        {[...Array(6)].map((_, j) => (
                          <td key={j} className="p-4">
                            <div className="h-4 bg-secondary rounded animate-pulse w-20" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : questions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        Nenhuma questão encontrada.
                      </td>
                    </tr>
                  ) : (
                    questions.map((q) => (
                      <tr
                        key={q.id}
                        className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                      >
                        <td className="p-4 text-foreground max-w-[280px] truncate">{q.pergunta}</td>
                        <td className="p-4">
                          <Badge variant="outline" className="border-input text-muted-foreground text-xs">
                            {q.categoria}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className={`text-xs ${dificuldadeColor(q.dificuldade)}`}>
                            {q.dificuldade}
                          </Badge>
                        </td>
                        <td className="p-4 text-foreground font-medium">{q.pontos}</td>
                        <td className="p-4">
                          <Badge
                            variant="outline"
                            className={
                              q.ativo
                                ? 'border-emerald-800 bg-emerald-950/30 text-emerald-300 text-xs'
                                : 'border-input bg-secondary text-muted-foreground text-xs'
                            }
                          >
                            {q.ativo ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-muted-foreground hover:text-amber-400 hover:bg-secondary"
                              onClick={() => openEdit(q)}
                              title="Editar"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-muted-foreground hover:text-emerald-400 hover:bg-secondary"
                              onClick={() => toggleAtivo(q)}
                              title={q.ativo ? 'Desativar' : 'Ativar'}
                            >
                              {q.ativo ? (
                                <ToggleRight className="h-4 w-4" />
                              ) : (
                                <ToggleLeft className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-secondary"
                              onClick={() => handleDelete(q.id)}
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
