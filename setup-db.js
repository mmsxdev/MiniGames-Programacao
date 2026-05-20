const { Client } = require('pg');

const connectionString = "postgresql://postgres.zloldpnlyjgivdngluix:Miguel197324!1@1@aws-1-us-east-1.pooler.supabase.com:6543/postgres";

const client = new Client({
  connectionString,
});

const createTableSql = `
CREATE TABLE IF NOT EXISTS perfis (
  id UUID PRIMARY KEY,
  nome TEXT NOT NULL,
  turma TEXT NOT NULL,
  xp_total INTEGER DEFAULT 0,
  xp_gasto INTEGER DEFAULT 0,
  inventario TEXT[] DEFAULT '{}',
  avatar_equipado TEXT,
  cor_equipada TEXT,
  titulo_equipado TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE perfis ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir leitura pública" ON perfis;
CREATE POLICY "Permitir leitura pública" ON perfis FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir inserção/atualização pública" ON perfis;
CREATE POLICY "Permitir inserção/atualização pública" ON perfis FOR ALL USING (true);

-- Tabela de exercícios gerados por IA
CREATE TABLE IF NOT EXISTS exercicios_custom (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL CHECK (tipo IN ('lacuna', 'puzzle', 'quiz')),
  dados JSONB NOT NULL,
  criado_por TEXT NOT NULL,
  turma TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE exercicios_custom ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leitura pública exercícios" ON exercicios_custom;
CREATE POLICY "Leitura pública exercícios" ON exercicios_custom FOR SELECT USING (true);

DROP POLICY IF EXISTS "Escrita pública exercícios" ON exercicios_custom;
CREATE POLICY "Escrita pública exercícios" ON exercicios_custom FOR ALL USING (true);
`;

async function run() {
  try {
    await client.connect();
    console.log("Conectado ao Supabase!");
    await client.query(createTableSql);
    console.log("Tabela 'perfis' criada/verificada com sucesso!");
    
    // Atualizar o cache do PostgREST para o Supabase reconhecer a nova tabela
    await client.query("NOTIFY pgrst, 'reload schema';");
    console.log("Cache de schema do Supabase recarregado!");
    
  } catch (err) {
    console.error("Erro ao criar tabela:", err);
  } finally {
    await client.end();
  }
}

run();
