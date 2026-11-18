#!/usr/bin/env node
// Cópia local sem shell, npm ou configuração específica de agente.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [modo, destino, ...extras] = process.argv.slice(2);
if (modo === '--help') {
  console.log('Uso: node preparar.mjs projeto <pasta-destino-nova-ou-vazia>. Para instalar a skill inteira, use scripts/instalar.mjs na raiz do Filmmaker.');
  process.exit(0);
}
try {
  if (modo !== 'projeto' || !destino || extras.length) {
    throw new Error('Uso: node preparar.mjs projeto <pasta-destino-nova-ou-vazia>. Instale o pacote inteiro pelo scripts/instalar.mjs da raiz do Filmmaker.');
  }
  const origem = fs.realpathSync(path.join(raiz, 'projeto'));
  // Resolve também ancestrais com symlink/junction antes de decidir se a cópia é recursiva.
  const realDestino = (p) => {
    if (fs.existsSync(p)) return fs.realpathSync(p);
    return path.join(realDestino(path.dirname(p)), path.basename(p));
  };
  const alvo = realDestino(path.resolve(destino));
  const contem = (a, b) => {
    const r = path.relative(a, b);
    return r === '' || (r !== '..' && !r.startsWith(`..${path.sep}`) && !path.isAbsolute(r));
  };
  if (contem(origem, alvo) || contem(alvo, origem)) {
    throw new Error('Origem e destino não podem ser iguais nem conter um ao outro.');
  }
  if (fs.existsSync(alvo) && (!fs.statSync(alvo).isDirectory() || fs.readdirSync(alvo).length)) {
    throw new Error('Destino ocupado: reutilize/revise o projeto existente ou escolha outra pasta.');
  }
  const excluir = new Set(['node_modules', 'out', 'saida', '.whisper', '.git', '.ds_store']);
  fs.cpSync(origem, alvo, {
    recursive: true,
    force: false,
    errorOnExist: true,
    filter: (p) => !path.relative(origem, p).split(path.sep).some((parte) => excluir.has(parte.toLowerCase())),
  });
  console.log(`Projeto preparado em: ${alvo}`);
  console.log('Nenhuma dependência foi instalada. Execute os próximos comandos nessa pasta conforme o LEIA-ME.');
} catch (error) {
  console.error(`Preparação interrompida: ${error.message}`);
  process.exitCode = 1;
}
