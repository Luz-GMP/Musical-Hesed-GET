import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const script = path.join(root, 'scripts/instalar.mjs');
const run = (args, cwd) => spawnSync(process.execPath, [script, ...args], { cwd, encoding: 'utf8' });
const temp = (fn) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'filmmaker-pacote-'));
  try { fn(dir); } finally {
    assert.equal(path.dirname(dir), fs.realpathSync(os.tmpdir()));
    fs.rmSync(dir, { recursive: true, force: true });
  }
};

test('instala pacote único em outro cwd, preserva módulo e verifica hashes', () => temp((cwd) => {
  const dest = path.join(cwd, 'Instalação com espaços', 'ai-filmmaker');
  const install = run([dest], cwd);
  assert.equal(install.status, 0, install.stderr);
  const manifest = JSON.parse(fs.readFileSync(path.join(dest, 'pacote-instalado.json'), 'utf8'));
  assert.ok(manifest.files.some((f) => f.path === 'AI Motion Graphics/MOTION.md'));
  assert.ok(manifest.files.some((f) => f.path === 'references/direcao-audiovisual.md'));
  assert.ok(manifest.files.some((f) => f.path === 'references/pipeline-editorial.md'));
  assert.ok(manifest.files.some((f) => f.path === 'references/harness.md'));
  assert.ok(manifest.files.some((f) => f.path === 'scripts/harness.mjs'));
  assert.ok(manifest.files.some((f) => f.path === 'AI Motion Graphics/projeto/public/fonts/Inter-Variable.ttf'));
  assert.deepEqual(manifest.files.filter((f) => path.posix.basename(f.path) === 'SKILL.md').map((f) => f.path), ['SKILL.md']);
  for (const f of manifest.files) assert.ok(!/node_modules|\/out\/|\.env|\.DS_Store|pilotos\//i.test(f.path), f.path);
  assert.equal(run(['--verificar', dest], cwd).status, 0);
  assert.notEqual(run([dest], cwd).status, 0);
  assert.equal(run(['--verificar', dest], cwd).status, 0);
  fs.appendFileSync(path.join(dest, 'SKILL.md'), '\nmodificação local\n');
  assert.notEqual(run(['--verificar', dest], cwd).status, 0);
}));

test('recusa origem/destino sobrepostos sem gravar na fonte', () => temp((cwd) => {
  const dest = path.join(root, 'nao-instalar');
  assert.notEqual(run([dest], cwd).status, 0);
  assert.equal(fs.existsSync(dest), false);
  assert.notEqual(run([root], cwd).status, 0);
}));

test('entrada principal aponta para documentos e módulo incluídos', () => {
  const skill = fs.readFileSync(path.join(root, 'SKILL.md'), 'utf8');
  assert.match(skill, /^---\r?\nname: ai-filmmaker\r?\n/);
  for (const match of skill.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    const link = match[1].replace(/^<|>$/g, '');
    assert.ok(fs.existsSync(path.join(root, link)), link);
  }
  assert.equal(fs.existsSync(path.join(root, 'AI Motion Graphics/SKILL.md')), false);
});
