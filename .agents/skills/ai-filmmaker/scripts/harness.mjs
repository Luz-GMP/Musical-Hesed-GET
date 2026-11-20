#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ignoredDirs = new Set(['.git', '.revisoes', 'node_modules', 'out', 'pilotos', 'saida']);
const requiredFiles = [
  'SKILL.md',
  'INSTALACAO.md',
  'Skill Edição de Videos com AI Agents.md',
  'references/direcao-audiovisual.md',
  'references/pipeline-editorial.md',
  'references/harness.md',
  'AI Motion Graphics/MOTION.md',
  'AI Motion Graphics/skill/references/integracao-filmmaker.md',
  'scripts/instalar.mjs',
  'scripts/harness.mjs',
];

const result = (scope, target) => ({
  schema: 'ai-filmmaker.harness-report/v1',
  generatedAt: new Date().toISOString(),
  scope,
  target,
  status: 'pass',
  errors: [],
  warnings: [],
  checks: [],
});

const add = (report, level, code, message, data = undefined) => {
  const entry = { code, message };
  if (data !== undefined) entry.data = data;
  report[level].push(entry);
};

const pass = (report, code, message, data = undefined) => {
  const entry = { code, message };
  if (data !== undefined) entry.data = data;
  report.checks.push(entry);
};

const digest = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

const inside = (base, target) => {
  const rel = path.relative(base, target);
  return rel === '' || (!path.isAbsolute(rel) && rel !== '..' && !rel.startsWith(`..${path.sep}`));
};

const walk = (dir, root = dir) => {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirs.has(entry.name.toLowerCase())) continue;
    const absolute = path.join(dir, entry.name);
    if (entry.isSymbolicLink()) {
      files.push({ path: path.relative(root, absolute).split(path.sep).join('/'), symlink: true });
    } else if (entry.isDirectory()) {
      files.push(...walk(absolute, root));
    } else if (entry.isFile()) {
      files.push({ path: path.relative(root, absolute).split(path.sep).join('/'), symlink: false });
    }
  }
  return files;
};

const safePath = (report, projectRoot, value, label, { mustExist = false } = {}) => {
  if (typeof value !== 'string' || !value.trim()) {
    add(report, 'errors', 'path.invalid', `${label} deve ser um caminho relativo não vazio.`);
    return null;
  }
  if (path.isAbsolute(value)) {
    add(report, 'errors', 'path.absolute', `${label} não pode ser absoluto: ${value}`);
    return null;
  }
  const absolute = path.resolve(projectRoot, value);
  if (!inside(projectRoot, absolute) || absolute === projectRoot) {
    add(report, 'errors', 'path.escape', `${label} escapa da pasta do projeto: ${value}`);
    return null;
  }
  if (mustExist && !fs.existsSync(absolute)) {
    add(report, 'errors', 'path.missing', `${label} não existe: ${value}`);
    return null;
  }
  return absolute;
};

const parseJson = (report, file, label) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    add(report, 'errors', 'json.invalid', `${label} não pôde ser lido como JSON: ${error.message}`);
    return null;
  }
};

const checkMarkdownLinks = (report, file) => {
  const body = fs.readFileSync(file, 'utf8');
  const relativeFile = path.relative(skillRoot, file).split(path.sep).join('/');
  for (const match of body.matchAll(/\[[^\]]+\]\((<[^>]+>|[^)]+)\)/g)) {
    let link = match[1].trim().replace(/^<|>$/g, '').split('#')[0];
    if (!link || /^(?:https?:|mailto:|data:)/i.test(link)) continue;
    link = decodeURIComponent(link);
    const target = path.resolve(path.dirname(file), link);
    if (!inside(skillRoot, target)) {
      add(report, 'errors', 'package.link_escape', `${relativeFile}: link escapa do pacote: ${link}`);
    } else if (!fs.existsSync(target)) {
      add(report, 'errors', 'package.link_missing', `${relativeFile}: link local ausente: ${link}`);
    }
  }
};

const checkPackage = () => {
  const report = result('package', skillRoot);
  for (const relative of requiredFiles) {
    if (!fs.existsSync(path.join(skillRoot, relative))) {
      add(report, 'errors', 'package.required_missing', `Arquivo obrigatório ausente: ${relative}`);
    }
  }

  const files = walk(skillRoot);
  const skillEntries = files.filter((entry) => path.posix.basename(entry.path) === 'SKILL.md');
  if (skillEntries.length !== 1 || skillEntries[0]?.path !== 'SKILL.md') {
    add(report, 'errors', 'package.skill_entries', 'O pacote deve conter somente a entrada SKILL.md da raiz.', skillEntries.map((entry) => entry.path));
  } else {
    pass(report, 'package.skill_entry', 'Entrada única SKILL.md confirmada.');
  }

  const symlinks = files.filter((entry) => entry.symlink);
  if (symlinks.length) add(report, 'errors', 'package.symlink', 'Links simbólicos não são permitidos no pacote.', symlinks.map((entry) => entry.path));

  const secrets = files.filter((entry) => /(^|\/)\.env(?:\.|$)/i.test(entry.path));
  if (secrets.length) add(report, 'errors', 'package.secret_file', 'Arquivos .env não podem fazer parte do pacote.', secrets.map((entry) => entry.path));

  const skillFile = path.join(skillRoot, 'SKILL.md');
  if (fs.existsSync(skillFile)) {
    const body = fs.readFileSync(skillFile, 'utf8');
    if (!/^---\r?\nname:\s*ai-filmmaker\r?\n/m.test(body)) {
      add(report, 'errors', 'package.frontmatter', 'SKILL.md não declara name: ai-filmmaker no frontmatter.');
    }
  }

  for (const relative of requiredFiles.filter((item) => item.endsWith('.md'))) {
    const file = path.join(skillRoot, relative);
    if (fs.existsSync(file)) checkMarkdownLinks(report, file);
  }
  pass(report, 'package.files_scanned', `${files.length} arquivos inspecionados no pacote fonte.`);
  report.status = report.errors.length ? 'fail' : 'pass';
  return report;
};

const checkTranscript = (report, projectRoot, declaration) => {
  if (!declaration) return;
  const file = safePath(report, projectRoot, declaration.path, 'transcript.path', { mustExist: true });
  if (!file) return;
  const data = parseJson(report, file, 'Transcrição');
  if (!data) return;
  const words = data.words;
  if (!Array.isArray(words)) {
    add(report, 'errors', 'transcript.words', 'A transcrição deve conter um array words.');
    return;
  }
  let previousStart = -Infinity;
  words.forEach((word, index) => {
    const prefix = `transcript.words[${index}]`;
    if (typeof word?.text !== 'string' || !word.text.trim()) add(report, 'errors', 'transcript.text', `${prefix}.text é obrigatório.`);
    if (!Number.isFinite(word?.start) || !Number.isFinite(word?.end) || word.start < 0 || word.end <= word.start) {
      add(report, 'errors', 'transcript.interval', `${prefix} possui intervalo inválido.`);
    } else if (word.start < previousStart) {
      add(report, 'errors', 'transcript.order', `${prefix} está fora de ordem temporal.`);
    }
    if ((word?.sourceStart === undefined) !== (word?.sourceEnd === undefined)) {
      add(report, 'errors', 'transcript.source_pair', `${prefix} deve declarar sourceStart e sourceEnd juntos.`);
    } else if (word?.sourceStart !== undefined && (!Number.isFinite(word.sourceStart) || !Number.isFinite(word.sourceEnd) || word.sourceStart < 0 || word.sourceEnd <= word.sourceStart)) {
      add(report, 'errors', 'transcript.source_interval', `${prefix} possui intervalo de fonte inválido.`);
    }
    if (Number.isFinite(word?.start)) previousStart = word.start;
  });
  pass(report, 'transcript.checked', `${words.length} palavras verificadas.`);
};

const checkEditDecisions = (report, projectRoot, declaration) => {
  if (!declaration) return;
  const file = safePath(report, projectRoot, declaration.path, 'editDecisions.path', { mustExist: true });
  if (!file) return;
  const data = parseJson(report, file, 'Decisões de edição');
  if (!data) return;
  const cuts = data.cuts;
  if (!Array.isArray(cuts)) {
    add(report, 'errors', 'edl.cuts', 'As decisões de edição devem conter um array cuts.');
    return;
  }
  const states = new Set(['proposed', 'approved', 'rejected', 'applied']);
  cuts.forEach((cut, index) => {
    const prefix = `editDecisions.cuts[${index}]`;
    if (!Number.isFinite(cut?.start) || !Number.isFinite(cut?.end) || cut.start < 0 || cut.end <= cut.start) {
      add(report, 'errors', 'edl.interval', `${prefix} possui intervalo inválido.`);
    }
    if (!states.has(cut?.state)) add(report, 'errors', 'edl.state', `${prefix}.state é inválido.`);
    if (['approved', 'applied'].includes(cut?.state) && (typeof cut?.reason !== 'string' || !cut.reason.trim())) {
      add(report, 'errors', 'edl.reason', `${prefix} aprovado/aplicado precisa de reason.`);
    }
  });
  pass(report, 'edl.checked', `${cuts.length} decisões de corte verificadas.`);
};

const checkProject = (input) => {
  const projectRoot = path.resolve(input);
  const report = result('project', projectRoot);
  if (!fs.existsSync(projectRoot) || !fs.statSync(projectRoot).isDirectory()) {
    add(report, 'errors', 'project.missing', `Pasta do projeto não encontrada: ${projectRoot}`);
    report.status = 'fail';
    return report;
  }
  const manifestFile = path.join(projectRoot, 'filmmaker.project.json');
  if (!fs.existsSync(manifestFile)) {
    add(report, 'errors', 'project.manifest_missing', 'filmmaker.project.json não foi encontrado na raiz do projeto.');
    report.status = 'fail';
    return report;
  }
  const manifest = parseJson(report, manifestFile, 'Manifesto do projeto');
  if (!manifest) {
    report.status = 'fail';
    return report;
  }

  if (manifest.schema !== 'ai-filmmaker.project/v1') add(report, 'errors', 'project.schema', 'schema deve ser ai-filmmaker.project/v1.');
  if (typeof manifest.project?.id !== 'string' || !manifest.project.id.trim()) add(report, 'errors', 'project.id', 'project.id é obrigatório.');
  if (typeof manifest.project?.title !== 'string' || !manifest.project.title.trim()) add(report, 'warnings', 'project.title', 'project.title não foi informado.');

  const delivery = manifest.delivery;
  if (!delivery || !Number.isInteger(delivery.width) || delivery.width <= 0 || !Number.isInteger(delivery.height) || delivery.height <= 0 || !Number.isFinite(delivery.fps) || delivery.fps <= 0) {
    add(report, 'errors', 'delivery.geometry', 'delivery precisa declarar width, height e fps positivos.');
  }
  if (!['draft', 'review', 'approved', 'final'].includes(delivery?.status)) add(report, 'errors', 'delivery.status', 'delivery.status deve ser draft, review, approved ou final.');
  if (!manifest.timeline?.musicMode) add(report, 'warnings', 'timeline.music_mode', 'timeline.musicMode não foi declarado; prefira global para continuidade.');
  if (manifest.timeline?.musicMode === 'per-scene') add(report, 'warnings', 'timeline.music_restart', 'musicMode per-scene pode reiniciar a trilha nas emendas; justifique e confira o filme integral.');

  const assets = Array.isArray(manifest.assets) ? manifest.assets : [];
  if (!Array.isArray(manifest.assets)) add(report, 'errors', 'assets.array', 'assets deve ser um array.');
  if (!assets.length) add(report, 'warnings', 'assets.empty', 'Nenhum asset foi registrado no ledger.');
  const assetIds = new Set();
  const assetStates = new Set(['planned', 'ready', 'approved', 'blocked', 'rejected']);
  for (const [index, asset] of assets.entries()) {
    const label = `assets[${index}]`;
    if (typeof asset?.id !== 'string' || !asset.id.trim()) add(report, 'errors', 'asset.id', `${label}.id é obrigatório.`);
    else if (assetIds.has(asset.id)) add(report, 'errors', 'asset.duplicate', `ID de asset duplicado: ${asset.id}`);
    else assetIds.add(asset.id);
    if (!assetStates.has(asset?.status)) add(report, 'errors', 'asset.status', `${label}.status é inválido.`);
    const mustExist = ['ready', 'approved'].includes(asset?.status);
    const file = asset?.path ? safePath(report, projectRoot, asset.path, `${label}.path`, { mustExist }) : null;
    if (mustExist && !asset?.path) add(report, 'errors', 'asset.path_required', `${label} pronto/aprovado precisa de path.`);
    if (mustExist && (typeof asset?.provenance !== 'string' || !asset.provenance.trim())) add(report, 'errors', 'asset.provenance', `${label} pronto/aprovado precisa de provenance.`);
    if (mustExist && (typeof asset?.rights !== 'string' || !asset.rights.trim())) add(report, 'errors', 'asset.rights', `${label} pronto/aprovado precisa de rights.`);
    if (mustExist && !/^[a-f0-9]{64}$/.test(asset?.sha256 ?? '')) add(report, 'errors', 'asset.sha256', `${label} pronto/aprovado precisa de sha256 minúsculo.`);
    if (file && fs.existsSync(file) && /^[a-f0-9]{64}$/.test(asset?.sha256 ?? '') && digest(file) !== asset.sha256) {
      add(report, 'errors', 'asset.hash_mismatch', `${label} teve o conteúdo alterado: ${asset.path}`);
    }
  }

  const scenes = manifest.scenes;
  if (!Array.isArray(scenes) || !scenes.length) add(report, 'errors', 'scenes.empty', 'scenes deve conter pelo menos uma cena.');
  const sceneIds = new Set();
  const sceneStates = new Set(['planned', 'production', 'review', 'approved', 'blocked']);
  const layerRoles = new Set(['background', 'intermediate', 'content', 'foreground']);
  for (const [index, scene] of (Array.isArray(scenes) ? scenes : []).entries()) {
    const label = `scenes[${index}]`;
    if (typeof scene?.id !== 'string' || !scene.id.trim()) add(report, 'errors', 'scene.id', `${label}.id é obrigatório.`);
    else if (sceneIds.has(scene.id)) add(report, 'errors', 'scene.duplicate', `ID de cena duplicado: ${scene.id}`);
    else sceneIds.add(scene.id);
    if (!Number.isInteger(scene?.version) || scene.version < 1) add(report, 'errors', 'scene.version', `${label}.version deve ser inteiro positivo.`);
    if (!sceneStates.has(scene?.status)) add(report, 'errors', 'scene.status', `${label}.status é inválido.`);
    if (!Number.isFinite(scene?.durationSec) || scene.durationSec <= 0) add(report, 'errors', 'scene.duration', `${label}.durationSec deve ser positivo.`);
    if (!Array.isArray(scene?.layers) || !scene.layers.length) add(report, 'errors', 'scene.layers', `${label} precisa declarar o plano de camadas.`);
    for (const [layerIndex, layer] of (Array.isArray(scene?.layers) ? scene.layers : []).entries()) {
      if (!layerRoles.has(layer?.role)) add(report, 'errors', 'layer.role', `${label}.layers[${layerIndex}].role é inválido.`);
      if (layer?.assetId && !assetIds.has(layer.assetId)) add(report, 'errors', 'layer.asset', `${label}.layers[${layerIndex}] referencia asset inexistente: ${layer.assetId}`);
    }
    const audio = scene?.audio;
    for (const stem of ['voice', 'music', 'ambience', 'sfx']) {
      if (!Array.isArray(audio?.[stem])) add(report, 'errors', 'scene.audio', `${label}.audio.${stem} deve ser um array, mesmo quando vazio.`);
    }
    if (!Array.isArray(scene?.approvals)) add(report, 'errors', 'scene.approvals', `${label}.approvals deve ser um array.`);
    if (scene?.status === 'approved') {
      const approved = scene.approvals?.some((approval) => approval?.version === scene.version && approval?.state === 'approved');
      if (!approved) add(report, 'errors', 'scene.approval_missing', `${label} está aprovada sem aprovação da versão ${scene.version}.`);
    }
  }

  if (manifest.workflow?.currentScene && !sceneIds.has(manifest.workflow.currentScene)) {
    add(report, 'errors', 'workflow.current_scene', `workflow.currentScene não existe: ${manifest.workflow.currentScene}`);
  }

  const expectedCapabilities = ['semanticMediaIndex', 'externalTimeline', 'backgroundRemoval', 'lipSync'];
  const capabilityStates = new Set(['not-planned', 'proposed', 'ready', 'applied', 'blocked']);
  if (!manifest.capabilities || typeof manifest.capabilities !== 'object' || Array.isArray(manifest.capabilities)) {
    add(report, 'warnings', 'capabilities.missing', 'capabilities não foi declarado; registre recursos opcionais explicitamente.');
  } else {
    for (const name of expectedCapabilities) {
      const capability = manifest.capabilities[name];
      if (!capability) {
        add(report, 'warnings', 'capability.undeclared', `Capacidade opcional não declarada: ${name}`);
        continue;
      }
      if (!capabilityStates.has(capability.status)) add(report, 'errors', 'capability.status', `${name}.status é inválido.`);
      if (['ready', 'applied'].includes(capability.status)) {
        if (!Array.isArray(capability.evidence) || !capability.evidence.length) {
          add(report, 'errors', 'capability.evidence', `${name} pronta/aplicada precisa de evidence.`);
        } else {
          capability.evidence.forEach((evidence, index) => safePath(report, projectRoot, evidence, `${name}.evidence[${index}]`, { mustExist: true }));
        }
      }
    }
  }

  checkTranscript(report, projectRoot, manifest.transcript);
  checkEditDecisions(report, projectRoot, manifest.editDecisions);

  if (delivery?.status === 'final') {
    const pending = (Array.isArray(scenes) ? scenes : []).filter((scene) => scene?.status !== 'approved').map((scene) => scene?.id ?? '(sem id)');
    if (pending.length) add(report, 'errors', 'final.unapproved_scenes', 'Entrega final possui cenas não aprovadas.', pending);
    if (!delivery.output) add(report, 'errors', 'final.output_missing', 'Entrega final precisa declarar delivery.output.');
    else safePath(report, projectRoot, delivery.output, 'delivery.output', { mustExist: true });
  }

  pass(report, 'project.summary', `${assets.length} assets e ${Array.isArray(scenes) ? scenes.length : 0} cenas verificados.`);
  report.status = report.errors.length ? 'fail' : 'pass';
  return report;
};

const printHuman = (report) => {
  console.log(`AI Filmmaker Harness: ${report.status.toUpperCase()}`);
  console.log(`Escopo: ${report.scope}`);
  console.log(`Alvo: ${report.target}`);
  for (const check of report.checks) console.log(`PASS [${check.code}] ${check.message}`);
  for (const warning of report.warnings) console.log(`WARN [${warning.code}] ${warning.message}`);
  for (const error of report.errors) console.log(`FAIL [${error.code}] ${error.message}`);
  console.log(`Resumo: ${report.errors.length} erro(s), ${report.warnings.length} aviso(s), ${report.checks.length} verificação(ões).`);
};

const args = process.argv.slice(2);
const json = args.includes('--json');
const positional = args.filter((arg) => arg !== '--json');
if (positional.includes('--help') || positional.length === 0) {
  console.log('Uso: node scripts/harness.mjs package [--json] | project <pasta> [--json]');
  process.exit(positional.length === 0 ? 1 : 0);
}

let report;
if (positional[0] === 'package' && positional.length === 1) report = checkPackage();
else if (positional[0] === 'project' && positional.length === 2) report = checkProject(positional[1]);
else {
  console.error('Uso: node scripts/harness.mjs package [--json] | project <pasta> [--json]');
  process.exit(1);
}

if (json) console.log(JSON.stringify(report, null, 2));
else printHuman(report);
process.exitCode = report.status === 'pass' ? 0 : 1;
