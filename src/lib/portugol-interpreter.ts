import { ResultadoExecucao } from '@/types';

// Token types
type TType = 'NUM'|'STR'|'BOOL'|'ID'|'OP'|'COMP'|'LOGIC'|'ASSIGN'|'LPAREN'|'RPAREN'|'LBRACE'|'RBRACE'|'COMMA'|'SEMI'|'KW'|'EOF';

interface Token { type: TType; value: string; line: number; }

const KEYWORDS = new Set([
  'programa','funcao','inicio','inteiro','real','cadeia','logico','caractere',
  'var','const','se','senao','enquanto','para','de','ate','passo','faca',
  'escreva','escreval','leia','retorne','verdadeiro','falso',
  'e','ou','nao','mod','escolha','caso','pare','outrocaso'
]);

function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0, line = 1;
  const src = code.replace(/\r\n/g, '\n');

  while (i < src.length) {
    // Whitespace
    if (src[i] === '\n') { line++; i++; continue; }
    if (/\s/.test(src[i])) { i++; continue; }
    // Comments
    if (src[i] === '/' && src[i+1] === '/') { while (i < src.length && src[i] !== '\n') i++; continue; }
    if (src[i] === '/' && src[i+1] === '*') { i+=2; while (i < src.length-1 && !(src[i]==='*'&&src[i+1]==='/')) { if(src[i]==='\n') line++; i++; } i+=2; continue; }
    // String
    if (src[i] === '"') {
      let s = ''; i++;
      while (i < src.length && src[i] !== '"') {
        if (src[i] === '\\' && src[i+1] === 'n') { s += '\n'; i += 2; continue; }
        if (src[i] === '\\' && src[i+1] === 't') { s += '\t'; i += 2; continue; }
        s += src[i]; i++;
      }
      i++; tokens.push({type:'STR',value:s,line}); continue;
    }
    // Number
    if (/\d/.test(src[i]) || (src[i]==='.' && i+1<src.length && /\d/.test(src[i+1]))) {
      let n = '';
      while (i < src.length && /[\d.]/.test(src[i])) { n += src[i]; i++; }
      tokens.push({type:'NUM',value:n,line}); continue;
    }
    // Identifier / Keyword
    if (/[a-zA-Z_àáâãéêíóôõúüçÀÁÂÃÉÊÍÓÔÕÚÜÇ]/.test(src[i])) {
      let id = '';
      while (i < src.length && /[a-zA-Z0-9_àáâãéêíóôõúüçÀÁÂÃÉÊÍÓÔÕÚÜÇ]/.test(src[i])) { id += src[i]; i++; }
      if (id === 'verdadeiro' || id === 'falso') tokens.push({type:'BOOL',value:id,line});
      else if (KEYWORDS.has(id)) tokens.push({type:'KW',value:id,line});
      else tokens.push({type:'ID',value:id,line});
      continue;
    }
    // Assignment <-
    if (src[i] === '<' && src[i+1] === '-') { tokens.push({type:'ASSIGN',value:'<-',line}); i+=2; continue; }
    // Comparison operators
    if (src[i] === '<' && src[i+1] === '=') { tokens.push({type:'COMP',value:'<=',line}); i+=2; continue; }
    if (src[i] === '>' && src[i+1] === '=') { tokens.push({type:'COMP',value:'>=',line}); i+=2; continue; }
    if (src[i] === '!' && src[i+1] === '=') { tokens.push({type:'COMP',value:'!=',line}); i+=2; continue; }
    if (src[i] === '=' && src[i+1] === '=') { tokens.push({type:'COMP',value:'==',line}); i+=2; continue; }
    if (src[i] === '=') { tokens.push({type:'ASSIGN',value:'=',line}); i++; continue; }
    if (src[i] === '<') { tokens.push({type:'COMP',value:'<',line}); i++; continue; }
    if (src[i] === '>') { tokens.push({type:'COMP',value:'>',line}); i++; continue; }
    // Operators
    if ('+-*/%^'.includes(src[i])) { tokens.push({type:'OP',value:src[i],line}); i++; continue; }
    // Delimiters
    if (src[i] === '(') { tokens.push({type:'LPAREN',value:'(',line}); i++; continue; }
    if (src[i] === ')') { tokens.push({type:'RPAREN',value:')',line}); i++; continue; }
    if (src[i] === '{') { tokens.push({type:'LBRACE',value:'{',line}); i++; continue; }
    if (src[i] === '}') { tokens.push({type:'RBRACE',value:'}',line}); i++; continue; }
    if (src[i] === ',') { tokens.push({type:'COMMA',value:',',line}); i++; continue; }
    if (src[i] === '[') { tokens.push({type:'LPAREN',value:'[',line}); i++; continue; }
    if (src[i] === ']') { tokens.push({type:'RPAREN',value:']',line}); i++; continue; }
    // Skip unknown
    i++;
  }
  tokens.push({type:'EOF',value:'',line});
  return tokens;
}

// AST Node types
type ASTNode =
  | { kind:'program'; body: ASTNode[] }
  | { kind:'varDecl'; tipo: string; names: string[]; line: number }
  | { kind:'assign'; name: string; value: ASTNode; line: number }
  | { kind:'escreva'; args: ASTNode[]; newline: boolean; line: number }
  | { kind:'leia'; names: string[]; line: number }
  | { kind:'se'; cond: ASTNode; then: ASTNode[]; senao: ASTNode[]; line: number }
  | { kind:'enquanto'; cond: ASTNode; body: ASTNode[]; line: number }
  | { kind:'para'; varName: string; from: ASTNode; to: ASTNode; step: ASTNode|null; body: ASTNode[]; line: number }
  | { kind:'faca'; body: ASTNode[]; cond: ASTNode; line: number }
  | { kind:'escolha'; expr: ASTNode; casos: { valor: ASTNode|null; body: ASTNode[] }[]; line: number }
  | { kind:'binop'; op: string; left: ASTNode; right: ASTNode; line: number }
  | { kind:'unaryNot'; expr: ASTNode; line: number }
  | { kind:'num'; value: number; line: number }
  | { kind:'str'; value: string; line: number }
  | { kind:'bool'; value: boolean; line: number }
  | { kind:'ident'; name: string; line: number }
  | { kind:'call'; name: string; args: ASTNode[]; line: number }
  | { kind:'noop' };

class Parser {
  tokens: Token[];
  pos = 0;

  constructor(tokens: Token[]) { this.tokens = tokens; }

  peek(): Token { return this.tokens[this.pos] || {type:'EOF',value:'',line:0}; }
  advance(): Token { return this.tokens[this.pos++]; }
  expect(type: TType, value?: string): Token {
    const t = this.advance();
    if (t.type !== type || (value !== undefined && t.value !== value))
      throw new Error(`Esperado ${value||type}, encontrado "${t.value}" na linha ${t.line}`);
    return t;
  }
  match(type: TType, value?: string): boolean {
    const t = this.peek();
    if (t.type === type && (value === undefined || t.value === value)) { this.advance(); return true; }
    return false;
  }

  parseProgram(): ASTNode {
    const body: ASTNode[] = [];
    // Skip 'programa' and braces wrapper if present
    if (this.peek().value === 'programa') { this.advance(); if(this.peek().type==='LBRACE') this.advance(); }
    while (this.peek().type !== 'EOF') {
      if (this.peek().value === 'funcao' || this.peek().value === 'inicio') {
        this.advance();
        if (this.peek().type === 'ID') this.advance(); // function name
        if (this.peek().type === 'LPAREN') { this.advance(); if(this.peek().type==='RPAREN') this.advance(); }
        if (this.peek().type === 'LBRACE') this.advance();
        continue;
      }
      if (this.peek().type === 'RBRACE') { this.advance(); continue; }
      const stmt = this.parseStatement();
      if (stmt.kind !== 'noop') body.push(stmt);
    }
    return { kind:'program', body };
  }

  parseStatement(): ASTNode {
    const t = this.peek();
    if (t.type === 'KW') {
      switch(t.value) {
        case 'inteiro': case 'real': case 'cadeia': case 'logico': case 'caractere':
          return this.parseVarDecl();
        case 'var': this.advance(); return this.parseVarDecl();
        case 'se': return this.parseSe();
        case 'enquanto': return this.parseEnquanto();
        case 'para': return this.parsePara();
        case 'faca': return this.parseFaca();
        case 'escolha': return this.parseEscolha();
        case 'escreva': case 'escreval': return this.parseEscreva();
        case 'leia': return this.parseLeia();
        case 'retorne': this.advance(); this.parseExpr(); return {kind:'noop'};
        default: this.advance(); return {kind:'noop'};
      }
    }
    if (t.type === 'ID') return this.parseAssignOrExpr();
    if (t.type === 'RBRACE') return {kind:'noop'};
    this.advance();
    return {kind:'noop'};
  }

  parseVarDecl(): ASTNode {
    const tipo = this.advance().value;
    const names: string[] = [];
    const line = this.peek().line;
    names.push(this.expect('ID').value);
    while (this.match('COMMA')) names.push(this.expect('ID').value);
    // Check for inline assignment
    if (this.peek().type === 'ASSIGN') {
      this.advance();
      const val = this.parseExpr();
      return { kind:'program', body: [
        { kind:'varDecl', tipo, names, line },
        { kind:'assign', name: names[names.length-1], value: val, line }
      ]};
    }
    return { kind:'varDecl', tipo, names, line };
  }

  parseAssignOrExpr(): ASTNode {
    const name = this.advance().value;
    const line = this.tokens[this.pos-1].line;
    if (this.match('ASSIGN')) {
      const val = this.parseExpr();
      return { kind:'assign', name, value: val, line };
    }
    // Could be a function call
    if (this.peek().type === 'LPAREN') {
      this.advance();
      const args: ASTNode[] = [];
      if (this.peek().type !== 'RPAREN') {
        args.push(this.parseExpr());
        while (this.match('COMMA')) args.push(this.parseExpr());
      }
      this.expect('RPAREN');
      return { kind:'call', name, args, line };
    }
    return { kind:'noop' };
  }

  parseEscreva(): ASTNode {
    const kw = this.advance();
    const newline = kw.value === 'escreval';
    const line = kw.line;
    this.expect('LPAREN');
    const args: ASTNode[] = [];
    if (this.peek().type !== 'RPAREN') {
      args.push(this.parseExpr());
      while (this.match('COMMA')) args.push(this.parseExpr());
    }
    this.expect('RPAREN');
    return { kind:'escreva', args, newline, line };
  }

  parseLeia(): ASTNode {
    const line = this.advance().line;
    this.expect('LPAREN');
    const names: string[] = [];
    names.push(this.expect('ID').value);
    while (this.match('COMMA')) names.push(this.expect('ID').value);
    this.expect('RPAREN');
    return { kind:'leia', names, line };
  }

  parseSe(): ASTNode {
    const line = this.advance().line; // skip 'se'
    this.expect('LPAREN');
    const cond = this.parseExpr();
    this.expect('RPAREN');
    this.expect('LBRACE');
    const then = this.parseBlock();
    this.expect('RBRACE');
    let senao: ASTNode[] = [];
    if (this.match('KW','senao')) {
      if (this.peek().value === 'se') {
        senao = [this.parseSe()];
      } else {
        this.expect('LBRACE');
        senao = this.parseBlock();
        this.expect('RBRACE');
      }
    }
    return { kind:'se', cond, then, senao, line };
  }

  parseEnquanto(): ASTNode {
    const line = this.advance().line;
    this.expect('LPAREN');
    const cond = this.parseExpr();
    this.expect('RPAREN');
    this.expect('LBRACE');
    const body = this.parseBlock();
    this.expect('RBRACE');
    return { kind:'enquanto', cond, body, line };
  }

  parsePara(): ASTNode {
    const line = this.advance().line; // skip 'para'
    this.expect('LPAREN');
    
    // Identifica se a sintaxe é estilo C (tem '=') ou clássica (tem 'de')
    const next2 = this.tokens[this.pos + 1];
    
    if (next2 && next2.type === 'ASSIGN' && next2.value === '=') {
      // Sintaxe Estilo C: para (cont = 1; cont <= 10; cont++)
      const varName = this.expect('ID').value;
      this.expect('ASSIGN', '=');
      const from = this.parseExpr();
      this.expect('SEMI');
      
      const cond = this.parseExpr();
      let to: ASTNode = { kind: 'num', value: 10, line };
      if (cond.kind === 'binop') {
        to = cond.right;
      }
      this.expect('SEMI');
      
      // Consome a expressão de incremento até fechar o parêntese
      while (this.peek().type !== 'RPAREN' && this.peek().type !== 'EOF') {
        this.advance();
      }
      this.expect('RPAREN');
      this.expect('LBRACE');
      const body = this.parseBlock();
      this.expect('RBRACE');
      
      return { kind: 'para', varName, from, to, step: null, body, line };
    } else {
      // Sintaxe Clássica: para (cont de 1 ate 10)
      const varName = this.expect('ID').value;
      this.expect('KW','de');
      const from = this.parseExpr();
      this.expect('KW','ate');
      const to = this.parseExpr();
      let step: ASTNode|null = null;
      if (this.match('KW','passo')) step = this.parseExpr();
      this.expect('RPAREN');
      this.expect('LBRACE');
      const body = this.parseBlock();
      this.expect('RBRACE');
      return { kind:'para', varName, from, to, step, body, line };
    }
  }

  parseFaca(): ASTNode {
    const line = this.advance().line;
    this.expect('LBRACE');
    const body = this.parseBlock();
    this.expect('RBRACE');
    this.expect('KW','enquanto');
    this.expect('LPAREN');
    const cond = this.parseExpr();
    this.expect('RPAREN');
    return { kind:'faca', body, cond, line };
  }

  parseEscolha(): ASTNode {
    const line = this.advance().line; // skip 'escolha'
    this.expect('LPAREN');
    const expr = this.parseExpr();
    this.expect('RPAREN');
    this.expect('LBRACE');
    const casos: { valor: ASTNode|null; body: ASTNode[] }[] = [];
    while (this.peek().type !== 'RBRACE' && this.peek().type !== 'EOF') {
      const t = this.peek();
      if (t.type === 'KW' && t.value === 'caso') {
        this.advance(); // skip 'caso'
        const next = this.peek();
        let valor: ASTNode|null = null;
        if (next.type === 'ID' && next.value === 'contrario') {
          this.advance(); // skip 'contrario'
        } else {
          valor = this.parseExpr();
        }
        const body: ASTNode[] = [];
        while (this.peek().type !== 'RBRACE' && this.peek().type !== 'EOF' && !(this.peek().type === 'KW' && this.peek().value === 'caso')) {
          const stmt = this.parseStatement();
          if (stmt.kind !== 'noop') body.push(stmt);
        }
        casos.push({ valor, body });
      } else {
        this.advance();
      }
    }
    this.expect('RBRACE');
    return { kind: 'escolha', expr, casos, line };
  }

  parseBlock(): ASTNode[] {
    const stmts: ASTNode[] = [];
    while (this.peek().type !== 'RBRACE' && this.peek().type !== 'EOF') {
      const s = this.parseStatement();
      if (s.kind !== 'noop') stmts.push(s);
    }
    return stmts;
  }

  parseExpr(): ASTNode { return this.parseOr(); }

  parseOr(): ASTNode {
    let left = this.parseAnd();
    while (this.peek().value === 'ou') {
      const op = this.advance(); left = { kind:'binop', op:'ou', left, right: this.parseAnd(), line: op.line };
    }
    return left;
  }

  parseAnd(): ASTNode {
    let left = this.parseNot();
    while (this.peek().value === 'e') {
      const op = this.advance(); left = { kind:'binop', op:'e', left, right: this.parseNot(), line: op.line };
    }
    return left;
  }

  parseNot(): ASTNode {
    if (this.peek().value === 'nao') {
      const op = this.advance();
      return { kind:'unaryNot', expr: this.parseNot(), line: op.line };
    }
    return this.parseComparison();
  }

  parseComparison(): ASTNode {
    let left = this.parseAddSub();
    while (this.peek().type === 'COMP') {
      const op = this.advance(); left = { kind:'binop', op: op.value, left, right: this.parseAddSub(), line: op.line };
    }
    return left;
  }

  parseAddSub(): ASTNode {
    let left = this.parseMulDiv();
    while (this.peek().value === '+' || this.peek().value === '-') {
      const op = this.advance(); left = { kind:'binop', op: op.value, left, right: this.parseMulDiv(), line: op.line };
    }
    return left;
  }

  parseMulDiv(): ASTNode {
    let left = this.parsePower();
    while (this.peek().value === '*' || this.peek().value === '/' || this.peek().value === '%' || this.peek().value === 'mod') {
      const op = this.advance(); left = { kind:'binop', op: op.value==='mod'?'%':op.value, left, right: this.parsePower(), line: op.line };
    }
    return left;
  }

  parsePower(): ASTNode {
    let left = this.parseUnary();
    while (this.peek().value === '^') {
      const op = this.advance(); left = { kind:'binop', op:'^', left, right: this.parseUnary(), line: op.line };
    }
    return left;
  }

  parseUnary(): ASTNode {
    if (this.peek().value === '-') {
      const op = this.advance();
      const expr = this.parsePrimary();
      return { kind:'binop', op:'-', left:{kind:'num',value:0,line:op.line}, right: expr, line: op.line };
    }
    return this.parsePrimary();
  }

  parsePrimary(): ASTNode {
    const t = this.peek();
    if (t.type === 'NUM') { this.advance(); return { kind:'num', value: parseFloat(t.value), line: t.line }; }
    if (t.type === 'STR') { this.advance(); return { kind:'str', value: t.value, line: t.line }; }
    if (t.type === 'BOOL') { this.advance(); return { kind:'bool', value: t.value === 'verdadeiro', line: t.line }; }
    if (t.type === 'ID' || (t.type === 'KW' && !['se','senao','enquanto','para','faca','escreva','escreval','leia'].includes(t.value))) {
      const name = this.advance().value;
      if (this.peek().type === 'LPAREN') {
        this.advance();
        const args: ASTNode[] = [];
        if (this.peek().type !== 'RPAREN') {
          args.push(this.parseExpr());
          while (this.match('COMMA')) args.push(this.parseExpr());
        }
        this.expect('RPAREN');
        return { kind:'call', name, args, line: t.line };
      }
      return { kind:'ident', name, line: t.line };
    }
    if (t.type === 'LPAREN' && t.value === '(') {
      this.advance();
      const expr = this.parseExpr();
      this.expect('RPAREN');
      return expr;
    }
    this.advance();
    return { kind:'num', value: 0, line: t.line };
  }
}

// Evaluator
type Value = number | string | boolean;

class Evaluator {
  vars: Map<string, Value> = new Map();
  output: string[] = [];
  inputs: string[];
  inputIdx = 0;
  maxSteps = 50000;
  steps = 0;

  constructor(inputs: string[]) { this.inputs = inputs; }

  run(node: ASTNode): void {
    if (++this.steps > this.maxSteps) throw { mensagem: 'Loop infinito detectado (mais de 50000 operações)', linha: 0 };
    switch(node.kind) {
      case 'program':
        for (const s of node.body) this.run(s);
        break;
      case 'varDecl':
        for (const n of node.names) {
          if (node.tipo === 'inteiro' || node.tipo === 'real') this.vars.set(n, 0);
          else if (node.tipo === 'cadeia' || node.tipo === 'caractere') this.vars.set(n, '');
          else if (node.tipo === 'logico') this.vars.set(n, false);
        }
        break;
      case 'assign': {
        const val = this.eval(node.value);
        this.vars.set(node.name, val);
        break;
      }
      case 'escreva': {
        const parts = node.args.map(a => {
          const v = this.eval(a);
          return typeof v === 'number' ? (Number.isInteger(v) ? v.toString() : v.toFixed(1)) : String(v);
        });
        const text = parts.join('');
        const lines = text.split('\n');

        if (this.output.length === 0) {
          this.output.push(...lines);
        } else {
          this.output[this.output.length - 1] += lines[0];
          if (lines.length > 1) {
            this.output.push(...lines.slice(1));
          }
        }
        if (node.newline) {
          this.output.push('');
        }
        break;
      }
      case 'leia':
        for (const name of node.names) {
          const input = this.inputIdx < this.inputs.length ? this.inputs[this.inputIdx++] : '0';
          
          if (this.output.length === 0) this.output.push(input);
          else this.output[this.output.length - 1] += input;
          this.output.push('');

          const numVal = parseFloat(input);
          if (!isNaN(numVal) && this.vars.has(name) && typeof this.vars.get(name) === 'number') {
            this.vars.set(name, numVal);
          } else {
            this.vars.set(name, input);
          }
        }
        break;
      case 'se': {
        const cond = this.eval(node.cond);
        if (this.truthy(cond)) { for (const s of node.then) this.run(s); }
        else { for (const s of node.senao) this.run(s); }
        break;
      }
      case 'enquanto':
        while (this.truthy(this.eval(node.cond))) {
          for (const s of node.body) this.run(s);
          if (this.steps > this.maxSteps) throw { mensagem: 'Loop infinito detectado', linha: node.line };
        }
        break;
      case 'para': {
        const from = this.toNum(this.eval(node.from));
        const to = this.toNum(this.eval(node.to));
        const step = node.step ? this.toNum(this.eval(node.step)) : (from <= to ? 1 : -1);
        this.vars.set(node.varName, from);
        if (step > 0) {
          for (let i = from; i <= to; i += step) {
            this.vars.set(node.varName, i);
            for (const s of node.body) this.run(s);
            if (this.steps > this.maxSteps) throw { mensagem: 'Loop infinito detectado', linha: node.line };
          }
        } else {
          for (let i = from; i >= to; i += step) {
            this.vars.set(node.varName, i);
            for (const s of node.body) this.run(s);
            if (this.steps > this.maxSteps) throw { mensagem: 'Loop infinito detectado', linha: node.line };
          }
        }
        break;
      }
      case 'faca':
        do {
          for (const s of node.body) this.run(s);
          if (this.steps > this.maxSteps) throw { mensagem: 'Loop infinito detectado', linha: node.line };
        } while (this.truthy(this.eval(node.cond)));
        break;
      case 'call':
        this.evalCall(node.name, node.args);
        break;
      case 'escolha': {
        const val = this.eval(node.expr);
        let correspondido = false;
        let casoContrarioNode: { valor: ASTNode|null; body: ASTNode[] } | null = null;
        for (const c of node.casos) {
          if (c.valor === null) {
            casoContrarioNode = c;
            continue;
          }
          const cVal = this.eval(c.valor);
          if (val === cVal) {
            correspondido = true;
            for (const s of c.body) this.run(s);
            break;
          }
        }
        if (!correspondido && casoContrarioNode) {
          for (const s of casoContrarioNode.body) this.run(s);
        }
        break;
      }
    }
  }

  eval(node: ASTNode): Value {
    this.steps++;
    switch(node.kind) {
      case 'num': return node.value;
      case 'str': return node.value;
      case 'bool': return node.value;
      case 'ident': return this.vars.get(node.name) ?? 0;
      case 'binop': return this.evalBinop(node.op, node.left, node.right);
      case 'unaryNot': return !this.truthy(this.eval(node.expr));
      case 'call': return this.evalCall(node.name, node.args);
      default: return 0;
    }
  }

  evalBinop(op: string, l: ASTNode, r: ASTNode): Value {
    const lv = this.eval(l), rv = this.eval(r);
    if (op === '+' && (typeof lv === 'string' || typeof rv === 'string')) return String(lv) + String(rv);
    const ln = this.toNum(lv), rn = this.toNum(rv);
    switch(op) {
      case '+': return ln + rn;
      case '-': return ln - rn;
      case '*': return ln * rn;
      case '/': if (rn === 0) throw { mensagem: 'Divisão por zero', linha: l.kind === 'num' ? l.line : 0 }; return ln / rn;
      case '%': return ln % rn;
      case '^': return Math.pow(ln, rn);
      case '==': return lv == rv;
      case '!=': return lv != rv;
      case '<': return ln < rn;
      case '>': return ln > rn;
      case '<=': return ln <= rn;
      case '>=': return ln >= rn;
      case 'e': return this.truthy(lv) && this.truthy(rv);
      case 'ou': return this.truthy(lv) || this.truthy(rv);
      default: return 0;
    }
  }

  evalCall(name: string, args: ASTNode[]): Value {
    const evArgs = args.map(a => this.eval(a));
    switch(name) {
      case 'raiz': return Math.sqrt(this.toNum(evArgs[0]));
      case 'potencia': return Math.pow(this.toNum(evArgs[0]), this.toNum(evArgs[1]));
      case 'absoluto': return Math.abs(this.toNum(evArgs[0]));
      case 'inteiro': return Math.floor(this.toNum(evArgs[0]));
      default: return 0;
    }
  }

  toNum(v: Value): number { return typeof v === 'number' ? v : typeof v === 'boolean' ? (v?1:0) : parseFloat(v)||0; }
  truthy(v: Value): boolean { return v !== 0 && v !== '' && v !== false; }
}

export function executarPortugol(codigo: string, entradas: string[] = []): ResultadoExecucao {
  try {
    const tokens = tokenize(codigo);
    const parser = new Parser(tokens);
    const ast = parser.parseProgram();
    const evaluator = new Evaluator(entradas);
    evaluator.run(ast);
    return {
      sucesso: true,
      saida: evaluator.output,
      entradaConsumida: entradas.slice(0, evaluator.inputIdx),
    };
  } catch (e: unknown) {
    const err = e as { mensagem?: string; linha?: number; message?: string };
    return {
      sucesso: false,
      saida: [],
      erro: { mensagem: err.mensagem || err.message || 'Erro desconhecido', linha: err.linha || 0 },
      entradaConsumida: [],
    };
  }
}
