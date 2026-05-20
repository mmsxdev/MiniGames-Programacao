'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Gamepad2, Code, Trophy, Sparkles } from 'lucide-react';
import { criarPerfil, validarNome, validarTurma, getPerfil, buscarPerfilSupabase, salvarPerfil } from '@/lib/storage';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [turma, setTurma] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const perfil = getPerfil();
    if (perfil) router.push('/menu');
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarNome(nome)) { setError('Nome deve ter pelo menos 3 caracteres.'); return; }
    if (!validarTurma(turma)) { setError('Informe sua turma/sala.'); return; }
    
    setLoading(true);
    setError('');
    setStatusMessage('Verificando seu cadastro...');

    try {
      // Busca se o aluno já tem cadastro no Supabase com este nome e turma
      const perfilExistente = await buscarPerfilSupabase(nome, turma);
      
      if (perfilExistente) {
        setStatusMessage('Seja bem-vindo de volta! Carregando seu progresso...');
        salvarPerfil(perfilExistente);
      } else {
        setStatusMessage('Criando seu perfil e iniciando jornada...');
        criarPerfil(nome, turma);
      }
      
      router.push('/menu');
    } catch (err) {
      console.error(err);
      // Fallback offline caso o Supabase falhe ou esteja fora
      criarPerfil(nome, turma);
      router.push('/menu');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <Code size={24} />, title: 'Código com Lacunas', desc: 'Preencha os espaços em branco no código' },
    { icon: <Gamepad2 size={24} />, title: 'Quebra-Cabeça', desc: 'Arraste blocos para montar o programa' },
    { icon: <Trophy size={24} />, title: 'Quiz Interativo', desc: 'Teste seus conhecimentos com perguntas' },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      <header className="flex justify-end p-4"><ThemeToggle /></header>
      <main className="flex-1 flex items-center justify-center px-4 pb-8">
        <div className="max-w-lg w-full">
          <motion.div className="text-center mb-8" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
            <motion.div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }} animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
              <Sparkles size={40} color="white" />
            </motion.div>
            <h1 className="text-4xl font-black mb-2" style={{ background: 'linear-gradient(135deg, var(--primary-light), var(--accent-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Portugol Games
            </h1>
            <p style={{ color: 'var(--text-secondary)' }} className="text-lg">Aprenda programação jogando! 🎮</p>
          </motion.div>

          <motion.div className="card" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} style={{ cursor: 'default' }} onMouseEnter={undefined}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Nome completo</label>
                <input className="input" placeholder="Seu nome completo" value={nome} onChange={e => { setNome(e.target.value); setError(''); }} disabled={loading} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Turma / Sala</label>
                <input className="input" placeholder="Ex: 3ºA" value={turma} onChange={e => { setTurma(e.target.value); setError(''); }} disabled={loading} />
              </div>
              {error && <p className="text-sm font-medium" style={{ color: 'var(--error)' }}>{error}</p>}
              {statusMessage && (
                <p className="text-xs font-semibold animate-pulse text-center" style={{ color: 'var(--primary-light)' }}>
                  {statusMessage}
                </p>
              )}
              <button type="submit" className="btn btn-primary btn-lg w-full mt-2 flex items-center justify-center gap-2" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Entrando...
                  </>
                ) : (
                  <>
                    <Gamepad2 size={20} />
                    Entrar e Jogar
                  </>
                )}
              </button>
            </form>
          </motion.div>

          <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            {features.map((f, i) => (
              <div key={i} className="card text-center py-4 px-3" style={{ cursor: 'default' }}>
                <div className="flex justify-center mb-2" style={{ color: 'var(--primary-light)' }}>{f.icon}</div>
                <h3 className="text-sm font-bold mb-1">{f.title}</h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
