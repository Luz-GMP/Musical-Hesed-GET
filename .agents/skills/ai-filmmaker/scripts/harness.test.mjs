import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const harness = path.join(root, 'scripts/harness.mjs');
const run = (args, cwd = root) => spawnSync(process.execPath, [harness, ...args], { cwd, encoding: 'utf8' });
const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const temporary = (fn) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'filmmaker-harness-'));
  try { fn(dir); } finally {
    assert.equal(path.dirname(dir), fs.realpathSync(os.tmpdir()));
    fs.rmSync(dir, { recursive: true, force: true });
  }
};

const writeJson = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');

test('harness do pacote confirma entrada, referências e links locais', () => {
  const execution = run(['package', '--json']);
  assert.equal(execution.status, 0, execution.stderr || execution.stdout);
  const report = JSON.parse(execution.stdout);
  assert.equal(report.status, 'pass');
  assert.equal(report.scope, 'package');
  assert.equal(report.errors.length, 0);
});

test('harness aceita projeto válido com ledger, camadas, transcrição e EDL', () => temporary((project) => {
  fs.mkdirSync(path.join(project, 'assets'));
  fs.mkdirSync(path.join(project, 'analysis'));
  fs.writeFileSync(path.join(project, 'assets/source.txt'), 'fonte sintética\n', 'utf8');
  writeJson(path.join(project, 'analysis/transcript.json'), {
    words: [
      { text: 'Olá', start: 0, end: 0.4, sourceStart: 1, sourceEnd: 1.4 },
      { text: 'mundo', start: 0.45, end: 0.9, sourceStart: 1.45, sourceEnd: 1.9 },
    ],
  });
  writeJson(path.join(project, 'analysis/edit-decisions.json'), {
    cuts: [{ start: 0.9, end: 1.1, reason: 'pausa revisada', state: 'approved' }],
  });
  writeJson(path.join(project, 'filmmaker.project.json'), {
    schema: 'ai-filmmaker.project/v1',
    project: { id: 'fixture', title: 'Fixture sintética' },
    workflow: { phase: 'scene-review', currentScene: 'scene-01' },
    delivery: { width: 1080, height: 1920, fps: 30, status: 'draft' },
    timeline: { musicMode: 'global' },
    assets: [{
      id: 'source-01', path: 'assets/source.txt', kind: 'document', status: 'ready',
      provenance: 'synthetic-fixture', rights: 'test-only', sha256: sha256(path.join(project, 'assets/source.txt')),
    }],
    scenes: [{
      id: 'scene-01', version: 1, status: 'review', durationSec: 2,
      layers: [
        { id: 'bg', role: 'background' },
        { id: 'content', role: 'content', assetId: 'source-01' },
        { id: 'title', role: 'foreground' },
      ],
      audio: { voice: [], music: [], ambience: [], sfx: [] }, approvals: [],
    }],
    transcript: { path: 'analysis/transcript.json' },
    editDecisions: { path: 'analysis/edit-decisions.json' },
    capabilities: {
      semanticMediaIndex: { status: 'not-planned' },
      externalTimeline: { status: 'not-planned' },
      backgroundRemoval: { status: 'not-planned' },
      lipSync: { status: 'not-planned' },
    },
  });

  const execution = run(['project', project, '--json'], project);
  assert.equal(execution.status, 0, execution.stderr || execution.stdout);
  const report = JSON.parse(execution.stdout);
  assert.equal(report.status, 'pass');
  assert.equal(report.errors.length, 0);
  assert.ok(report.checks.some((entry) => entry.code === 'transcript.checked'));
  assert.ok(report.checks.some((entry) => entry.code === 'edl.checked'));
}));

test('harness bloqueia entrega final sem aprovação e caminhos fora do projeto', () => temporary((project) => {
  writeJson(path.join(project, 'filmmaker.project.json'), {
    schema: 'ai-filmmaker.project/v1',
    project: { id: 'invalid', title: 'Inválido' },
    workflow: { phase: 'final', currentScene: 'scene-01' },
    delivery: { width: 1080, height: 1920, fps: 30, status: 'final', output: '../fora.mp4' },
    timeline: { musicMode: 'per-scene' },
    assets: [],
    scenes: [{
      id: 'scene-01', version: 1, status: 'review', durationSec: 1,
      layers: [{ id: 'content', role: 'content' }],
      audio: { voice: [], music: [], ambience: [], sfx: [] }, approvals: [],
    }],
    capabilities: {
      semanticMediaIndex: { status: 'not-planned' },
      externalTimeline: { status: 'not-planned' },
      backgroundRemoval: { status: 'not-planned' },
      lipSync: { status: 'not-planned' },
    },
  });

  const execution = run(['project', project, '--json'], project);
  assert.notEqual(execution.status, 0);
  const report = JSON.parse(execution.stdout);
  assert.equal(report.status, 'fail');
  assert.ok(report.errors.some((entry) => entry.code === 'final.unapproved_scenes'));
  assert.ok(report.errors.some((entry) => entry.code === 'path.escape'));
  assert.ok(report.warnings.some((entry) => entry.code === 'timeline.music_restart'));
}));
