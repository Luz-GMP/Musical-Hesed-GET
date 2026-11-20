#!/usr/bin/env node
/* Quadros soltos para conferir (um bundle só, apagado no fim):
     node scripts/stills.mjs <composicao> <pastaSaida> <escala> <q1> <q2> ...
   Ex.: node scripts/stills.mjs Demo out/stills 0.5 20 120 240
   Outra composição no mesmo bundle: escreva Composicao@quadro (ex.: T-glitchRGB@36 M-04@40).
   Saída: <pastaSaida>/<composicao>-q0020.jpg ... (abra e olhe antes de renderizar o vídeo). */
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';

const [id, saida, escala = '0.5', ...quadros] = process.argv.slice(2);
if (!id || !saida || quadros.length === 0) {
  console.error('Uso: node scripts/stills.mjs <composicao> <pastaSaida> <escala> <q1> <q2> ...');
  process.exit(1);
}
const escalaNum = Number(escala);
if (!Number.isFinite(escalaNum) || escalaNum <= 0 || escalaNum > 1) {
  throw new Error('Escala deve estar no intervalo (0, 1].');
}
const pedidos = quadros.map((item) => {
  const partes = item.includes('@') ? item.split('@') : [id, item];
  const [cid, q] = partes;
  const frame = Number(q);
  if (partes.length !== 2 || !/^[a-zA-Z0-9-]+$/.test(cid) || !Number.isInteger(frame) || frame < 0) {
    throw new Error(`Composição/quadro inválido: ${item}`);
  }
  return { cid, frame };
});
const pastaSaida = path.resolve(saida);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(root);
fs.mkdirSync(pastaSaida, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts') });
try {
  const comps = new Map();
  const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE || undefined;
  for (const { cid, frame } of pedidos) {
    if (!comps.has(cid)) comps.set(cid, await selectComposition({ serveUrl, id: cid, browserExecutable }));
    if (frame >= comps.get(cid).durationInFrames) throw new Error(`Quadro ${frame} fora da composição ${cid}.`);
    const arquivo = path.join(pastaSaida, `${cid}-q${String(frame).padStart(4, '0')}.jpg`);
    await renderStill({ serveUrl, composition: comps.get(cid), frame, scale: escalaNum, output: arquivo, imageFormat: 'jpeg', jpegQuality: 85, browserExecutable });
    console.log('ok', arquivo);
  }
} finally {
  fs.rmSync(serveUrl, { recursive: true, force: true });
}
