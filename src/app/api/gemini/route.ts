// app/api/gemini/route.ts
// Proxy server-side para chamadas ao Gemini.
// A chave de API nunca sai do servidor.

import { NextRequest, NextResponse } from 'next/server';

const MODELS = [
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
];

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  // Lê a chave do ambiente do servidor — nunca do cliente
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { erro: 'Chave de API não configurada no servidor. Adicione GEMINI_API_KEY nas variáveis de ambiente da Vercel ou no arquivo .env.local.' },
      { status: 500 }
    );
  }

  let lastError = '';

  for (const model of MODELS) {
    try {
      const url = `${BASE_URL}/${model}:generateContent`;

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey.trim(),
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
          },
        }),
      });

      const errData = await res.json().catch(() => ({}));

      if (res.ok) {
        const rawText = errData?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
        return NextResponse.json({ texto: rawText });
      }

      lastError = `${model}: ${res.status} — ${errData?.error?.message ?? 'erro desconhecido'}`;
      console.warn(`[Gemini] ${lastError}`);

      // Se a chave estiver bloqueada com limit: 0, lança o aviso direto
      if (errData?.error?.message?.includes('limit: 0')) {
        return NextResponse.json(
          { erro: '🔑 Sua chave de API do Gemini foi bloqueada ou desativada pelo Google (Limite: 0). Isso acontece se a chave foi exposta em commits do Git/GitHub ou chats abertos. Acesse aistudio.google.com, delete a chave antiga, crie uma NOVA chave em um "Novo Projeto" e insira-a no arquivo .env.local.' },
          { status: 403 }
        );
      }
    } catch {
      lastError = `${model}: erro de conexão`;
    }
  }

  // Todos os modelos falharam
  return NextResponse.json(
    {
      erro: `⏳ Cota gratuita esgotada ou chaves bloqueadas nos modelos suportados. Detalhe do último erro: ${lastError}`,
    },
    { status: 429 }
  );
}