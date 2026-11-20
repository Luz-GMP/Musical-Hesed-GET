#!/usr/bin/env node
// Instala um único pacote ai-filmmaker, incluindo Motion, sem depender de shell ou agente.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifesto = 'pacote-instalado.json';
const itens = ['SKILL.md', 'INSTALACAO.md', 'Skill Edição de Videos com AI Agents.md',
  'Extração de Timestamps Palavra por Palavra (Python + Faster-Whisper).py',
  'Gerador de Efeitos Sonoros Procedurais + Detector de Batidas Musicais (Beat Tracking) em Python.py',
  'Narração com Voz Clonada (ElevenLabs API) + Sincronização Automática.sh',
  'Suporte a Qualquer FPS + Auditor Matemático de DOM + Prancha de Storyboard.js',
  "mkdir -p .ref'frames.sh", 'ffmpeg -y -i video_visual.mp4 -i narracao.mp3 -i sfx_track.wav',
  'AI Motion Graphics', 'references', 'scripts'];
const excluir = new Set(['node_modules', 'out', 'saida', '.whisper', '.git', '.ds_store']);
const digest = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const dentro = (a, b) => {
  const rel = path.relative(a, b);
  return !rel || (rel !== '..' && !rel.startsWith(`..${path.sep}`) && !path.isAbsolute(rel));
};
const fisico = (p) => fs.existsSync(p) ? fs.realpathSync(p) : path.join(fisico(path.dirname(p)), path.basename(p));
const listar = (base, dir, filtrar = false) => {
  const lista = [];
  for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
    if (filtrar && (excluir.has(entrada.name.toLowerCase()) || /^\.env(?:\.|$)/i.test(entrada.name))) continue;
    const abs = path.join(dir, entrada.name);
    if (entrada.isSymbolicLink()) throw new Error(`Link simbólico/junction não permitido no pacote: ${abs}`);
    if (entrada.isDirectory()) lista.push(...listar(base, abs, filtrar));
    else if (entrada.isFile()) lista.push(path.relative(base, abs).split(path.sep).join('/'));
  }
  return lista;
};

try {
  const args = process.argv.slice(2);
  if (args[0] === '--help') {
    console.log('Uso: node scripts/instalar.mjs <destino-novo> | --verificar <destino>');
    process.exit(0);
  }
  const verificar = args[0] === '--verificar';
  const destino = args[verificar ? 1 : 0];
  if (!destino || args.length !== (verificar ? 2 : 1)) throw new Error('Informe somente o destino, ou --verificar <destino>.');
  const alvo = fisico(path.resolve(destino));
  if (verificar) {
    const manifest = JSON.parse(fs.readFileSync(path.join(alvo, manifesto), 'utf8'));
    if (manifest.schema !== 1 || manifest.name !== 'ai-filmmaker' || !Array.isArray(manifest.files)) throw new Error('Manifesto inválido.');
    const esperados = new Set();
    for (const file of manifest.files) {
      const abs = path.resolve(alvo, file.path);
      if (!dentro(alvo, abs) || abs === alvo || esperados.has(file.path)) throw new Error('Caminho inválido/duplicado no manifesto.');
      esperados.add(file.path);
      if (!fs.existsSync(abs) || fs.statSync(abs).size !== file.bytes || digest(abs) !== file.sha256) {
        throw new Error(`Arquivo ausente ou alterado: ${file.path}`);
      }
    }
    const reais = listar(alvo, alvo).filter((p) => p !== manifesto);
    if (reais.length !== esperados.size || reais.some((p) => !esperados.has(p))) throw new Error('A instalação contém arquivos não previstos no manifesto.');
    if (reais.filter((p) => path.posix.basename(p) === 'SKILL.md').join() !== 'SKILL.md') throw new Error('O pacote deve conter uma única entrada SKILL.md.');
    console.log(`Integridade confirmada: ${esperados.size} arquivos, uma skill ai-filmmaker, Motion incluído.\n${alvo}`);
    process.exit(0);
  }
  const origem = fs.realpathSync(root);
  if (dentro(origem, alvo) || dentro(alvo, origem)) throw new Error('Escolha destino separado da pasta fonte, sem sobreposição.');
  if (fs.existsSync(alvo) && (!fs.statSync(alvo).isDirectory() || fs.readdirSync(alvo).length)) throw new Error('Destino ocupado; nenhuma atualização/sobrescrita automática será feita.');
  const files = [];
  for (const item of itens) {
    const abs = path.join(origem, item);
    const stat = fs.lstatSync(abs);
    if (stat.isSymbolicLink()) throw new Error(`Link simbólico não permitido: ${item}`);
    files.push(...(stat.isDirectory() ? listar(origem, abs, true) : [item]));
  }
  if (files.filter((p) => path.posix.basename(p) === 'SKILL.md').join() !== 'SKILL.md') {
    throw new Error('Há outra entrada SKILL.md dentro do pacote; o módulo Motion deve usar MOTION.md.');
  }
  const manifestFiles = files.sort().map((file) => ({ path: file, sha256: digest(path.join(origem, file)), bytes: fs.statSync(path.join(origem, file)).size }));
  for (const file of files) {
    const target = path.join(alvo, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(path.join(origem, file), target, fs.constants.COPYFILE_EXCL);
  }
  fs.writeFileSync(path.join(alvo, manifesto), JSON.stringify({ schema: 1, name: 'ai-filmmaker', installedAt: new Date().toISOString(), files: manifestFiles }, null, 2) + '\n', { flag: 'wx' });
  console.log(`AI Filmmaker instalado com Motion incluído: ${alvo}\n${files.length} arquivos. Nenhuma dependência foi instalada e nenhuma configuração do agente foi alterada.`);
} catch (error) {
  console.error(`Instalação/verificação interrompida: ${error.message}`);
  process.exitCode = 1;
}
