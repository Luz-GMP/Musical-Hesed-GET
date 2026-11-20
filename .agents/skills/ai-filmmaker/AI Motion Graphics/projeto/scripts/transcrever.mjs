#!/usr/bin/env node
/* Áudio de narração → tempos.json (início e fim de cada palavra), com whisper.cpp rodando no seu
   computador (nada sai da máquina). Cada frase (termina em . ? !) vira uma cena; ajuste depois.

   Precisa, uma vez:  npm i -D @remotion/install-whisper-cpp@4.0.409
   (na primeira execução ele baixa e compila o whisper.cpp e baixa o modelo em .whisper/; em Mac e
   Linux precisa de git, make e um compilador C; no Windows baixa o executável pronto)

   Uso:  node scripts/transcrever.mjs public/narracao.mp3 src/videos/meu/tempos.json [--modelo=small] [--idioma=pt]
   Modelos: tiny, base, small (padrão: bom em português), medium (melhor, mais pesado). */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
if (args.includes('--help')) {
  console.log('Uso: node scripts/transcrever.mjs <audio> <saida/tempos.json> [--modelo=small] [--idioma=pt] [--fps=30]');
  console.log('Requer @remotion/install-whisper-cpp opcional; pode baixar executável/modelo. Nenhuma API de voz é utilizada.');
  process.exit(0);
}
const opc = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('=')));
const [entrada, saida] = args.filter((a) => !a.startsWith('--'));
if (!entrada || !saida) {
  console.error('Uso: node scripts/transcrever.mjs <audio> <saida/tempos.json> [--modelo=small] [--idioma=pt] [--fps=30]');
  process.exit(1);
}
const fps = Number(opc.fps ?? 30);
if (!Number.isFinite(fps) || fps <= 0) {
  console.error('FPS deve ser um número positivo e finito.');
  process.exit(1);
}
const arquivoEntrada = path.resolve(entrada);
const arquivoSaida = path.resolve(saida);
if (!fs.existsSync(arquivoEntrada) || !fs.statSync(arquivoEntrada).isFile()) {
  console.error('Arquivo de áudio não encontrado:', arquivoEntrada);
  process.exit(1);
}
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(root, 'package.json'));
let w;
try {
  w = await import('@remotion/install-whisper-cpp');
} catch {
  console.error('Falta o pacote. Rode: npm i -D @remotion/install-whisper-cpp@4.0.409');
  process.exit(1);
}
const VERSAO = '1.5.5';
const modelo = opc.modelo ?? 'small';
const pasta = path.join(root, '.whisper');
const wav = path.join(pasta, 'entrada-16k.wav');
fs.mkdirSync(pasta, { recursive: true });

// whisper.cpp só lê WAV 16 kHz mono: converte com o ffmpeg que vem com o Remotion
// Executa o JS da CLI já instalada com Node; não tenta executar .cmd sem shell no Windows
// e não deixa npx buscar outra versão do Remotion na rede.
const cliPackage = require.resolve('@remotion/cli/package.json');
const cliBin = JSON.parse(fs.readFileSync(cliPackage, 'utf8')).bin;
const cli = path.resolve(path.dirname(cliPackage), typeof cliBin === 'string' ? cliBin : cliBin.remotion);
execFileSync(process.execPath, [cli, 'ffmpeg', '-y', '-loglevel', 'error', '-i', arquivoEntrada, '-ar', '16000', '-ac', '1', wav], { cwd: root, stdio: 'inherit' });

await w.installWhisperCpp({ to: pasta, version: VERSAO, printOutput: true });
await w.downloadWhisperModel({ model: modelo, folder: pasta, printOutput: true });
const resultado = await w.transcribe({
  inputPath: wav,
  whisperPath: pasta,
  whisperCppVersion: VERSAO,
  model: modelo,
  tokenLevelTimestamps: true,
  language: opc.idioma ?? 'pt',
  splitOnWord: true,
  printOutput: false,
});
const { captions } = w.toCaptions({ whisperCppOutput: resultado });
const r2 = (v) => Math.round(v * 100) / 100;
const palavras = captions
  .map((c) => ({ t: c.text.trim(), s: r2(c.startMs / 1000), e: r2(c.endMs / 1000) }))
  .filter((p) => p.t && !/^\[.*\]$/.test(p.t));
if (palavras.length === 0) {
  console.error('Nenhuma palavra reconhecida.');
  process.exit(1);
}
const cenas = [];
let inicio = 0;
palavras.forEach((p, i) => {
  const fimFrase = /[.?!…]$/.test(p.t) || i === palavras.length - 1;
  if (fimFrase) {
    const proxima = palavras[i + 1];
    const fim = proxima ? proxima.s : p.e;
    cenas.push({ cena: cenas.length + 1, inicio_s: r2(inicio), fim_s: r2(fim), inicio_f: Math.round(inicio * fps), dur_f: Math.round(fim * fps) - Math.round(inicio * fps) });
    inicio = fim;
  }
});
cenas[0].inicio_s = 0;
cenas[0].inicio_f = 0;
fs.mkdirSync(path.dirname(arquivoSaida), { recursive: true });
fs.writeFileSync(arquivoSaida, JSON.stringify({ fps, fim_fala_s: palavras[palavras.length - 1].e, cenas, palavras }, null, 1) + '\n', 'utf8');
console.log(`ok: ${palavras.length} palavras, ${cenas.length} cenas → ${saida}`);
console.log('Confira o texto das palavras (o whisper pode errar a grafia) e corrija no JSON; os tempos ficam.');
