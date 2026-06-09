# 🎮 Portugol Games

Plataforma de minigames educativos para aprender programação com **Portugol**. Projeto 100% frontend, sem backend, pronto para deploy na Vercel.

## ✨ Funcionalidades

## 🎲 Sistema de Minigames Atuais
1. **Quebra-cabeça de Código:** Arraste e solte blocos para formar a lógica.
2. **Código com Lacunas:** Preencha os espaços em branco com a sintaxe correta.
3. **Quiz Rápido:** Perguntas de múltipla escolha com temporizador para bônus.

## 📐 Regras de Arquitetura (Decisões de Projeto)

### Sistema de XP e Dicas (Persistência Mista)
Para garantir uma experiência de usuário fluida e sem inconsistências de compra/retenção de dicas:
* **XP Disponível = XP da Sessão Atual + XP Global do Perfil**
* **Ordem de Débito:** 
  1. Primeiro desconta do **XP ganho na Sessão** (`totalXP` local).
  2. Caso não seja suficiente, o restante é debitado do **XP Global do Perfil** (`comprarDicaLocal(restante)`).
* **Persistência de Estados Secundários:** Toda vez que o estado é alterado (ex: comprar uma dica), o sistema realiza um `saveCurrentState` para `localStorage`, garantindo que um F5 imediato ou fechamento de aba não cause perda de itens comprados ou XP gasto.

- **Sistema de Gamificação:**
  - ⭐ XP com multiplicadores por tentativa
  - 🏅 Badges e conquistas
  - 🏆 Ranking com pódio animado
  - ⚡ Bônus por resposta rápida e streaks

- **Exportação/Importação:**
  - 📊 Exportar ranking em `.xlsx` com 3 abas
  - 📥 Importar planilhas para unificar rankings

- **Mini-interpretador Portugol** integrado (JavaScript puro)

## 🚀 Instalação

```bash
npm install
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## 📦 Deploy na Vercel

1. Faça push para o GitHub
2. Importe o projeto em [vercel.com/new](https://vercel.com/new)
3. Framework: **Next.js**
4. Clique em **Deploy**

## 🛠️ Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- Framer Motion
- SheetJS (xlsx)
- Lucide React
- Canvas Confetti

## 📁 Estrutura

```
src/
├── app/            # Páginas (login, menu, games, ranking, ajuda)
├── components/     # Componentes reutilizáveis
├── data/           # Exercícios e perguntas
├── lib/            # Interpretador, scoring, storage, export
└── types/          # Tipos TypeScript
```

## 📝 Licença

MIT
