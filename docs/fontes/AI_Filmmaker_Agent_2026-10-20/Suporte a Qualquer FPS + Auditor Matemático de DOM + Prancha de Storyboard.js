import { chromium } from 'playwright';
import { spawn, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Lê parâmetros: ex: node render.mjs --qa  OU  node render.mjs --fps=24 --duration=7
const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [k, v] = arg.replace(/^--/, '').split('=');
    return [k, v ?? true];
  })
);

const WIDTH = Number(args.width || 1080);
const HEIGHT = Number(args.height || 1920);
const DURATION_SECONDS = Number(args.duration || 7);
const RAW_FPS = String(args.fps || '60');
const IS_VERTICAL = HEIGHT > WIDTH;

// Suporte preciso a taxas inteiras e fracionárias NTSC (23.976, 29.97, 59.94)
const FPS_MAP = {
  '23.976': { num: 24000 / 1001, ffmpegRate: '24000/1001' },
  '23.98':  { num: 24000 / 1001, ffmpegRate: '24000/1001' },
  '24':     { num: 24,           ffmpegRate: '24' },
  '25':     { num: 25,           ffmpegRate: '25' },
  '29.97':  { num: 30000 / 1001, ffmpegRate: '30000/1001' },
  '29.9':   { num: 30000 / 1001, ffmpegRate: '30000/1001' },
  '30':     { num: 30,           ffmpegRate: '30' },
  '59.94':  { num: 60000 / 1001, ffmpegRate: '60000/1001' },
  '59':     { num: 60000 / 1001, ffmpegRate: '60000/1001' },
  '60':     { num: 60,           ffmpegRate: '60' },
  '120':    { num: 120,          ffmpegRate: '120' }
};

const fpsConfig = FPS_MAP[RAW_FPS] || { num: parseFloat(RAW_FPS) || 60, ffmpegRate: RAW_FPS };
const FPS_NUM = fpsConfig.num;
const FFMPEG_RATE = fpsConfig.ffmpegRate;
const TOTAL_FRAMES = Math.round(FPS_NUM * DURATION_SECONDS);
const HTML_PATH = 'file://' + path.resolve('./scene.html');

// Auditor Matemático de DOM (verifica Overflow, Safe Area e Colisão/Overlap de textos)
async function runDomAudit(page, t, width, height, isVertical) {
  return await page.evaluate(({ t, width, height, isVertical }) => {
    const issues = [];
    const SAFE = isVertical
      ? { top: 160, bottom: height - 340, left: 80, right: width - 140 }
      : { top: 40, bottom: height - 40, left: 40, right: width - 40 };

    const textBoxes = [];
    const elements = document.querySelectorAll('h1, h2, h3, h4, p, span, li, button, .audit-target');

    for (const el of elements) {
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) < 0.05) continue;
      if (!el.innerText || !el.innerText.trim()) continue;

      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;

      const label = `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${el.className ? '.' + String(el.className).split(' ')[0] : ''} ("${el.innerText.slice(0, 22).trim()}")`;

      // 1. Checagem de saída de tela (Out of bounds)
      if (r.left < 0 || r.top < 0 || r.right > width || r.bottom > height) {
        issues.push(`[t=${t}s] FORA DA TELA: ${label} -> rect(${Math.round(r.left)}, ${Math.round(r.top)}, ${Math.round(r.right)}, ${Math.round(r.bottom)})`);
      }
      // 2. Checagem de Safe Area
      else if (r.top < SAFE.top || r.bottom > SAFE.bottom || r.left < SAFE.left || r.right > SAFE.right) {
        issues.push(`[t=${t}s] INVASÃO DE SAFE AREA: ${label} -> rect(top:${Math.round(r.top)}, bottom:${Math.round(r.bottom)}, left:${Math.round(r.left)}, right:${Math.round(r.right)})`);
      }
      // 3. Checagem de texto cortado internamente (Overflow)
      if ((style.overflow === 'hidden' || style.overflowX === 'hidden') && el.scrollWidth > el.clientWidth + 2) {
        issues.push(`[t=${t}s] TEXTO CORTADO (Overflow X): ${label} (scrollWidth=${el.scrollWidth} > clientWidth=${el.clientWidth})`);
      }

      textBoxes.push({ el, label, r });
    }

    // 4. Checagem de sobreposição (Overlap) entre elementos de texto distintos
    for (let i = 0; i < textBoxes.length; i++) {
      for (let j = i + 1; j < textBoxes.length; j++) {
        const a = textBoxes[i], b = textBoxes[j];
        if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
        const overlapX = Math.max(0, Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left));
        const overlapY = Math.max(0, Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top));
        if (overlapX > 8 && overlapY > 8) {
          issues.push(`[t=${t}s] SOBREPOSIÇÃO DE TEXTO (Overlap): ${a.label} colide com ${b.label}`);
        }
      }
    }
    return issues;
  }, { t, width, height, isVertical });
}

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 } });
  await page.goto(HTML_PATH, { waitUntil: 'networkidle' });

  // Garante carregamento total das fontes web antes do 1º frame (evita piscar fonte errada)
  await page.evaluate(() => document.fonts.ready);

  // MODO "--qa": Duplo Self-QA (Auditor DOM + 2 Snapshots por cena + Prancha Única de Storyboard)
  if (args.qa) {
    fs.rmSync('./qa_frames', { recursive: true, force: true });
    fs.mkdirSync('./qa_frames', { recursive: true });

    // Descobre automaticamente os tempos de cada cena declarada via data-start e data-duration
    const checkPoints = await page.evaluate((totalDur) => {
      const scenes = [...document.querySelectorAll('.scene[data-start]')];
      if (scenes.length === 0) {
        return [0.3, 1.5, 3.0, 5.0, 8.0].filter((t) => t <= totalDur);
      }
      const pts = [];
      for (const s of scenes) {
        const start = parseFloat(s.dataset.start || '0');
        const dur = parseFloat(s.dataset.duration || '3');
        // Ponto 1: Início da entrada (para validar motion) | Ponto 2: Estado de repouso (para auditar layout)
        const pEntrada = Number((start + Math.min(0.3, dur * 0.2)).toFixed(2));
        const pRepouso = Number((start + dur * 0.65).toFixed(2));
        if (pEntrada <= totalDur) pts.push(pEntrada);
        if (pRepouso <= totalDur) pts.push(pRepouso);
      }
      return [...new Set(pts)];
    }, DURATION_SECONDS);

    let allIssues = [];
    let idx = 1;
    for (const t of checkPoints) {
      await page.evaluate(async (time) => await window.renderAtTime(time), t);
      const issues = await runDomAudit(page, t, WIDTH, HEIGHT, IS_VERTICAL);
      allIssues.push(...issues);
      const fileName = `./qa_frames/qa_${String(idx).padStart(2, '0')}_${t}s.png`;
      await page.screenshot({ path: fileName });
      idx++;
    }

    // Monta automaticamente a Prancha Única de Storyboard com FFmpeg para visão panorâmica do Agente
    try {
      const cols = Math.min(4, checkPoints.length);
      const rows = Math.ceil(checkPoints.length / cols);
      execSync(
        `ffmpeg -y -pattern_type glob -i "./qa_frames/qa_*.png" -vf "scale=360:-1,tile=${cols}x${rows}" -frames:v 1 ./qa_frames/qa_storyboard_board.jpg`,
        { stdio: 'ignore' }
      );
    } catch {
      // Fallback silencioso no Windows caso glob não esteja ativo na build do FFmpeg
    }

    console.log('\n================ RELATÓRIO DO AUDITOR DOM (SELF-QA) ================');
    if (allIssues.length === 0) {
      console.log('✅ ZERO ERROS MATEMÁTICOS DE LAYOUT! Todos os textos respeitam a tela e a Safe Area.');
    } else {
      console.log(`⚠️ ATENÇÃO: Foram encontrados ${allIssues.length} problemas de layout que precisam de correção:`);
      allIssues.forEach((iss) => console.log('  - ' + iss));
    }
    console.log('📸 Snapshots e Prancha de Storyboard gerados em ./qa_frames/ para inspeção visual.');
    console.log('====================================================================\n');

    await browser.close();
    return;
  }

  console.log(`Renderizando ${TOTAL_FRAMES} frames a ${RAW_FPS} FPS (${FFMPEG_RATE})...`);

  // Modo Renderização Final: Envia frames via pipe direto para o FFmpeg na taxa exata escolhida
  const ffmpeg = spawn('ffmpeg', [
    '-y',
    '-f', 'image2pipe',
    '-vcodec', 'png',
    '-framerate', FFMPEG_RATE,
    '-i', '-',
    '-c:v', 'libx264',
    '-r', FFMPEG_RATE,
    '-pix_fmt', 'yuv420p',
    '-crf', '18',
    '-preset', 'fast',
    'video_visual.mp4'
  ]);

  for (let frame = 0; frame < TOTAL_FRAMES; frame++) {
    const t = frame / FPS_NUM;
    await page.evaluate(async (time) => await window.renderAtTime(time), t);
    const buffer = await page.screenshot({ type: 'png' });
    ffmpeg.stdin.write(buffer);
  }

  ffmpeg.stdin.end();
  await new Promise((resolve) => ffmpeg.on('close', resolve));
  await browser.close();
  console.log(`Vídeo visual renderizado com sucesso em ${RAW_FPS} FPS: video_visual.mp4`);
}

run();