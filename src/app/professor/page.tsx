'use client';

import { useState } from 'react';
import { gerarExercicios, TipoExercicio } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';
import { Play, Loader2, AlertCircle, CheckCircle, Brain, Puzzle, HelpCircle } from 'lucide-react';

export default function PainelProfessor() {
  // Estados para o formulário
  const [tipo, setTipo] = useState<TipoExercicio>('lacuna');
  const [tema, setTema] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [dificuldade, setDificuldade] = useState('facil');

  // Estados de controle da requisição
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);
  const [exerciciosGerados, setExerciciosGerados] = useState<any[]>([]);

  // Novos estados para publicação
  const [salvando, setSalvando] = useState(false);
  const [salvoComSucesso, setSalvoComSucesso] = useState(false);

  const handleGerar = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tema.trim()) {
      setErro('Por favor, insira um tema para os exercícios.');
      return;
    }

    setCarregando(true);
    setErro(null);
    setSucesso(false);
    setSalvoComSucesso(false);
    setExerciciosGerados([]);

    try {
      const resultado = await gerarExercicios(tipo, tema, quantidade, dificuldade);

      if (resultado.erro) {
        setErro(resultado.erro);
      } else {
        setExerciciosGerados(resultado.exercicios);
        setSucesso(true);
      }
    } catch (err) {
      setErro('Ocorreu um erro inesperado ao tentar gerar os exercícios.');
    } finally {
      setCarregando(false);
    }
  };

  const handlePublicar = async () => {
    if (exerciciosGerados.length === 0) return;
    setSalvando(true);
    setErro(null);
    setSalvoComSucesso(false);

    try {
      const inserts = exerciciosGerados.map((exercicio) => ({
        tipo: tipo,
        dados: exercicio,
        criado_por: 'Professor IA',
        turma: 'Geral',
        ativo: true,
      }));

      const { error } = await supabase.from('exercicios_custom').insert(inserts);

      if (error) throw error;

      setSalvoComSucesso(true);
      setSucesso(false); // limpa o sucesso de geração para focar no de publicação
      setExerciciosGerados([]); // limpa a lista após publicar
    } catch (err: any) {
      setErro('Erro ao publicar os exercícios no Supabase: ' + err.message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <header className="border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Painel do Professor — Portugol Games
          </h1>
          <p className="text-slate-400 mt-2">
            Gere novos exercícios customizados utilizando Inteligência Artificial para os seus alunos.
          </p>
        </header>

        {/* Formulário de Configuração */}
        <section className="bg-slate-800/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
          <form onSubmit={handleGerar} className="space-y-6">
            
            {/* Tipo de Exercício */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Tipo de Exercício
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setTipo('lacuna')}
                  className={`flex items-center gap-3 p-4 rounded-lg border transition-all text-left ${
                    tipo === 'lacuna'
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <Brain className="w-5 h-5" />
                  <div>
                    <p className="font-semibold text-sm">Código com Lacunas</p>
                    <p className="text-xs text-slate-400">Preencher espaços em branco</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTipo('puzzle')}
                  className={`flex items-center gap-3 p-4 rounded-lg border transition-all text-left ${
                    tipo === 'puzzle'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                      : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <Puzzle className="w-5 h-5" />
                  <div>
                    <p className="font-semibold text-sm">Quebra-Cabeça</p>
                    <p className="text-xs text-slate-400">Arrastar blocos ordenados</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTipo('quiz')}
                  className={`flex items-center gap-3 p-4 rounded-lg border transition-all text-left ${
                    tipo === 'quiz'
                      ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                      : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <HelpCircle className="w-5 h-5" />
                  <div>
                    <p className="font-semibold text-sm">Quiz de Múltipla Escolha</p>
                    <p className="text-xs text-slate-400">Perguntas conceituais clássicas</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Tema do Exercício */}
            <div>
              <label htmlFor="tema" className="block text-sm font-medium text-slate-300 mb-2">
                Tema / Conteúdo Pedagógico
              </label>
              <input
                id="tema"
                type="text"
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                placeholder="Ex: Laço Enquanto, Vetores, Operadores Lógicos, Condicional Se..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Quantidade e Dificuldade */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="quantidade" className="block text-sm font-medium text-slate-300 mb-2">
                  Quantidade de Exercícios
                </label>
                <input
                  id="quantidade"
                  type="number"
                  min={1}
                  max={5}
                  value={quantidade}
                  onChange={(e) => setQuantidade(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="dificuldade" className="block text-sm font-medium text-slate-300 mb-2">
                  Nível de Dificuldade
                </label>
                <select
                  id="dificuldade"
                  value={dificuldade}
                  onChange={(e) => setDificuldade(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                >
                  <option value="facil">Fácil (Iniciante)</option>
                  <option value="medio">Médio (Intermediário)</option>
                  <option value="dificil">Difícil (Avançado)</option>
                </select>
              </div>
            </div>

            {/* Botão de Envio */}
            <button
              type="submit"
              disabled={carregando}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 text-white font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 border border-blue-400/20 shadow-lg shadow-blue-500/10 cursor-pointer disabled:cursor-not-allowed"
            >
              {carregando ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                  <span>Processando IA (com Exponential Backoff)...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Gerar Exercícios com Gemini</span>
                </>
              )}
            </button>
          </form>
        </section>

        {/* Feedback de Erro */}
        {erro && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4 flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm space-y-1">
              <p className="font-semibold">Não foi possível completar a geração</p>
              <p className="text-slate-300 whitespace-pre-line">{erro}</p>
            </div>
          </div>
        )}

        {/* Feedback de Sucesso na Geração */}
        {sucesso && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg p-4 flex gap-3 items-center">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">
              Exercício(s) criado(s) com sucesso e formatado(s) perfeitamente! Revise abaixo e clique em publicar.
            </p>
          </div>
        )}

        {/* Feedback de Salvamento no Banco */}
        {salvoComSucesso && (
          <div className="bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg p-4 flex gap-3 items-center animate-fade-in">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">
              🎉 Exercício(s) publicado(s) com sucesso no banco de dados! Eles já estão disponíveis para todos os alunos jogarem!
            </p>
          </div>
        )}

        {/* Visualização dos dados gerados com botão de publicação */}
        {exerciciosGerados.length > 0 && (
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-xl font-bold text-slate-200">Resultado Gerado pela IA</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Revise o formato JSON das questões geradas antes de publicar para os alunos.
                </p>
              </div>
              <button
                type="button"
                onClick={handlePublicar}
                disabled={salvando}
                className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:from-slate-850 disabled:to-slate-850 disabled:text-slate-600 text-white font-semibold py-2.5 px-6 rounded-lg transition-all flex items-center justify-center gap-2 border border-emerald-400/20 shadow-lg shadow-emerald-500/10 cursor-pointer disabled:cursor-not-allowed text-sm"
              >
                {salvando ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>Publicando no Banco...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Publicar Exercícios</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 overflow-x-auto">
              <pre className="text-xs text-emerald-400 font-mono">
                {JSON.stringify(exerciciosGerados, null, 2)}
              </pre>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}