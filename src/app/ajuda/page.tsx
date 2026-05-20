'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Code, Puzzle, HelpCircle, Sparkles, Trophy, Zap } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const sections = [
  {
    icon: <Code size={24} />, title: 'Minigame 1: Código com Lacunas', color: '#7C3AED',
    steps: [
      'Você verá um código Portugol com espaços em branco (lacunas).',
      'Preencha cada lacuna com o código correto.',
      'Clique em "Executar" para testar seu código.',
      'Se a saída estiver correta, você ganha XP! Se não, veja as dicas.',
      'Quanto menos tentativas, mais XP você ganha.',
    ],
  },
  {
    icon: <Puzzle size={24} />, title: 'Minigame 2: Quebra-Cabeça de Código', color: '#3B82F6',
    steps: [
      'Você verá um código com espaços vazios (zonas de drop).',
      'À direita, há blocos de código embaralhados.',
      'Arraste os blocos para os espaços corretos.',
      'Cuidado! Alguns blocos são distratores e não fazem parte do código.',
      'Clique em "Verificar e Executar" para testar.',
    ],
  },
  {
    icon: <HelpCircle size={24} />, title: 'Minigame 3: Quiz', color: '#10B981',
    steps: [
      'Responda perguntas de múltipla escolha sobre Portugol.',
      'Cada pergunta tem um cronômetro de bônus.',
      'Respostas rápidas dão XP extra!',
      'Acertos consecutivos geram streaks que multiplicam o bônus.',
      'No final, veja seu percentual de acertos.',
    ],
  },
  {
    icon: <Zap size={24} />, title: 'Sistema de XP', color: '#F59E0B',
    steps: [
      '1ª tentativa = 100% do XP base.',
      '2ª tentativa = 70% do XP base.',
      '3ª tentativa = 50% do XP base.',
      'Depois disso = 25% do XP base.',
      'Bônus extras por: sem erros (+50 XP), resposta rápida (+25 XP), streak (+10 XP cada).',
    ],
  },
  {
    icon: <Trophy size={24} />, title: 'Ranking', color: '#FFD700',
    steps: [
      'Veja sua posição no ranking da turma.',
      'O top 3 aparece no pódio animado.',
      'O professor pode exportar os resultados em planilha (.xlsx).',
      'Também é possível importar planilhas para unificar rankings de várias máquinas.',
    ],
  },
];

export default function AjudaPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <header className="flex items-center justify-between p-4 max-w-4xl mx-auto">
        <button className="btn btn-secondary btn-sm" onClick={() => router.push('/menu')}><ArrowLeft size={16} /> Menu</button>
        <ThemeToggle />
      </header>
      <main className="max-w-4xl mx-auto px-4 pb-8">
        <motion.div className="text-center mb-8" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <Sparkles size={40} className="mx-auto mb-2" style={{ color: 'var(--primary-light)' }} />
          <h1 className="text-3xl font-black mb-2">Como Jogar</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Guia completo de todos os minigames</p>
        </motion.div>
        <div className="flex flex-col gap-6">
          {sections.map((s, i) => (
            <motion.div key={i} className="card" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} style={{ cursor: 'default' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${s.color}20`, color: s.color }}>{s.icon}</div>
                <h2 className="text-xl font-bold">{s.title}</h2>
              </div>
              <ol className="flex flex-col gap-2 ml-4">
                {s.steps.map((step, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: `${s.color}20`, color: s.color }}>{j + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
