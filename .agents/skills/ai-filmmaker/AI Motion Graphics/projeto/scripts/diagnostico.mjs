#!/usr/bin/env node
// Diagnóstico sem instalar pacotes, abrir portas ou baixar navegador/modelos.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(root, 'package.json'));
let falhas = 0;
const verificar = (ok, texto) => {
  console.log(`${ok ? 'OK' : 'FALHA'}: ${texto}`);
  if (!ok) falhas++;
};
console.log(`Projeto: ${root}\nNode: ${process.version}\nPlataforma: ${process.platform}/${process.arch}`);
verificar(Number(process.versions.node.split('.')[0]) >= 18, 'Node >= 18 (22+ recomendado)');
for (const arquivo of ['package.json', 'package-lock.json', 'src/index.ts', 'src/Root.tsx',
  'public/fonts/Inter-Variable.ttf', 'public/fonts/JetBrainsMono-Regular.ttf',
  'public/fonts/JetBrainsMono-Bold.ttf', 'public/fonts/OFL-Inter.txt', 'public/fonts/JetBrainsMono-OFL.txt']) {
  verificar(fs.existsSync(path.join(root, arquivo)), arquivo);
}
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
for (const [nome, esperado] of Object.entries({ ...pkg.dependencies, ...pkg.devDependencies })) {
  try {
    const instalado = JSON.parse(fs.readFileSync(require.resolve(`${nome}/package.json`), 'utf8')).version;
    verificar(instalado === esperado, `${nome}: ${instalado} (esperado ${esperado})`);
  } catch {
    verificar(false, `${nome} ausente; instale as dependências na pasta do projeto com npm ci`);
  }
}
console.log('INFO: navegador headless e whisper.cpp/modelos são verificações separadas. Nenhum download executado.');
console.log('INFO: este diagnóstico não comprova render, reprodução de áudio ou inspeção visual.');
process.exitCode = falhas ? 1 : 0;
