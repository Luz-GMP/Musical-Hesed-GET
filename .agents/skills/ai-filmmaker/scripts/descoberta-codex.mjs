#!/usr/bin/env node
// Consulta o runtime local: initialize + skills/list. Não inicia thread/turn nem chama modelo.
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const options = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const i = arg.indexOf('=');
  return [arg.slice(0, i).replace(/^--/, ''), arg.slice(i + 1)];
}));
if (!options.cli) {
  console.error('Uso: node scripts/descoberta-codex.mjs --cli=<codex.js-ou-exe> [--cwd=<pasta>] [--saida=<relatorio.json>]');
  process.exit(1);
}
const cli = path.resolve(options.cli);
const cwd = path.resolve(options.cwd || process.cwd());
if (!fs.existsSync(cli)) throw new Error('CLI Codex não encontrada no caminho informado.');
const js = /\.[cm]?js$/i.test(cli);
const child = spawn(js ? process.execPath : cli, [...(js ? [cli] : []), 'app-server', '--stdio'], { cwd, stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true });
let buffer = '';
let finished = false;
const finish = (error, report) => {
  if (finished) return;
  finished = true;
  clearTimeout(timer);
  child.stdin.end();
  child.kill();
  if (error) {
    console.error(`Descoberta não confirmada: ${error}`);
    process.exitCode = 1;
    return;
  }
  if (options.saida) {
    const target = path.resolve(options.saida);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, JSON.stringify(report, null, 2) + '\n', 'utf8');
  }
  console.log(JSON.stringify(report, null, 2));
};
const timer = setTimeout(() => finish('Timeout consultando skills/list (30 s).'), 30000);
const send = (msg) => child.stdin.write(JSON.stringify(msg) + '\n');
child.on('error', (e) => finish(e.message));
child.on('exit', () => { if (!finished) finish('O app-server encerrou antes de retornar skills/list.'); });
child.stdin.on('error', (e) => finish(e.message));
child.stderr.on('data', () => {}); // logs de outras skills/configurações não são exportados
child.stdout.on('data', (data) => {
  buffer += data.toString();
  let index;
  while ((index = buffer.indexOf('\n')) >= 0) {
    const line = buffer.slice(0, index);
    buffer = buffer.slice(index + 1);
    let msg;
    try { msg = JSON.parse(line); } catch { continue; }
    if (msg.id === 1) {
      if (msg.error) return finish(msg.error.message);
      send({ method: 'initialized', params: {} });
      send({ id: 2, method: 'skills/list', params: { cwds: [cwd], forceReload: true } });
    }
    if (msg.id === 2) {
      if (msg.error) return finish(msg.error.message);
      const lists = msg.result?.data || [];
      const matches = lists.flatMap((item) => item.skills || []).filter((skill) => skill.name === 'ai-filmmaker');
      if (matches.length !== 1) return finish(`Esperada uma skill ai-filmmaker; encontradas ${matches.length}.`);
      const skill = matches[0];
      if (skill.enabled === false) return finish('A skill foi descoberta, mas está desabilitada.');
      finish(null, { checkedAt: new Date().toISOString(), runtime: 'codex app-server / skills/list', cwd,
        name: skill.name, path: skill.path, enabled: skill.enabled, scope: skill.scope,
        confirmed: true, note: 'Confirma descoberta neste runtime; sessões já abertas podem precisar atualizar a lista.' });
    }
  }
});
send({ id: 1, method: 'initialize', params: { clientInfo: { name: 'filmmaker-validation', version: '1.0.0' }, capabilities: { experimentalApi: true } } });
