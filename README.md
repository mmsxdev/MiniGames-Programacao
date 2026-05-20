# 🎮 Portugol Games

Plataforma de minigames educativos para aprender programação com **Portugol**. Projeto 100% frontend, sem backend, pronto para deploy na Vercel.

## ✨ Funcionalidades

- **3 Minigames Interativos:**
  - 🧩 **Código com Lacunas** — Preencha os espaços em branco no código Portugol
  - 🧱 **Quebra-Cabeça de Código** — Arraste blocos para montar o programa
  - ❓ **Quiz de Programação** — Perguntas de múltipla escolha com cronômetro

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
