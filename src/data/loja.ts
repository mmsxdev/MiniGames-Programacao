export interface ItemLoja {
  id: string;
  nome: string;
  descricao: string;
  custoXP: number;
  tipo: 'avatar' | 'cor' | 'titulo';
  valor: string;
}

export const itensLoja: ItemLoja[] = [
  // Avatares
  { id: 'av-robo', nome: 'Robô Codificador', descricao: 'Um robô focado em compilar bugs.', custoXP: 100, tipo: 'avatar', valor: '🤖' },
  { id: 'av-ninja', nome: 'Ninja do Código', descricao: 'Silencioso e letal contra erros de sintaxe.', custoXP: 250, tipo: 'avatar', valor: '🥷' },
  { id: 'av-mago', nome: 'Mago da Lógica', descricao: 'Seus feitiços são algoritmos perfeitos.', custoXP: 400, tipo: 'avatar', valor: '🧙‍♂️' },
  { id: 'av-dragao', nome: 'Dragão de Fogo', descricao: 'Cospe chamas no terminal.', custoXP: 600, tipo: 'avatar', valor: '🐉' },
  { id: 'av-alien', nome: 'Hacker Galáctico', descricao: 'Programa em linguagens de outro planeta.', custoXP: 1000, tipo: 'avatar', valor: '👽' },

  // Cores
  { id: 'cor-red', nome: 'Vermelho Ruby', descricao: 'Borda vibrante e clássica.', custoXP: 150, tipo: 'cor', valor: '#EF4444' },
  { id: 'cor-green', nome: 'Verde Matrix', descricao: 'Para quem enxerga além do código.', custoXP: 150, tipo: 'cor', valor: '#10B981' },
  { id: 'cor-orange', nome: 'Laranja Rust', descricao: 'Quente e imponente.', custoXP: 250, tipo: 'cor', valor: '#F59E0B' },
  { id: 'cor-pink', nome: 'Rosa Choque', descricao: 'Estilo cyber e moderno.', custoXP: 250, tipo: 'cor', valor: '#EC4899' },
  { id: 'cor-rainbow', nome: 'Aura + Ego', descricao: 'Uma cor mítica com gradiente.', custoXP: 1200, tipo: 'cor', valor: 'linear-gradient(45deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9400D3)' },

  // Títulos
  { id: 'tit-aprendiz', nome: 'Aprendiz', descricao: 'Dando os primeiros passos.', custoXP: 50, tipo: 'titulo', valor: 'Aprendiz' },
  { id: 'tit-escudeiro', nome: 'Escudeiro de Dados', descricao: 'Protetor das variáveis reais.', custoXP: 200, tipo: 'titulo', valor: 'Escudeiro de Dados' },
  { id: 'tit-cavaleiro', nome: 'Cavaleiro do Laço', descricao: 'Mestre no Para e Enquanto.', custoXP: 400, tipo: 'titulo', valor: 'Cavaleiro do Laço' },
  { id: 'tit-mestre', nome: 'Mestre do Portugol', descricao: 'Domínio total sobre a sintaxe.', custoXP: 800, tipo: 'titulo', valor: 'Mestre do Portugol' },
  { id: 'tit-lenda', nome: 'A Lenda Viva', descricao: 'Seu código não tem bugs, tem features.', custoXP: 2000, tipo: 'titulo', valor: 'A Lenda Viva' },
];
