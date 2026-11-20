import { execFile } from 'node:child_process';
import { access, realpath, stat } from 'node:fs/promises';
import { homedir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

const exec = promisify(execFile);
const toolsDir = process.env.AI_FILMMAKER_TOOLS_DIR || path.join(homedir(), 'Documents', 'Codex', 'tools');
const cli = process.env.AI_FILMMAKER_HYPERFRAMES_CLI ||
  path.join(toolsDir, 'hyperframes', 'node_modules', 'hyperframes', 'bin', 'hyperframes.mjs');

async function browserEnv() {
  const env = { ...process.env, HYPERFRAMES_NO_TELEMETRY: '1' };
  if (!env.HYPERFRAMES_BROWSER_PATH && process.platform === 'win32') {
    const chrome = path.join(toolsDir, 'chrome-headless-153', 'chrome-headless-shell-win64', 'chrome-headless-shell.exe');
    if (await stat(chrome).then(item => item.isFile(), () => false)) env.HYPERFRAMES_BROWSER_PATH = chrome;
  }
  return env;
}

async function invoke(args, cwd, env, timeout) {
  try {
    await access(cli);
    const { stdout } = await exec(process.execPath, [cli, ...args], {
      cwd, env, timeout, maxBuffer: 12 * 1024 * 1024, windowsHide: true
    });
    return stdout.trim();
  } catch (error) {
    const details = [error.message, error.stderr, error.stdout].filter(Boolean).map(value => String(value).slice(-1600));
    throw new Error(details.join('\n'));
  }
}

export async function hyperframesDoctor() {
  const env = await browserEnv();
  try {
    const version = await invoke(['--version'], path.dirname(cli), env, 15000);
    return { available: true, version, cli, browser: env.HYPERFRAMES_BROWSER_PATH || 'seleção da CLI' };
  } catch (error) {
    return { available: false, cli, detail: error.message };
  }
}

function frameRate(value) {
  const fps = Number(value);
  if (!Number.isFinite(fps) || fps < 1 || fps > 240) throw new Error('FPS do HyperFrames deve estar entre 1 e 240.');
  for (const rate of [24000, 30000, 60000]) {
    if (Math.abs(rate / 1001 - fps) < 0.0001) return { fps: rate / 1001, argument: rate + '/1001' };
  }
  if (!Number.isInteger(fps)) throw new Error('Use FPS inteiro ou a razão NTSC exata no manifesto.');
  return { fps, argument: String(fps) };
}

export async function renderHyperframes({ source, output, fps, frames, durationSec }) {
  const entry = await realpath(source);
  if (path.basename(entry).toLowerCase() !== 'index.html' || !(await stat(entry)).isFile()) {
    throw new Error('HyperFrames requer o index.html da pasta da composição.');
  }
  const rate = frameRate(fps);
  const args = ['render', '.', '--output', path.resolve(output), '--format', 'mp4',
    '--fps', rate.argument, '--quality', 'draft', '--workers', '1', '--refuse-outside-files'];
  if (frames !== undefined) {
    if (!Number.isSafeInteger(frames) || frames < 1) throw new Error('Quantidade de quadros inválida.');
    const total = durationSec == null ? null : Math.round(durationSec * rate.fps);
    if (total !== null && frames > total) throw new Error('A prévia excede a duração da cena.');
    if (frames !== total) {
      if (![24, 25, 30, 60].includes(rate.fps)) throw new Error('Para este FPS, renderize a composição completa. O recorte por tempo da CLI aceita 24, 25, 30 e 60 fps.');
      args.push('--end', String(frames / rate.fps));
    }
  }
  const cwd = path.dirname(entry);
  const env = await browserEnv();
  await invoke(['lint', '.', '--json'], cwd, env, 30000);
  await invoke(args, cwd, env, 285000);
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  try {
    const [command, source, output, fps, frames] = process.argv.slice(2);
    if (command === 'doctor') {
      const result = await hyperframesDoctor();
      console.log(JSON.stringify(result));
      if (!result.available) process.exitCode = 1;
    } else if (command === 'render' && source && output && fps) {
      if (await stat(output).then(() => true, error => { if (error.code !== 'ENOENT') throw error; return false; })) throw new Error('Escolha um arquivo de saída novo.');
      await renderHyperframes({ source, output, fps, frames: frames === undefined ? undefined : Number(frames) });
      console.log(path.resolve(output));
    } else throw new Error('Uso: doctor | render <index.html> <saida.mp4> <fps> [quadros]');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
