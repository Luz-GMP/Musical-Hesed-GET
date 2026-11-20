import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const preparar = path.join(root, 'scripts/preparar.mjs');
const tempos = path.join(root, 'projeto/scripts/tempos-de-texto.mjs');
const transcrever = path.join(root, 'projeto/scripts/transcrever.mjs');
const run = (script, args, cwd) => spawnSync(process.execPath, [script, ...args], { cwd, encoding: 'utf8' });
const temporario = (fn) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'motion-portabilidade-'));
  try { fn(dir); } finally {
    assert.equal(path.dirname(dir), fs.realpathSync(os.tmpdir()));
    fs.rmSync(dir, { recursive: true, force: true });
  }
};

test('prepara projeto a partir de outro cwd, com espaços e acentos; preserva destino ocupado', () => temporario((cwd) => {
  const dest = path.join(cwd, 'Vídeo de ação');
  const result = run(preparar, ['projeto', dest], cwd);
  assert.equal(result.status, 0, result.stderr);
  assert.ok(fs.existsSync(path.join(dest, 'src/Root.tsx')));
  assert.ok(fs.existsSync(path.join(dest, 'public/fonts/Inter-Variable.ttf')));
  for (const excluded of ['node_modules', 'out', '.whisper', '.DS_Store']) {
    assert.equal(fs.existsSync(path.join(dest, excluded)), false);
  }
  fs.writeFileSync(path.join(dest, 'minha-alteracao.txt'), 'preservar');
  assert.notEqual(run(preparar, ['projeto', dest], cwd).status, 0);
  assert.equal(fs.readFileSync(path.join(dest, 'minha-alteracao.txt'), 'utf8'), 'preservar');
}));

test('recusa instalação separada de Motion e orienta a instalar o pacote inteiro', () => temporario((cwd) => {
  const dest = path.join(cwd, '.agents/skills/motion');
  const result = run(preparar, ['skill', dest], cwd);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /instalar\.mjs/);
  assert.equal(fs.existsSync(dest), false);
  assert.equal(fs.existsSync(path.join(cwd, '.claude')), false);
}));

test('recusa cópia recursiva e modo inválido antes de criar destino', () => temporario((cwd) => {
  assert.notEqual(run(preparar, ['skill', path.join(root, 'nao-criar')], cwd).status, 0);
  assert.equal(fs.existsSync(path.join(root, 'nao-criar')), false);
  const dest = path.join(cwd, 'nao-criar');
  assert.notEqual(run(preparar, ['invalido', dest], cwd).status, 0);
  assert.equal(fs.existsSync(dest), false);
}));

test('gera JSON UTF-8 com acentos, caminhos com espaços e limites de cenas contíguos', () => temporario((cwd) => {
  const output = path.join(cwd, 'Tempos de ação', 'tempos.json');
  const result = run(tempos, ['Ação rápida. | Próxima cena!', '--fps=30', `--saida=${output}`], cwd);
  assert.equal(result.status, 0, result.stderr);
  const bytes = fs.readFileSync(output);
  assert.equal(bytes[0], '{'.charCodeAt(0)); // sem BOM UTF-8 ou UTF-16
  const json = JSON.parse(bytes.toString('utf8'));
  assert.equal(json.palavras[0].t, 'Ação');
  assert.equal(json.cenas.length, 2);
  assert.equal(json.cenas[0].inicio_f + json.cenas[0].dur_f, json.cenas[1].inicio_f);
  assert.equal(json.cenas[1].inicio_f + json.cenas[1].dur_f, Math.round(json.fim_fala_s * json.fps));
  for (const p of json.palavras) {
    assert.ok(p.e > p.s);
    assert.equal(json.cenas.filter((c) => p.s >= c.inicio_s && p.s < c.fim_s).length, 1);
  }
}));

test('stdout continua sendo JSON e entradas inválidas não produzem tempos', () => temporario((cwd) => {
  const result = run(tempos, ['Olá mundo.'], cwd);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).fps, 30);
  for (const args of [['| |'], ['Texto', '--fps=0'], ['Texto', '--ritmo=-1'], ['Texto', '--fps=NaN']]) {
    const bad = run(tempos, args, cwd);
    assert.notEqual(bad.status, 0);
    assert.equal(bad.stdout, '');
  }
}));

test('ajuda da transcrição não instala modelos; áudio inexistente falha antes da instalação', () => temporario((cwd) => {
  const help = run(transcrever, ['--help'], cwd);
  assert.equal(help.status, 0, help.stderr);
  const bad = run(transcrever, ['ausente.mp3', 'saida.json'], cwd);
  assert.notEqual(bad.status, 0);
  assert.match(bad.stderr, /não encontrado/);
  assert.equal(fs.existsSync(path.join(cwd, 'saida.json')), false);
  assert.equal(fs.existsSync(path.join(cwd, '.whisper')), false);
}));

test('links locais da skill e do contrato de integração resolvem no pacote', () => {
  for (const file of ['MOTION.md', 'LEIA-ME.md', 'skill/references/integracao-filmmaker.md']) {
    const full = path.join(root, file);
    const body = fs.readFileSync(full, 'utf8');
    for (const match of body.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
      const link = match[1].replace(/^<|>$/g, '');
      if (/^https?:\/\//.test(link) || link.startsWith('#')) continue;
      assert.ok(fs.existsSync(path.resolve(path.dirname(full), link.split('#')[0])), `${file}: ${link}`);
    }
  }
  const principal = path.join(root, '..', 'Skill Edição de Videos com AI Agents.md');
  // O módulo usa os mesmos caminhos relativos na fonte e no pacote instalado.
  if (fs.existsSync(principal)) {
    const body = fs.readFileSync(principal, 'utf8');
    for (const link of ['AI Motion Graphics/MOTION.md', 'AI Motion Graphics/skill/references/integracao-filmmaker.md']) {
      assert.ok(body.includes(`<${link}>`));
      assert.ok(fs.existsSync(path.resolve(path.dirname(principal), link)));
    }
  }
});
