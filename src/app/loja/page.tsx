'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingBag, Check, Lock } from 'lucide-react';
import { itensLoja, ItemLoja } from '@/data/loja';
import { getPerfil, comprarItemLoja, equiparItem } from '@/lib/storage';
import { PerfilAluno } from '@/types';
import { ThemeToggle } from '@/components/ThemeToggle';
import { initAudio, playDing, playError, playPop } from '@/lib/audio';
import { motion } from 'framer-motion';

export default function LojaPage() {
  const router = useRouter();
  const [perfil, setPerfil] = useState<PerfilAluno | null>(null);
  
  useEffect(() => {
    const p = getPerfil();
    if (!p) router.push('/');
    else {
      setPerfil(p);
      initAudio();
    }
  }, [router]);

  if (!perfil) return null;

  const xpAtual = perfil.xpTotal - perfil.xpGasto;

  const handleComprar = (item: ItemLoja) => {
    if (perfil.inventario.includes(item.id)) {
      // Já possui, então equipa
      equiparItem(item.id, item.tipo);
      setPerfil(getPerfil());
      playPop();
    } else {
      // Tenta comprar
      if (comprarItemLoja(item.id, item.custoXP, item.tipo)) {
        setPerfil(getPerfil());
        playDing();
      } else {
        playError();
      }
    }
  };

  const isEquipado = (item: ItemLoja) => {
    if (item.tipo === 'avatar') return perfil.avatarEquipado === item.id;
    if (item.tipo === 'cor') return perfil.corEquipada === item.id;
    if (item.tipo === 'titulo') return perfil.tituloEquipado === item.id;
    return false;
  };

  const renderSection = (title: string, tipo: 'avatar' | 'cor' | 'titulo') => {
    const items = itensLoja.filter(i => i.tipo === tipo);
    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, idx) => {
            const possui = perfil.inventario.includes(item.id);
            const equipado = isEquipado(item);
            const podeComprar = xpAtual >= item.custoXP;

            return (
              <motion.div key={item.id} className={`card border-2 flex flex-col justify-between ${equipado ? 'border-primary' : 'border-transparent'}`}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                
                <div className="flex items-start gap-4 mb-4">
                  {tipo === 'avatar' && (
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-3xl shrink-0" style={{ background: 'var(--bg-secondary)' }}>
                      {item.valor}
                    </div>
                  )}
                  {tipo === 'cor' && (
                    <div className="w-12 h-12 rounded-full shrink-0" style={{ background: item.valor }} />
                  )}
                  {tipo === 'titulo' && (
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0" style={{ background: 'var(--bg-secondary)' }}>
                      👑
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-bold text-lg" style={tipo === 'cor' ? { color: item.valor } : {}}>{item.nome}</h3>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.descricao}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <span className="font-bold text-sm" style={{ color: possui ? 'var(--success)' : 'var(--primary-light)' }}>
                    {possui ? 'Adquirido' : `${item.custoXP} XP`}
                  </span>
                  
                  <button 
                    className={`btn btn-sm ${equipado ? 'btn-secondary opacity-50 cursor-default' : possui ? 'btn-secondary' : podeComprar ? 'btn-primary' : 'btn-secondary opacity-50'}`}
                    onClick={() => !equipado && handleComprar(item)}
                    disabled={!possui && !podeComprar}
                  >
                    {equipado ? <><Check size={14}/> Equipado</> : possui ? 'Equipar' : !podeComprar ? <><Lock size={14}/> Comprar</> : 'Comprar'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <header className="flex items-center justify-between p-4 max-w-5xl mx-auto">
        <button className="btn btn-secondary btn-sm" onClick={() => router.push('/menu')}><ArrowLeft size={16} /> Menu</button>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Seu Saldo:</div>
            <div className="font-bold text-lg" style={{ color: 'var(--primary-light)' }}>{xpAtual} XP</div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pb-12">
        <div className="text-center mb-8">
          <ShoppingBag size={48} className="mx-auto mb-4" style={{ color: 'var(--primary)' }} />
          <h1 className="text-3xl font-black mb-2">Loja de Recompensas</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Gaste seu XP acumulado para customizar o seu perfil!</p>
        </div>

        {renderSection('Avatares', 'avatar')}
        {renderSection('Cores de Perfil', 'cor')}
        {renderSection('Títulos Honorários', 'titulo')}
        
      </main>
    </div>
  );
}
