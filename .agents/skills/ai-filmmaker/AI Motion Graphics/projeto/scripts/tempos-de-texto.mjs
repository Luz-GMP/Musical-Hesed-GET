#!/usr/bin/env node
/* Gera um tempos.json a partir de um texto, para vídeos SEM narração.
   Cada "|" separa uma cena. O ritmo imita uma fala natural (~3 palavras por segundo, como o filme):
   palavra = 0,16 s + 0,04 s por letra (entre 0,18 e 0,70 s), 0,06 s entre palavras, +0,18 s depois
   de vírgula, +0,35 s depois de ponto/interrogação/exclamação, 0,40 s antes da primeira palavra e
   0,30 s de respiro em cada troca de cena.

   Uso:  node scripts/tempos-de-texto.mjs "Primeira cena aqui. | Segunda cena." > src/videos/meu/tempos.json
   Opções: --ritmo=1.2 (mais lento) ou --ritmo=0.85 (mais rápido); --fps=30
   --saida=src/videos/meu/tempos.json grava UTF-8 sem depender do shell. */
import fs from 'node:fs';
import path from 'node:path';
const args = process.argv.slice(2);
if (args.includes('--help')) {
  console.log('Uso: node scripts/tempos-de-texto.mjs "cena 1 | cena 2" [--ritmo=1] [--fps=30] [--saida=arquivo.json]');
  process.exit(0);
}
const opc = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('=')));
const texto = args.filter((a) => !a.startsWith('--')).join(' ').trim();
if (!texto) {
  console.error('Uso: node scripts/tempos-de-texto.mjs "texto da cena 1 | texto da cena 2" [--ritmo=1] [--fps=30]');
  process.exit(1);
}
const ritmo = Number(opc.ritmo ?? 1);
const fps = Number(opc.fps ?? 30);
if (!Number.isFinite(ritmo) || ritmo <= 0 || !Number.isFinite(fps) || fps <= 0) {
  console.error('Ritmo e FPS devem ser números positivos e finitos.');
  process.exit(1);
}
if (!texto.split('|').some((c) => c.trim())) {
  console.error('Informe pelo menos uma cena com texto.');
  process.exit(1);
}
const r2 = (v) => Math.round(v * 100) / 100;

const palavras = [];
const cenas = [];
let t = 0.4 * ritmo;
texto.split('|').map((c) => c.trim()).filter(Boolean).forEach((cena, i, todas) => {
  const inicio = i === 0 ? 0 : t;
  cena.split(/\s+/).forEach((w) => {
    const letras = w.replace(/[^\p{L}\p{N}]/gu, '').length || 1;
    const dur = Math.min(0.7, Math.max(0.18, 0.16 + 0.04 * letras)) * ritmo;
    palavras.push({ t: w, s: r2(t), e: r2(t + dur) });
    t += dur + 0.06 * ritmo;
    if (/[,;:]$/.test(w)) t += 0.18 * ritmo;
    if (/[.?!…]$/.test(w)) t += 0.35 * ritmo;
  });
  if (i < todas.length - 1) t += 0.3 * ritmo;
  cenas.push({ cena: i + 1, inicio_s: r2(inicio), fim_s: 0, inicio_f: Math.round(inicio * fps), dur_f: 0 });
});
const fim = palavras[palavras.length - 1].e;
cenas.forEach((c, i) => {
  c.fim_s = i + 1 < cenas.length ? cenas[i + 1].inicio_s : r2(fim);
  c.dur_f = (i + 1 < cenas.length ? cenas[i + 1].inicio_f : Math.round(fim * fps)) - c.inicio_f;
});
const json = JSON.stringify({ fps, fim_fala_s: r2(fim), cenas, palavras }, null, 1) + '\n';
if (opc.saida) {
  fs.mkdirSync(path.dirname(path.resolve(opc.saida)), { recursive: true });
  fs.writeFileSync(opc.saida, json, 'utf8');
  console.error(`ok: tempos estimados gravados em ${path.resolve(opc.saida)}`);
} else {
  process.stdout.write(json);
}
