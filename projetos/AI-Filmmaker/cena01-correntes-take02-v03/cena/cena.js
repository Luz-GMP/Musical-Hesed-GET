window.addEventListener("load", () => {
  const imgs = {
    ancora01: document.getElementById("ancora01"),
    voidBg: document.getElementById("voidBg"),
    ladraPresa: document.getElementById("ladraPresa"),
    ladraLivre: document.getElementById("ladraLivre"),
    frenteEsq: document.getElementById("frenteEsq"),
    frenteDir: document.getElementById("frenteDir"),
    meioEsq: document.getElementById("meioEsq"),
    meioDir: document.getElementById("meioDir"),
    elosKit: document.getElementById("elosKit"),
    algemaChao: document.getElementById("algemaChao"),
  };

  const plano = document.getElementById("plano");
  const ctx = plano.getContext("2d", { alpha: false });
  const W = plano.width;
  const H = plano.height;
  const { fps, quadros, cues, pivos, pecasElos, blocosTexto } = montagem;

  const paletaTexto = {
    prata: "#CBD5E1",
    branco: "#FFF9F2",
    ambar: "#FF9F2E",
  };

  const clamp = (v) => Math.max(0, Math.min(1, v));
  const smooth = (v) => {
    const p = clamp(v);
    return p * p * (3 - 2 * p);
  };
  const easeOutQuint = (v) => 1 - Math.pow(1 - clamp(v), 5);
  const easeInOutCubic = (v) => {
    const p = clamp(v);
    return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
  };
  const lerp = (a, b, t) => a + (b - a) * t;

  // ===========================================================================
  // MOTOR DE TIPOGRAFIA CINÉTICA (MESMO ESTILO DO TAKE 01 + CLAMP DE SEGURANÇA)
  // ===========================================================================
  const MAX_LARGURA_LINHA = 640; // garante margem das bordas E zero invasão sobre a Ladra no centro!

  function comporLinha({ base, x, termos }) {
    const palavrasBrutas = termos.map(([texto, tamanho, cor, entrada], indice) => {
      const frase = texto.toLocaleUpperCase("pt-BR");
      const fonte = `${tamanho}px Impact, "Arial Black", sans-serif`;
      const espaco = tamanho < 80 ? "2.0px" : "1.4px";
      ctx.font = fonte;
      ctx.letterSpacing = espaco;
      const largura = ctx.measureText(frase).width;
      return { frase, tamanho, cor, entrada, fonte, espaco, largura, base, indice };
    });

    const intervalo = 22;
    const totalBruto =
      palavrasBrutas.reduce((s, p) => s + p.largura, 0) +
      intervalo * (palavrasBrutas.length - 1);
    const fatorLinha = totalBruto > MAX_LARGURA_LINHA ? MAX_LARGURA_LINHA / totalBruto : 1;

    const palavras = palavrasBrutas.map((p) => {
      const tam = Math.round(p.tamanho * fatorLinha);
      const fonte = `${tam}px Impact, "Arial Black", sans-serif`;
      ctx.font = fonte;
      ctx.letterSpacing = p.espaco;
      const largura = ctx.measureText(p.frase).width;
      return { ...p, tamanho: tam, fonte, largura };
    });

    const intEsc = intervalo * fatorLinha;
    const total =
      palavras.reduce((s, p) => s + p.largura, 0) +
      intEsc * (palavras.length - 1);
    let cursor = x - total / 2;
    return palavras.map((p) => {
      const meio = cursor + p.largura / 2;
      cursor += p.largura + intEsc;
      return { ...p, meio };
    });
  }

  const blocos = blocosTexto.map((b) => {
    const palavras = b.linhas.flatMap(comporLinha);
    const entrada = Math.min(...palavras.map((p) => p.entrada));
    const ultimoTermo = Math.max(...palavras.map((p) => p.entrada));
    return { ...b, palavras, entrada, ultimoTermo };
  });

  function desenharPalavra(termo, t, opacidade, sentido) {
    const decorrido = t - termo.entrada;
    if (decorrido <= 0) return;
    const impacto = termo.tamanho >= 95;
    const entrada = clamp(decorrido / (impacto ? 0.40 : 0.25));
    const viagem = Math.pow(1 - entrada, 3);
    const encaixe = 1 - Math.pow(1 - entrada, 2) * Math.cos(entrada * 4.5);
    const escala = 1 + (impacto ? 0.38 : 0.22) * (encaixe - 1);
    const direcao = termo.indice % 2 === 0 ? sentido : -sentido;
    const eixoY = -termo.tamanho * 0.36;

    ctx.save();
    ctx.translate(
      termo.meio + direcao * (impacto ? 54 : 30) * viagem,
      termo.base + eixoY + (impacto ? 66 : -26) * viagem
    );
    ctx.rotate(direcao * viagem * (impacto ? 0.11 : 0.07));
    ctx.scale(escala, escala);
    ctx.globalAlpha = opacidade * smooth(decorrido / 0.12);
    ctx.font = termo.fonte;
    ctx.letterSpacing = termo.espaco;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.lineJoin = "round";

    ctx.shadowColor = "rgba(4, 2, 1, 0.90)";
    ctx.shadowBlur = impacto ? 22 : 12;
    ctx.shadowOffsetY = impacto ? 7 : 4;
    ctx.strokeStyle = "rgba(9, 5, 3, 0.96)";
    ctx.lineWidth = impacto ? 8 : 5.5;
    ctx.strokeText(termo.frase, 0, -eixoY);

    ctx.shadowColor = termo.cor === "ambar" ? "rgba(255, 148, 42, 0.44)" : "rgba(0, 0, 0, 0.35)";
    ctx.shadowBlur = termo.cor === "ambar" ? 24 : 10;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = paletaTexto[termo.cor];
    ctx.fillText(termo.frase, 0, -eixoY);
    ctx.restore();
  }

  function estadoDoBloco(blocoAtual, t) {
    if (t <= blocoAtual.entrada) return null;
    const saida = smooth((t - blocoAtual.saidaInicio) / (blocoAtual.saidaFim - blocoAtual.saidaInicio));
    if (saida >= 1) return null;
    const tempoLeitura = Math.max(0, t - blocoAtual.ultimoTermo - 0.10);
    const fase = (2 * Math.PI * tempoLeitura) / blocoAtual.ciclo;
    const intensidade = blocoAtual.intensidade * smooth(tempoLeitura / 0.22) * (1 - saida);
    return {
      blocoAtual,
      saida,
      avanco: (intensidade * (1 - Math.cos(fase))) / 2,
      tilt: intensidade * blocoAtual.sentido * Math.sin(fase - 0.35) * 0.024,
    };
  }

  function desenharBloco({ blocoAtual, saida, tilt }, t) {
    const { centro, inclinacao, palavras, entrada, ultimoTermo, sentido } = blocoAtual;
    const aprox = smooth((t - entrada) / 0.50);
    const acento = smooth((t - ultimoTermo) / 0.78);
    const z = 0.95 + aprox * 0.05 + acento * 0.032 - saida * 0.18;

    ctx.save();
    ctx.translate(
      centro[0] - sentido * (1 - aprox) * 44 + sentido * saida * 145,
      centro[1] + (1 - aprox) * 32 - saida * 72
    );
    ctx.rotate(inclinacao - sentido * (1 - aprox) * 0.075 + sentido * saida * 0.10 + tilt);
    ctx.scale(z, z);
    for (const termo of palavras) {
      desenharPalavra(termo, t, 1 - saida, sentido);
    }
    ctx.restore();
  }

  // Pré-gera grão fino de papel/filme unificado
  const grainCanvas = document.createElement("canvas");
  grainCanvas.width = 256;
  grainCanvas.height = 256;
  const gCtx = grainCanvas.getContext("2d");
  const gImg = gCtx.createImageData(256, 256);
  let seed = 1337;
  function rand() {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  }
  for (let i = 0; i < gImg.data.length; i += 4) {
    const v = Math.floor(rand() * 255);
    gImg.data[i] = v;
    gImg.data[i + 1] = Math.max(0, v - 8);
    gImg.data[i + 2] = Math.max(0, v - 18);
    gImg.data[i + 3] = 255;
  }
  gCtx.putImageData(gImg, 0, 0);
  const grainPattern = ctx.createPattern(grainCanvas, "repeat");

  // ===========================================================================
  // ESTILHAÇOS 3D PROJETIVOS (z -> câmera: crescem vindo para quem assiste!)
  // ===========================================================================
  const FOCAL = 1.0;

  const estilhacosDiagonais = [
    { peca: 0, ox: 935, oy: 965, z0: 1.02, vx: -280, vy: -310, vz: 1.48, g: 240, rot0: 0.25, vrot: -7.2, sc: 0.36 },
    { peca: 2, ox: 985, oy: 975, z0: 0.98, vx: 310,  vy: -260, vz: 1.56, g: 260, rot0: -0.4, vrot: 8.1,  sc: 0.38 },
    { peca: 4, ox: 910, oy: 990, z0: 1.06, vx: -420, vy: -170, vz: 1.32, g: 220, rot0: 0.9,  vrot: -9.5, sc: 0.30 },
    { peca: 7, ox: 1010,oy: 960, z0: 1.04, vx: 440,  vy: -350, vz: 1.40, g: 250, rot0: -0.8, vrot: 9.0,  sc: 0.31 },
    { peca: 1, ox: 960, oy: 978, z0: 0.95, vx: -95,  vy: -430, vz: 1.68, g: 210, rot0: 0.5,  vrot: 6.8,  sc: 0.34 },
    { peca: 5, ox: 950, oy: 988, z0: 1.00, vx: 145,  vy: -480, vz: 1.62, g: 230, rot0: -1.1, vrot: -8.4, sc: 0.28 },
    { peca: 6, ox: 975, oy: 995, z0: 1.08, vx: -520, vy: -80,  vz: 1.24, g: 280, rot0: 0.1,  vrot: 10.2, sc: 0.26 },
    { peca: 3, ox: 945, oy: 226, z0: 1.55, vx: -240, vy: -120, vz: 1.52, g: 210, rot0: -0.2, vrot: -7.8, sc: 0.26 },
    { peca: 0, ox: 980, oy: 222, z0: 1.50, vx: 265,  vy: -95,  vz: 1.58, g: 230, rot0: 0.6,  vrot: 7.4,  sc: 0.25 },
    { peca: 5, ox: 925, oy: 234, z0: 1.62, vx: -370, vy: 65,   vz: 1.38, g: 260, rot0: 1.2,  vrot: -9.8, sc: 0.22 },
    { peca: 7, ox: 995, oy: 228, z0: 1.58, vx: 380,  vy: 45,   vz: 1.44, g: 250, rot0: -0.9, vrot: 9.2,  sc: 0.22 },
    { peca: 2, ox: 960, oy: 224, z0: 1.45, vx: 55,   vy: 150,  vz: 1.66, g: 190, rot0: 0.3,  vrot: -6.5, sc: 0.24 },
    { peca: 4, ox: 940, oy: 218, z0: 1.68, vx: -155, vy: 210,  vz: 1.34, g: 240, rot0: -0.6, vrot: 8.6,  sc: 0.20 },
    { peca: 6, ox: 985, oy: 235, z0: 1.64, vx: 190,  vy: 195,  vz: 1.40, g: 240, rot0: 0.8,  vrot: -8.9, sc: 0.20 },
  ];

  const estilhacosLadra = [
    { peca: 0, ox: 942, oy: 825, z0: 1.45, vx: -290, vy: -195, vz: 1.52, g: 210, rot0: 0.2,  vrot: -8.4, sc: 0.17 },
    { peca: 3, ox: 980, oy: 822, z0: 1.42, vx: 315,  vy: -175, vz: 1.58, g: 220, rot0: -0.4, vrot: 7.9,  sc: 0.17 },
    { peca: 6, ox: 960, oy: 830, z0: 1.38, vx: -85,  vy: -260, vz: 1.66, g: 190, rot0: 0.8,  vrot: -9.6, sc: 0.15 },
    { peca: 4, ox: 952, oy: 832, z0: 1.50, vx: 185,  vy: -285, vz: 1.46, g: 200, rot0: -0.9, vrot: 9.1,  sc: 0.14 },
    { peca: 7, ox: 970, oy: 826, z0: 1.54, vx: -420, vy: -75,  vz: 1.36, g: 230, rot0: 0.4,  vrot: -10.4,sc: 0.14 },
    { peca: 1, ox: 944, oy: 562, z0: 1.40, vx: -310, vy: -145, vz: 1.56, g: 200, rot0: -0.3, vrot: -7.6, sc: 0.16 },
    { peca: 2, ox: 978, oy: 566, z0: 1.38, vx: 325,  vy: -120, vz: 1.62, g: 210, rot0: 0.5,  vrot: 8.2,  sc: 0.16 },
    { peca: 5, ox: 960, oy: 568, z0: 1.34, vx: 90,   vy: 140,  vz: 1.68, g: 190, rot0: -0.7, vrot: 9.4,  sc: 0.15 },
    { peca: 7, ox: 950, oy: 560, z0: 1.48, vx: -210, vy: 175,  vz: 1.44, g: 220, rot0: 0.9,  vrot: -8.8, sc: 0.13 },
    { peca: 6, ox: 972, oy: 570, z0: 1.52, vx: 430,  vy: 55,   vz: 1.38, g: 210, rot0: -1.1, vrot: 10.1, sc: 0.13 },
  ];

  const lascasPapel = Array.from({ length: 22 }, (_, i) => {
    const ang = (i / 22) * Math.PI * 2 + (i % 3) * 0.27;
    const vel = 240 + (i % 5) * 95;
    return {
      vx: Math.cos(ang) * vel,
      vy: Math.sin(ang) * vel * 0.85 - 90,
      vz: 1.25 + (i % 4) * 0.22,
      w: 10 + (i % 4) * 6,
      h: 5 + (i % 3) * 4,
      rot0: i * 0.7,
      vrot: (i % 2 === 0 ? 1 : -1) * (6 + (i % 5) * 2.2),
      cor: i % 3 === 0 ? "#7c4624" : i % 2 === 0 ? "#2e241e" : "#4a3324",
    };
  });

  function desenharEstilhacos3D(lista, dt, camCx, camCy, comLascas, origemLascas) {
    if (dt <= 0 || dt > 1.35) return;

    if (comLascas && dt < 0.85) {
      for (const l of lascasPapel) {
        const z = 1.15 - l.vz * dt;
        if (z <= 0.10) continue;
        const proj = FOCAL / z;
        const wx = origemLascas[0] + l.vx * dt;
        const wy = origemLascas[1] + l.vy * dt + 140 * dt * dt;
        const sx = camCx + (wx - camCx) * proj;
        const sy = camCy + (wy - camCy) * proj;
        if (sx < -120 || sx > W + 120 || sy < -120 || sy > H + 120) continue;
        const alpha = smooth(dt / 0.03) * (1 - smooth((dt - 0.45) / 0.38)) * clamp((z - 0.10) / 0.18);
        ctx.save();
        ctx.globalAlpha = alpha * 0.85;
        ctx.translate(sx, sy);
        ctx.rotate(l.rot0 + l.vrot * dt);
        ctx.scale(proj, proj);
        ctx.fillStyle = l.cor;
        ctx.beginPath();
        ctx.moveTo(-l.w / 2, -l.h / 2);
        ctx.lineTo(l.w * 0.45, -l.h * 0.35);
        ctx.lineTo(l.w / 2, l.h / 2);
        ctx.lineTo(-l.w * 0.35, l.h * 0.4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    const ordenados = lista
      .map((f) => ({ f, z: f.z0 - f.vz * dt }))
      .filter((item) => item.z > 0.14)
      .sort((a, b) => b.z - a.z);

    for (const { f, z } of ordenados) {
      const proj = FOCAL / z;
      const wx = f.ox + f.vx * dt;
      const wy = f.oy + f.vy * dt + 0.5 * f.g * dt * dt;
      const sx = camCx + (wx - camCx) * proj;
      const sy = camCy + (wy - camCy) * proj;
      const sc = f.sc * proj;
      const [rx, ry, rw, rh] = pecasElos[f.peca];
      const maxDim = Math.max(rw, rh) * sc;
      if (sx < -maxDim || sx > W + maxDim || sy < -maxDim || sy > H + maxDim) continue;

      const nearFade = clamp((z - 0.14) / 0.14);
      const alpha = smooth(dt / 0.025) * nearFade * (1 - smooth((dt - 1.05) / 0.28));
      if (alpha <= 0.005) continue;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(sx, sy);
      ctx.rotate(f.rot0 + f.vrot * dt);
      ctx.scale(sc, sc);
      ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
      ctx.shadowBlur = Math.min(28, 6 * proj);
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(imgs.elosKit, rx, ry, rw, rh, -rw / 2, -rh / 2, rw, rh);
      ctx.restore();
    }
  }

  function desenharSombrasLadra(trocaPose, intensidadeLuz) {
    const peEsqX = lerp(920, 924, trocaPose);
    const peEsqY = lerp(851, 849, trocaPose);
    const peDirX = lerp(1001, 996, trocaPose);
    const peDirY = lerp(842, 842, trocaPose);

    ctx.save();
    ctx.filter = "blur(28px)";
    const gradProj = ctx.createLinearGradient(960, 845, 960, 1020);
    gradProj.addColorStop(0, `rgba(6, 3, 2, ${0.58 + intensidadeLuz * 0.10})`);
    gradProj.addColorStop(0.50, `rgba(8, 4, 2, ${0.26 + intensidadeLuz * 0.06})`);
    gradProj.addColorStop(1, "rgba(8, 4, 2, 0)");
    ctx.fillStyle = gradProj;
    ctx.beginPath();
    ctx.ellipse(960, 912, 82, 86, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(960, 851);
    ctx.scale(1, 0.28);
    const ao = ctx.createRadialGradient(0, 0, 12, 0, 0, 128);
    ao.addColorStop(0, "rgba(4, 2, 1, 0.78)");
    ao.addColorStop(0.50, "rgba(6, 3, 2, 0.42)");
    ao.addColorStop(1, "rgba(6, 3, 2, 0)");
    ctx.fillStyle = ao;
    ctx.fillRect(-130, -130, 260, 260);
    ctx.restore();

    const pes = [
      [peEsqX, peEsqY + 1, 36, 10],
      [peDirX, peDirY + 1, 34, 9.5],
    ];
    for (const [px, py, rx, ry] of pes) {
      ctx.save();
      ctx.translate(px, py);
      ctx.scale(1, ry / rx);
      const g = ctx.createRadialGradient(0, 0, 2, 0, 0, rx);
      g.addColorStop(0, "rgba(2, 1, 0, 0.90)");
      g.addColorStop(0.55, "rgba(4, 2, 1, 0.48)");
      g.addColorStop(1, "rgba(4, 2, 1, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(-rx, -rx, rx * 2, rx * 2);
      ctx.restore();
    }
  }

  function desenharSombraAlgema(dropY, alpha) {
    if (alpha <= 0.005) return;
    const proximidade = clamp(1 - Math.abs(dropY) / 220);
    const rx = lerp(125, 86, proximidade);
    const ry = lerp(34, 20, proximidade);
    ctx.save();
    ctx.globalAlpha = alpha * lerp(0.25, 0.90, proximidade);
    ctx.translate(960, 899);
    ctx.scale(1, ry / rx);
    const g = ctx.createRadialGradient(0, 0, 12, 0, 0, rx);
    g.addColorStop(0, "rgba(3, 1, 0, 0.95)");
    g.addColorStop(0.65, "rgba(5, 2, 1, 0.55)");
    g.addColorStop(1, "rgba(5, 2, 1, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(-rx, -rx, rx * 2, rx * 2);
    ctx.restore();
  }

  function desenharLadraViva(img, t, alivioPostura, alpha) {
    if (alpha <= 0.005) return;
    const sx = 845;
    const sw = 240;
    const yTop = 250;
    const yBot = 860;
    const alturaTotal = yBot - yTop;
    const faixaH = 4;

    const resp = Math.sin(t * 1.52);
    const microSway = Math.sin(t * 0.94 + 0.6) * 1.35 + Math.cos(t * 0.47) * 0.65;

    ctx.save();
    ctx.globalAlpha = clamp(alpha);
    ctx.imageSmoothingQuality = "high";

    for (let y = yTop; y < yBot; y += faixaH) {
      const v = (y - yTop) / alturaTotal;
      const pesoSup = Math.pow(clamp((0.80 - v) / 0.80), 1.65);
      const pesoPeito = Math.exp(-Math.pow((v - 0.26) / 0.18, 2));

      const dx = pesoSup * microSway;
      const dy = -(pesoSup * (resp * 1.65 + alivioPostura * 3.8));
      const expandX = 1 + pesoPeito * (resp * 0.0055 + alivioPostura * 0.008);
      const dw = sw * expandX;
      const drawX = sx - (dw - sw) / 2 + dx;

      ctx.drawImage(img, sx, y, sw, faixaH + 0.6, drawX, y + dy, dw, faixaH + 0.6);
    }
    ctx.restore();
  }

  function desenharNevoaRasteira(t, intensidade) {
    ctx.save();
    const drift1 = Math.sin(t * 0.32) * 85;
    const drift2 = Math.cos(t * 0.24 + 1.1) * 110;
    const nuvens = [
      { x: 960 + drift1, y: 888, rx: 560, ry: 92, a: 0.15 + intensidade * 0.06, rgb: "198, 108, 46" },
      { x: 780 + drift2, y: 925, rx: 460, ry: 78, a: 0.10 + intensidade * 0.04, rgb: "145, 72, 28" },
      { x: 1150 - drift1 * 0.8, y: 912, rx: 480, ry: 82, a: 0.11 + intensidade * 0.04, rgb: "165, 84, 34" },
    ];
    ctx.globalCompositeOperation = "screen";
    for (const n of nuvens) {
      ctx.save();
      ctx.translate(n.x, n.y);
      ctx.scale(1, n.ry / n.rx);
      const g = ctx.createRadialGradient(0, 0, 15, 0, 0, n.rx);
      g.addColorStop(0, `rgba(${n.rgb}, ${n.a})`);
      g.addColorStop(0.55, `rgba(${n.rgb}, ${n.a * 0.35})`);
      g.addColorStop(1, `rgba(${n.rgb}, 0)`);
      ctx.fillStyle = g;
      ctx.fillRect(-n.rx, -n.rx, n.rx * 2, n.rx * 2);
      ctx.restore();
    }
    ctx.restore();
  }

  function desenharLightWrap(t, intensidade) {
    const pulso = (1 - Math.cos((t * Math.PI * 2) / 3.6)) / 2;
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.translate(960, 485);
    ctx.scale(1, 1.55);
    const r = 195 + intensidade * 45;
    const g = ctx.createRadialGradient(0, 0, 18, 0, 0, r);
    const a = 0.09 + pulso * 0.04 + intensidade * 0.08;
    g.addColorStop(0, `rgba(255, 148, 56, ${a})`);
    g.addColorStop(0.55, `rgba(205, 88, 28, ${a * 0.42})`);
    g.addColorStop(1, "rgba(150, 52, 16, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(-r, -r, r * 2, r * 2);
    ctx.restore();
  }

  function desenharMetadeCorrente(img, pivo, anguloRad, dx, dy, scaleExtra, alpha) {
    if (alpha <= 0.005) return;
    ctx.save();
    ctx.globalAlpha = clamp(alpha);
    ctx.translate(pivo[0] + dx, pivo[1] + dy);
    ctx.rotate(anguloRad);
    ctx.scale(scaleExtra, scaleExtra);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, -pivo[0], -pivo[1], W, H);
    ctx.restore();
  }

  function aplicarCamera(zoom, focusX, focusY, shakeX, shakeY, rot) {
    ctx.translate(W / 2 + shakeX, H / 2 + shakeY);
    ctx.rotate(rot);
    ctx.scale(zoom, zoom);
    ctx.translate(-focusX, -focusY);
  }

  function desenharContraluz(t, intensidade, punch) {
    const pulso = (1 - Math.cos((t * Math.PI * 2) / 3.4)) / 2;
    const rx = 580 + pulso * 55 + intensidade * 170 + punch * 90;
    const ry = 440 + pulso * 35 + intensidade * 115 + punch * 60;
    ctx.save();
    ctx.translate(960, 565);
    ctx.scale(1, ry / rx);
    const g = ctx.createRadialGradient(0, 0, 20, 0, 0, rx);
    const a = 0.10 + pulso * 0.05 + intensidade * 0.16 + punch * 0.12;
    g.addColorStop(0, `rgba(255, 145, 55, ${a})`);
    g.addColorStop(0.45, `rgba(196, 86, 26, ${a * 0.46})`);
    g.addColorStop(1, "rgba(120, 42, 12, 0)");
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = g;
    ctx.fillRect(-rx, -rx, rx * 2, rx * 2);
    ctx.restore();
  }

  function quadro(t) {
    const tEmenda = smooth(t / cues.emendaTake01Fim);
    const tPreTensao = smooth((t - 1.85) / 0.95) * (t < cues.rupturaDiagonais ? 1 : 0);
    const dtRuptDiag = Math.max(0, t - cues.rupturaDiagonais);
    const tAvanco = easeInOutCubic((t - cues.avancoCamera) / (cues.rupturaLadra - cues.avancoCamera));
    const dtRuptLadra = Math.max(0, t - cues.rupturaLadra);
    const tTrocaPose = smooth((t - 8.55) / 0.55);
    const tRecuoFinal = easeInOutCubic((t - cues.ladraLivreAvanca) / (cues.saida - cues.ladraLivreAvanca));

    const punchDiag = dtRuptDiag > 0 && dtRuptDiag < 0.42 ? Math.exp(-dtRuptDiag * 8.5) : 0;
    const punchLadra = dtRuptLadra > 0 && dtRuptLadra < 0.36 ? Math.exp(-dtRuptLadra * 9.5) : 0;
    const camKick = punchDiag * 0.048 + punchLadra * 0.032;

    const shakeDiag = dtRuptDiag > 0 && dtRuptDiag < 0.40 ? Math.exp(-dtRuptDiag * 8.5) * 24 : 0;
    const shakeLadra = dtRuptLadra > 0 && dtRuptLadra < 0.34 ? Math.exp(-dtRuptLadra * 9.5) * 15 : 0;
    const shakeX =
      Math.sin(t * 88) * (shakeDiag + shakeLadra) +
      Math.sin(t * 72) * tPreTensao * 3.5;
    const shakeY =
      Math.cos(t * 102) * (shakeDiag * 0.8 + shakeLadra * 0.8) +
      Math.cos(t * 64) * tPreTensao * 2.8;

    const swayX = Math.sin(t * 0.55) * 5.0;
    const swayY = Math.cos(t * 0.44) * 3.4;
    const swayRot = Math.sin(t * 0.33) * 0.0026;

    // Estados ativos da tipografia cinética (também dão micro-respiro na câmera)
    const estadosTexto = blocos.map((b) => estadoDoBloco(b, t)).filter(Boolean);
    const leitura = estadosTexto.find((e) => e.avanco > 0);
    const textBoost = leitura ? leitura.avanco * 0.015 : 0;

    const zoomBase =
      1.0 +
      smooth(t / 5.6) * 0.05 +
      tAvanco * 0.25 +
      smooth((t - 8.4) / 2.8) * 0.03 -
      tRecuoFinal * 0.26 +
      camKick +
      textBoost;

    const focusX = 960 + swayX * 0.45;
    const focusY = lerp(540, 562, tAvanco) - tRecuoFinal * 22 + swayY * 0.45;

    ctx.fillStyle = "#070504";
    ctx.fillRect(0, 0, W, H);

    // CAMADA 1: FUNDO VOID + CONTRALUZ + SOMBRAS + ALGEMA + LADRA VIVA + NÉVOA
    ctx.save();
    aplicarCamera(zoomBase, focusX, focusY, shakeX * 0.45, shakeY * 0.45, swayRot);

    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(imgs.voidBg, 0, 0, W, H);

    const forcaLuz =
      0.16 +
      tAvanco * 0.24 +
      smooth((t - 8.4) / 1.4) * 0.36 +
      tRecuoFinal * 0.34;
    desenharContraluz(t, forcaLuz, punchDiag * 0.5 + punchLadra * 0.8);
    desenharSombrasLadra(tTrocaPose, forcaLuz);

    if (dtRuptLadra > 0) {
      const pQueda = clamp(dtRuptLadra / 0.46);
      let dropY = 0;
      if (pQueda < 0.78) {
        const u = pQueda / 0.78;
        dropY = -205 * (1 - u * u);
      } else {
        const u = (pQueda - 0.78) / 0.22;
        dropY = -12 * Math.sin(u * Math.PI);
      }
      const rotAlgema = (1 - smooth(dtRuptLadra / 0.40)) * 0.26;
      const alphaAlgema = smooth(dtRuptLadra / 0.08);

      desenharSombraAlgema(dropY, alphaAlgema);

      ctx.save();
      ctx.globalAlpha = alphaAlgema;
      ctx.translate(pivos.algemaPiso[0], pivos.algemaPiso[1] + dropY);
      ctx.rotate(rotAlgema);
      ctx.drawImage(imgs.algemaChao, -pivos.algemaPiso[0], -pivos.algemaPiso[1], W, H);
      ctx.restore();
    }

    const alivio = smooth((t - 8.55) / 1.6);
    if (1 - tTrocaPose > 0.005) {
      desenharLadraViva(imgs.ladraPresa, t, 0, 1 - tTrocaPose);
    }
    if (tTrocaPose > 0.005) {
      desenharLadraViva(imgs.ladraLivre, t, alivio, tTrocaPose);
    }

    desenharLightWrap(t, forcaLuz);
    desenharNevoaRasteira(t, forcaLuz);
    ctx.restore();

    // CAMADA 2: CORRENTE DIAGONAL SUPERIOR / MEIO
    const zoomMeio = 1.0 + smooth(t / 5.6) * 0.08 + tAvanco * 1.20 + camKick * 1.25;
    const alphaMeio = 1 - smooth((t - 7.3) / 1.1);
    if (alphaMeio > 0.005) {
      ctx.save();
      aplicarCamera(zoomMeio, focusX, focusY, shakeX * 0.78, shakeY * 0.78, swayRot * 1.25);

      const vibM = Math.sin(t * 105) * tPreTensao * 4.5;
      const puxaM = tPreTensao * 10;
      let angME = 0;
      let angMD = 0;
      if (dtRuptDiag > 0) {
        const chicote = easeOutQuint(dtRuptDiag / 0.52);
        const osc = Math.exp(-dtRuptDiag * 0.65) * Math.sin(dtRuptDiag * 4.2);
        angME = chicote * 1.18 + osc * 0.24;
        angMD = -chicote * 1.12 - osc * 0.22;
      }

      const abreM = tAvanco * 195;
      desenharMetadeCorrente(imgs.meioEsq, pivos.meioEsq, angME, -puxaM - abreM, vibM, 1.0, alphaMeio);
      desenharMetadeCorrente(imgs.meioDir, pivos.meioDir, angMD, puxaM + abreM, -vibM, 1.0, alphaMeio);
      ctx.restore();
    }

    // CAMADA 3: CORRENTE DIAGONAL INFERIOR / FRENTE
    const zoomFrente = 1.0 + smooth(t / 5.6) * 0.12 + tAvanco * 1.95 + camKick * 1.65;
    const alphaFrente = 1 - smooth((t - 6.7) / 1.0);
    if (alphaFrente > 0.005) {
      ctx.save();
      aplicarCamera(zoomFrente, focusX, focusY, shakeX * 1.18, shakeY * 1.18, swayRot * 1.65);

      const vibF = Math.sin(t * 96 + 1.1) * tPreTensao * 6.5;
      const puxaF = tPreTensao * 16;
      let angFE = 0;
      let angFD = 0;
      let dropFD = 0;
      if (dtRuptDiag > 0) {
        const chicote = easeOutQuint(dtRuptDiag / 0.58);
        const osc = Math.exp(-dtRuptDiag * 0.56) * Math.sin(dtRuptDiag * 3.4);
        angFE = chicote * 0.96 + osc * 0.20;
        angFD = -chicote * 0.72 - osc * 0.17;
        dropFD = chicote * 145;
      }

      const abreF = tAvanco * 340;
      desenharMetadeCorrente(imgs.frenteEsq, pivos.frenteEsq, angFE, -puxaF - abreF, vibF, 1.0, alphaFrente);
      desenharMetadeCorrente(imgs.frenteDir, pivos.frenteDir, angFD, puxaF + abreF, dropFD - vibF, 1.0, alphaFrente);
      ctx.restore();
    }

    // CAMADA 4A: TIPOGRAFIA CINÉTICA DO 1º REFRÃO (ATRAS DOS ESTILHAÇOS QUE VOAM NA LENTE!)
    for (const estado of estadosTexto) {
      desenharBloco(estado, t);
    }

    // CAMADA 4B: ESTILHAÇOS 3D VOANDO EM DIREÇÃO À LENTE (PASSAM NA FRENTE DO TEXTO!)
    desenharEstilhacos3D(estilhacosDiagonais, dtRuptDiag, 960, 540, true, pivos.frenteRuptura);
    desenharEstilhacos3D(estilhacosLadra, dtRuptLadra, 960, 560, true, pivos.ladraPulsos);

    // CAMADA 5: EMENDA INICIAL PARTINDO DO TAKE 01 (0.00 -> 0.42s)
    if (tEmenda < 0.999) {
      const a01 = 1 - tEmenda;
      const z01 = 1.0 + tEmenda * 0.16;
      ctx.save();
      ctx.globalAlpha = a01;
      ctx.translate(W / 2, H / 2);
      ctx.scale(z01, z01);
      ctx.drawImage(imgs.ancora01, -W / 2, -H / 2, W, H);
      ctx.restore();
    }

    // CAMADA 6: GRÃO UNIFICADO + VINHETA
    ctx.save();
    ctx.globalAlpha = 0.032;
    ctx.globalCompositeOperation = "overlay";
    const gx = Math.floor((t * 24 * 53) % 256);
    const gy = Math.floor((t * 24 * 37) % 256);
    ctx.translate(-gx, -gy);
    ctx.fillStyle = grainPattern;
    ctx.fillRect(gx, gy, W, H);
    ctx.restore();

    ctx.save();
    const vig = ctx.createRadialGradient(W / 2, H * 0.52, W * 0.28, W / 2, H * 0.52, W * 0.72);
    vig.addColorStop(0, "rgba(0,0,0,0)");
    vig.addColorStop(1, "rgba(4,2,1,0.34)");
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  const cursor = { t: 0 };
  const duracao = quadros / fps;
  const timeline = gsap.timeline({ paused: true });
  timeline.to(cursor, {
    t: duracao,
    duration: duracao,
    ease: "none",
    onUpdate: () => quadro(cursor.t),
  });
  window.__timelines = window.__timelines || {};
  window.__timelines.correntes02 = timeline;
  quadro(0);
});
