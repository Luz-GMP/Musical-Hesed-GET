(function () {
  'use strict';

  const W = 1920;
  const H = 1080;
  const FPS = 30;
  const TOTAL_DURATION = 112.0; // 01:52.000 · 3360 quadros @ 30 fps

  const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = t => { const x = clamp(t); return x * x * (3 - 2 * x); };
  const smoother = t => { const x = clamp(t); return x * x * x * (x * (x * 6 - 15) + 10); };
  const easeOutCubic = t => 1 - Math.pow(1 - clamp(t), 3);
  const easeInOutSine = t => -(Math.cos(Math.PI * clamp(t)) - 1) / 2;

  /*
    Coreografia de PLANO-SEQUENCIA continuo (Q01 -> Q02 -> Q07 -> Q03 -> Q04 -> Q05 -> Q08 -> Q06)
    - Cada bloco define trajeto continuo de camera (escala/pan) e perfis de profundidade por camada 2.5D.
    - Quando layers-v05/ tiver todos os PNGs RGBA de uma cena, ela roda automaticamente em 2.5D real.
    - Enquanto uma cena intermediaria aguarda camadas RGBA do Codex, usa a base unificada v05
      com o mesmo eixo de camera para manter o plano-sequencia pronto para revisao e render.
    - Q03 -> Q04 ocorre dentro do MESMO bloco continuo (anoitecer sem corte).
    - Q06 desacelera suavemente ate repouso 100% neutro (scale=1.00, tx=0, ty=0) a partir de 01:44.000
      para abrir a Cena 7 sem salto e receber MM13-Q06 v09 na fala da multidao (D-61).
  */
  const SEGMENTS = [
    {
      id: 'Q01',
      label: '01 · O caminho',
      cue: '“Naquela época, foi decretado…”',
      start: 0.0,
      end: 15.0,
      fadeIn: 0.9,
      transitionOut: 1.9,
      transitionStyle: 'forward-push-left',
      warmDust: 0.85,
      paperStrength: 0.032,
      // 4 camadas: L01-BG, L02-MG, L03-FG-dir, L04-FG-esq (oliveira+muro)
      layerProfiles: [
        { s0: 1.035, s1: 1.068, x0: 8,   x1: -14, y0: 0,  y1: -4,  sway: 0 },
        { s0: 1.045, s1: 1.110, x0: 6,   x1: -28, y0: 0,  y1: -2,  sway: 0 },
        { s0: 1.060, s1: 1.185, x0: 14,  x1: -50, y0: 2,  y1: 14,  sway: 0.08 },
        { s0: 1.070, s1: 1.245, x0: -6,  x1: -82, y0: 0,  y1: -8,  sway: 0.22 }
      ],
      baseMotion: { s0: 1.02, s1: 1.11, x0: 10, x1: -26, y0: 0, y1: -4 },
      lanterns: []
    },
    {
      id: 'Q02',
      label: '02 · Belém ao longe',
      cue: '“José, que era noivo de Maria, precisou ir até Belém…”',
      start: 15.0,
      end: 29.0,
      fadeIn: 0,
      transitionOut: 1.9,
      transitionStyle: 'canopy-push-right',
      warmDust: 0.45,
      paperStrength: 0.030,
      // 4 camadas: L01-BG, L02-MG-belem, L03-FG-esq-rochas, L04-FG-dir-oliveiras
      layerProfiles: [
        { s0: 1.025, s1: 1.060, x0: -10, x1: 10,  y0: 0,  y1: -4,  sway: 0 },
        { s0: 1.035, s1: 1.105, x0: -14, x1: 22,  y0: 2,  y1: -6,  sway: 0 },
        { s0: 1.055, s1: 1.160, x0: -18, x1: 44,  y0: 4,  y1: 12,  sway: 0 },
        { s0: 1.065, s1: 1.240, x0: -12, x1: 72,  y0: 0,  y1: 8,   sway: 0.20 }
      ],
      baseMotion: { s0: 1.015, s1: 1.115, x0: -16, x1: 24, y0: 4, y1: -6 },
      lanterns: [
        { x: 0.72, y: 0.36, r: 90, alpha: 0.14, phase: 0.7 },
        { x: 0.86, y: 0.35, r: 105, alpha: 0.16, phase: 2.1 }
      ]
    },
    {
      id: 'Q07',
      label: '03 · Entrada de Belém (ponte)',
      cue: 'Chegada às primeiras casas da vila',
      start: 29.0,
      end: 41.0,
      fadeIn: 0,
      transitionOut: 1.8,
      transitionStyle: 'lane-glide',
      warmDust: 0.30,
      paperStrength: 0.028,
      // 4 camadas: L01-BG, L02-MG-casario, L03-FG-esq-fachada, L04-FG-dir-muro-oliveira
      layerProfiles: [
        { s0: 1.020, s1: 1.052, x0: 8,   x1: -10, y0: 0,  y1: -2,  sway: 0 },
        { s0: 1.030, s1: 1.095, x0: 10,  x1: -22, y0: 0,  y1: -2,  sway: 0 },
        { s0: 1.050, s1: 1.160, x0: 12,  x1: -44, y0: 0,  y1: 4,   sway: 0 },
        { s0: 1.065, s1: 1.210, x0: 16,  x1: -62, y0: 0,  y1: 8,   sway: 0.16 }
      ],
      baseMotion: { s0: 1.015, s1: 1.105, x0: 12, x1: -22, y0: 2, y1: -2 },
      lanterns: [
        { x: 0.325, y: 0.415, r: 130, alpha: 0.28, phase: 1.4 },
        { x: 0.580, y: 0.450, r: 75,  alpha: 0.15, phase: 3.1 }
      ]
    },
    {
      id: 'Q03_Q04',
      primaryKey: 'Q03',
      nightKey: 'Q04',
      label: '04–05 · A chegada → A noite (anoitecer contínuo)',
      cue: '“E quando eles chegaram lá…” → anoitecer na mesma rua',
      start: 41.0,
      end: 67.0,
      nightStart: 51.0, // 00:51.000 inicia o anoitecer continuo sobre a mesma geometria
      nightEnd: 58.0,   // 00:58.000 noite plena (Q04)
      fadeIn: 0,
      transitionOut: 1.8,
      transitionStyle: 'dolly-to-door',
      warmDust: 0.18,
      paperStrength: 0.025,
      // 4 camadas pareadas (Q03 crepusculo + Q04 noite)
      layerProfiles: [
        { s0: 1.015, s1: 1.050, x0: 10,  x1: -12, y0: 0,  y1: -3,  sway: 0 },
        { s0: 1.025, s1: 1.095, x0: 12,  x1: -22, y0: 0,  y1: -2,  sway: 0 },
        { s0: 1.045, s1: 1.150, x0: 18,  x1: -38, y0: 2,  y1: 6,   sway: 0.10 },
        { s0: 1.055, s1: 1.195, x0: 16,  x1: -52, y0: 2,  y1: 6,   sway: 0 }
      ],
      baseMotion: { s0: 1.01, s1: 1.115, x0: 14, x1: -26, y0: 2, y1: 4 },
      lanterns: [
        { x: 0.305, y: 0.300, r: 175, alpha: 0.34, phase: 0.3 },
        { x: 0.471, y: 0.440, r: 80,  alpha: 0.18, phase: 2.4 },
        { x: 0.580, y: 0.455, r: 72,  alpha: 0.16, phase: 4.0 }
      ]
    },
    {
      id: 'Q05',
      label: '06 · Sem acolhimento',
      cue: '“…não tinha lugar pra ficar. Nenhuma hospedagem disponível.”',
      start: 67.0,
      end: 81.0,
      fadeIn: 0,
      transitionOut: 1.8,
      transitionStyle: 'corner-turn-right',
      warmDust: 0.16,
      paperStrength: 0.022,
      // 4 camadas: L01-BG, L02-MG-rua-mureta, L03-FG-esq-fachada, L04-OBJ-banco-jarros
      layerProfiles: [
        { s0: 1.015, s1: 1.045, x0: -8,  x1: 8,   y0: 0,  y1: -2,  sway: 0 },
        { s0: 1.025, s1: 1.078, x0: -12, x1: 18,  y0: 0,  y1: 0,   sway: 0 },
        { s0: 1.040, s1: 1.105, x0: -16, x1: 30,  y0: 0,  y1: 3,   sway: 0 },
        { s0: 1.050, s1: 1.125, x0: -18, x1: 38,  y0: 2,  y1: 5,   sway: 0 }
      ],
      baseMotion: { s0: 1.015, s1: 1.085, x0: -14, x1: 20, y0: 0, y1: 2 },
      lanterns: [
        { x: 0.405, y: 0.245, r: 190, alpha: 0.34, phase: 1.9 },
        { x: 0.655, y: 0.405, r: 72,  alpha: 0.14, phase: 3.7 }
      ]
    },
    {
      id: 'Q08',
      label: '07 · Saída para os arredores (ponte)',
      cue: 'Saindo da vila rumo ao campo noturno',
      start: 81.0,
      end: 94.0,
      fadeIn: 0,
      transitionOut: 2.0,
      transitionStyle: 'horizon-arrival',
      warmDust: 0.12,
      paperStrength: 0.018,
      // 4 camadas: L01-BG, L02-MG-belem-ciprestes, L03-FG-esq-esquina, L04-FG-dir-muro
      layerProfiles: [
        { s0: 1.018, s1: 1.042, x0: 8,   x1: -8,  y0: 0,  y1: 0,   sway: 0 },
        { s0: 1.028, s1: 1.068, x0: 12,  x1: -18, y0: 0,  y1: 0,   sway: 0 },
        { s0: 1.050, s1: 1.135, x0: 14,  x1: -48, y0: 0,  y1: 4,   sway: 0 },
        { s0: 1.045, s1: 1.120, x0: 16,  x1: -42, y0: 2,  y1: 6,   sway: 0 }
      ],
      baseMotion: { s0: 1.015, s1: 1.085, x0: 12, x1: -22, y0: 0, y1: 2 },
      lanterns: [
        { x: 0.165, y: 0.435, r: 140, alpha: 0.20, phase: 0.8 }
      ]
    },
    {
      id: 'Q06',
      label: '08 · Um abrigo simples (hold Cena 7)',
      cue: '“…onde os animais ficavam.” → repouso 1,00 para Cena 7 (v09)',
      start: 94.0,
      end: 112.0,
      settleAt: 104.0, // 01:44.000: todas as camadas travam em scale=1.00, tx=0, ty=0
      fadeIn: 0,
      transitionOut: 0,
      transitionStyle: 'quiet-hold',
      warmDust: 0.20,
      paperStrength: 0.014,
      // 5 camadas REAIS: L01-BG, L02-MG-belem, L03-FG-mureta, L04-FG-estabulo, L05-OBJ-anforas
      // Todas entram em movimento suave e desaceleram ate EXATAMENTE s=1.00, x=0, y=0 em settleAt!
      layerProfiles: [
        { s0: 1.028, s1: 1.000, x0: 10,  x1: 0, y0: -2, y1: 0, sway: 0 },
        { s0: 1.036, s1: 1.000, x0: 16,  x1: 0, y0: -1, y1: 0, sway: 0 },
        { s0: 1.044, s1: 1.000, x0: 22,  x1: 0, y0: 2,  y1: 0, sway: 0 },
        { s0: 1.052, s1: 1.000, x0: 28,  x1: 0, y0: 3,  y1: 0, sway: 0 },
        { s0: 1.056, s1: 1.000, x0: 32,  x1: 0, y0: 3,  y1: 0, sway: 0 } // delta L05-L04 <= 4px p/ nao descolar base
      ],
      baseMotion: { s0: 1.04, s1: 1.00, x0: 16, x1: 0, y0: 2, y1: 0 },
      lanterns: [
        { x: 0.153, y: 0.440, r: 165, alpha: 0.26, phase: 1.1 }
      ]
    }
  ];

  // Particulas atmosfericas deterministicas (poeira dourada na luz)
  const DUST_MOTES = Array.from({ length: 28 }, (_, i) => ({
    x: ((i * 617 + 193) % 1840) + 40,
    y: ((i * 353 + 127) % 860) + 80,
    r: 1.0 + (i % 4) * 0.65,
    vx: 6.5 + (i % 5) * 2.1,
    vy: -2.2 - (i % 3) * 0.9,
    phase: i * 1.37
  }));

  // Gera uma textura de fibra de papel algodao deterministica uma unica vez (offline, sem rede)
  function createPaperPatternCanvas() {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 256;
    const pctx = c.getContext('2d');
    const img = pctx.createImageData(256, 256);
    const data = img.data;
    let seed = 133791;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    for (let y = 0; y < 256; y++) {
      const fiberH = Math.sin(y * 0.37) * 5;
      for (let x = 0; x < 256; x++) {
        const idx = (y * 256 + x) * 4;
        const grain = (rand() - 0.5) * 34 + fiberH + Math.cos(x * 0.29) * 3;
        const base = 132 + grain;
        data[idx]     = clamp(Math.round(base + 8), 0, 255);
        data[idx + 1] = clamp(Math.round(base + 2), 0, 255);
        data[idx + 2] = clamp(Math.round(base - 8), 0, 255);
        data[idx + 3] = 255;
      }
    }
    pctx.putImageData(img, 0, 0);
    return c;
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Falha ao carregar imagem: ' + src));
      img.src = src;
    });
  }

  async function loadAllAssets(manifest) {
    const cache = new Map();
    const urls = new Set();
    Object.values(manifest.scenes).forEach(scene => {
      if (scene.base) urls.add(scene.base);
      (Array.isArray(scene.layers) ? scene.layers : []).forEach(l => urls.add(l));
    });
    await Promise.all(Array.from(urls).map(async url => {
      cache.set(url, await loadImage(url));
    }));
    return cache;
  }

  function drawLayerTransformed(ctx, img, scale, tx, ty, rotDeg, extraPush) {
    if (!img || !img.complete || !img.naturalWidth) return;
    const s = scale * (1 + extraPush);
    ctx.save();
    ctx.translate(W / 2 + tx, H / 2 + ty);
    if (rotDeg) ctx.rotate((rotDeg * Math.PI) / 180);
    ctx.scale(s, s);
    ctx.drawImage(img, -W / 2, -H / 2, W, H);
    ctx.restore();
  }

  function drawLanternGlows(ctx, lanterns, t, intensityScale) {
    if (!lanterns || !lanterns.length || intensityScale <= 0.001) return;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (const l of lanterns) {
      const flicker = 0.86 + 0.09 * Math.sin(t * 2.7 + l.phase) + 0.05 * Math.sin(t * 6.1 + l.phase * 1.9);
      const a = l.alpha * flicker * intensityScale;
      const cx = l.x * W;
      const cy = l.y * H;
      const rad = l.r * (0.94 + 0.08 * flicker);
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
      grad.addColorStop(0, `rgba(255, 206, 128, ${a.toFixed(4)})`);
      grad.addColorStop(0.38, `rgba(218, 152, 74, ${(a * 0.42).toFixed(4)})`);
      grad.addColorStop(1, 'rgba(211, 161, 91, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawDustMotes(ctx, t, strength) {
    if (strength <= 0.005) return;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (const m of DUST_MOTES) {
      const x = ((m.x + t * m.vx) % (W + 80)) - 40;
      const y = ((m.y + t * m.vy + Math.sin(t * 0.55 + m.phase) * 14) % (H + 80) + (H + 80)) % (H + 80) - 40;
      const pulse = 0.25 + 0.75 * smooth(0.5 + 0.5 * Math.sin(t * 0.95 + m.phase));
      ctx.fillStyle = `rgba(246, 212, 152, ${(strength * 0.16 * pulse).toFixed(4)})`;
      ctx.beginPath();
      ctx.arc(x, y, m.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawStack(ctx, manifest, cache, sceneKey, profiles, baseMotion, p, t, extraPush, outSwipeDir, outSwipeProg) {
    const info = manifest.scenes[sceneKey];
    if (!info) return;
    const useLayers = info.mode === '2.5d-layers' && info.layers && info.layers.length > 0;

    if (useLayers) {
      info.layers.forEach((url, idx) => {
        const img = cache.get(url);
        if (!img) return;
        const prof = profiles[Math.min(idx, profiles.length - 1)];
        const depthWeight = (idx + 1) / info.layers.length;
        const scale = lerp(prof.s0, prof.s1, p);
        let tx = lerp(prof.x0, prof.x1, p);
        let ty = lerp(prof.y0, prof.y1, p);
        const rot = prof.sway ? Math.sin(t * 0.65 + idx * 1.1) * prof.sway * (1 - (sceneKey === 'Q06' ? p : 0)) : 0;

        // Passagem de primeiro plano no plano-sequencia (camadas frontais aceleram para fora ao trocar)
        let layerExtraPush = extraPush * (0.35 + 1.15 * depthWeight);
        if (outSwipeProg > 0 && idx >= info.layers.length - 2) {
          tx += outSwipeDir * outSwipeProg * (55 + 65 * depthWeight);
          layerExtraPush += outSwipeProg * 0.06 * depthWeight;
        }
        drawLayerTransformed(ctx, img, scale, tx, ty, rot, layerExtraPush);
      });
    } else {
      const img = cache.get(info.base);
      if (img) {
        const scale = lerp(baseMotion.s0, baseMotion.s1, p);
        const tx = lerp(baseMotion.x0, baseMotion.x1, p) + outSwipeDir * outSwipeProg * 36;
        const ty = lerp(baseMotion.y0, baseMotion.y1, p);
        drawLayerTransformed(ctx, img, scale, tx, ty, 0, extraPush);
      }
    }
  }

  function renderSegment(ctx, nightContext, manifest, cache, seg, t, alpha, outProg, inProg) {
    const dur = seg.end - seg.start;
    const local = t - seg.start;

    // Progresso de movimento da camera:
    // Em Q06, desacelera suavemente ate settleAt (01:44.000) e depois trava em p=1.00 (neutro 1:1)
    let p;
    if (seg.settleAt) {
      const moveDur = seg.settleAt - seg.start;
      p = easeOutCubic(clamp(local / moveDur));
    } else {
      p = easeInOutSine(clamp(local / dur));
    }

    // Direcao de passagem do primeiro plano na saida
    let outSwipeDir = 0;
    if (seg.transitionStyle === 'forward-push-left' || seg.transitionStyle === 'lane-glide' || seg.transitionStyle === 'horizon-arrival') {
      outSwipeDir = -1;
    } else if (seg.transitionStyle === 'canopy-push-right' || seg.transitionStyle === 'corner-turn-right') {
      outSwipeDir = 1;
    }

    const extraPushOut = outProg > 0 ? smoother(outProg) * 0.045 : 0;
    const extraPullIn  = inProg < 1 ? (1 - smoother(inProg)) * -0.025 : 0;
    const extraPush = extraPushOut + extraPullIn;

    ctx.save();
    ctx.globalAlpha = alpha;

    if (seg.id === 'Q03_Q04') {
      // Anoitecer continuo na mesma camera (Q03 -> Q04 sem corte!)
      const nightMix = smoother(clamp((t - seg.nightStart) / (seg.nightEnd - seg.nightStart)));
      const moment = [seg.layerProfiles, seg.baseMotion, p, t, extraPush, outSwipeDir, smoother(outProg)];
      if (nightMix === 1) {
        drawStack(ctx, manifest, cache, seg.nightKey, ...moment);
      } else {
        drawStack(ctx, manifest, cache, seg.primaryKey, ...moment);
        if (nightMix > 0.001) {
          // Dissolve a imagem noturna já composta para preservar as oclusões.
          nightContext.clearRect(0, 0, W, H);
          drawStack(nightContext, manifest, cache, seg.nightKey, ...moment);
          ctx.save();
          ctx.globalAlpha *= nightMix;
          ctx.drawImage(nightContext.canvas, 0, 0);
          ctx.restore();
        }
      }
      drawLanternGlows(ctx, seg.lanterns, t, (0.55 + 0.45 * nightMix) * alpha);
    } else {
      drawStack(ctx, manifest, cache, seg.id, seg.layerProfiles, seg.baseMotion, p, t, extraPush, outSwipeDir, smoother(outProg));
      // Em Q06, reduz levemente poeira/brilho excessivo ao entrar no repouso neutro p/ compatibilidade com v09
      const holdCalm = seg.settleAt ? (1 - 0.35 * smooth(clamp((t - seg.settleAt) / 3.0))) : 1;
      drawLanternGlows(ctx, seg.lanterns, t, holdCalm * alpha);
    }

    if (seg.warmDust > 0) {
      const dustScale = seg.settleAt ? seg.warmDust * (1 - 0.65 * smooth(clamp((t - seg.settleAt) / 4.0))) : seg.warmDust;
      drawDustMotes(ctx, t, dustScale * alpha);
    }

    ctx.restore();
  }

  function maskTransition(ctx, style, progress) {
    const leftFirst = style === 'canopy-push-right' || style === 'corner-turn-right';
    const feather = 0.24;
    const edge = lerp(-feather, 1, progress);
    const gradient = ctx.createLinearGradient(leftFirst ? 0 : W, 0, leftFirst ? W : 0, 0);
    [0, clamp(edge), clamp(edge + feather / 2), clamp(edge + feather), 1].forEach(stop => {
      const alpha = 1 - smoother((stop - edge) / feather);
      gradient.addColorStop(stop, `rgba(0, 0, 0, ${alpha})`);
    });
    ctx.save();
    ctx.globalCompositeOperation = 'destination-in';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  function createEngine(canvas, manifest, cache) {
    const ctx = canvas.getContext('2d', { alpha: false });
    const createCompositingContext = () => {
      const layerCanvas = document.createElement('canvas');
      layerCanvas.width = W;
      layerCanvas.height = H;
      return layerCanvas.getContext('2d');
    };
    const transitionContext = createCompositingContext();
    const nightContext = createCompositingContext();
    const paperCanvas = createPaperPatternCanvas();
    const paperPattern = ctx.createPattern(paperCanvas, 'repeat');

    function getActiveInfo(t) {
      const gt = clamp(Number(t) || 0, 0, TOTAL_DURATION);
      let active = SEGMENTS[SEGMENTS.length - 1];
      for (const seg of SEGMENTS) {
        if (gt >= seg.start && gt < seg.end) {
          active = seg;
          break;
        }
      }
      const sceneKey = active.nightKey && gt >= active.nightEnd ? active.nightKey : (active.primaryKey || active.id);
      const mode = manifest.scenes[sceneKey] ? manifest.scenes[sceneKey].mode : 'base-fallback';
      const isHold = Boolean(active.settleAt && gt >= active.settleAt);
      return { time: gt, segment: active, sceneKey, mode, isHold };
    }

    function renderAt(time) {
      const t = clamp(Number(time) || 0, 0, TOTAL_DURATION);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#0c131d';
      ctx.fillRect(0, 0, W, H);

      // Encontra segmento atual e eventual sobreposicao de transicao com o proximo
      let currentIdx = SEGMENTS.length - 1;
      for (let i = 0; i < SEGMENTS.length; i++) {
        if (t >= SEGMENTS[i].start && t < SEGMENTS[i].end) {
          currentIdx = i;
          break;
        }
      }

      const curr = SEGMENTS[currentIdx];
      const next = currentIdx < SEGMENTS.length - 1 ? SEGMENTS[currentIdx + 1] : null;
      const transDur = next ? curr.transitionOut : 0;
      const transStart = next ? curr.end - transDur : Infinity;

      // Fade-in gentil de abertura no primeiro segundo (do preto noturno do ceu anterior)
      const openAlpha = curr.fadeIn > 0 ? smoother(clamp((t - curr.start) / curr.fadeIn)) : 1;

      if (next && t >= transStart) {
        const transProg = clamp((t - transStart) / transDur);
        const mix = smoother(transProg);
        renderSegment(ctx, nightContext, manifest, cache, curr, t, 1, transProg, 1);
        transitionContext.clearRect(0, 0, W, H);
        renderSegment(transitionContext, nightContext, manifest, cache, next, t, 1, 0, transProg);
        maskTransition(transitionContext, curr.transitionStyle, mix);
        ctx.drawImage(transitionContext.canvas, 0, 0);
      } else if (openAlpha < 1) {
        transitionContext.clearRect(0, 0, W, H);
        renderSegment(transitionContext, nightContext, manifest, cache, curr, t, 1, 0, 1);
        ctx.globalAlpha = openAlpha;
        ctx.drawImage(transitionContext.canvas, 0, 0);
        ctx.globalAlpha = 1;
      } else {
        renderSegment(ctx, nightContext, manifest, cache, curr, t, 1, 0, 1);
      }

      // Acabamento tatil MUITO sutil de papel algodao (reduz para 0 no hold final de Q06 p/ encaixe com v09)
      let paperAlpha = curr.paperStrength;
      if (curr.settleAt && t >= curr.settleAt) {
        paperAlpha *= (1 - smoother(clamp((t - curr.settleAt) / 2.5)));
      }
      if (paperAlpha > 0.001 && paperPattern) {
        ctx.save();
        ctx.globalCompositeOperation = 'soft-light';
        ctx.globalAlpha = paperAlpha;
        ctx.fillStyle = paperPattern;
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }

      return t;
    }

    let lastTime = 0;
    const timeline = {
      duration: () => TOTAL_DURATION,
      totalDuration: () => TOTAL_DURATION,
      paused: () => true,
      pause: () => timeline,
      seek: t => { lastTime = renderAt(t); return timeline; },
      time: t => { if (t === undefined) return lastTime; lastTime = renderAt(t); return timeline; },
      totalTime: t => { if (t === undefined) return lastTime; lastTime = renderAt(t); return timeline; },
      progress: p => {
        if (p === undefined) return lastTime / TOTAL_DURATION;
        lastTime = renderAt(p * TOTAL_DURATION);
        return timeline;
      }
    };

    renderAt(0);
    return { renderAt, timeline, getActiveInfo, segments: SEGMENTS, duration: TOTAL_DURATION, fps: FPS };
  }

  function drawIfReady(img) {
    return img && img.complete && img.naturalWidth > 0;
  }

  function mountSync(canvas, preloadedCache) {
    const manifest = window.MM12_V05_MANIFEST;
    const engine = createEngine(canvas, manifest, preloadedCache);
    // Re-render current time as any remaining image finishes decoding
    preloadedCache.forEach(img => {
      if (!drawIfReady(img)) {
        img.addEventListener('load', () => engine.renderAt(engine.timeline.time()), { once: true });
      }
    });
    return engine;
  }

  async function mount(canvas) {
    const manifest = window.MM12_V05_MANIFEST || await fetch('assets/manifesto-camadas.json').then(r => r.json());
    const cache = await loadAllAssets(manifest);
    return createEngine(canvas, manifest, cache);
  }

  window.MM12PlanoSequencia = { mount, mountSync, SEGMENTS, TOTAL_DURATION, FPS };
}());
