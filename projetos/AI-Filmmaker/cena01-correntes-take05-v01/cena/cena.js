window.addEventListener("load", () => {
  const imgs = {
    ancora04: document.getElementById("ancora04"),
    ponteBg: document.getElementById("ponteBg"),
    voidBg: document.getElementById("voidBg"),
    veuEsq: document.getElementById("veuEsq"),
    veuDir: document.getElementById("veuDir"),
    jesusCostas: document.getElementById("jesusCostas"),
    ladraLivre: document.getElementById("ladraLivre"),
    meioEsq: document.getElementById("meioEsq"),
    meioDir: document.getElementById("meioDir"),
    elosKit: document.getElementById("elosKit"),
    algemaChao: document.getElementById("algemaChao"),
    correnteChao: document.getElementById("correnteChao"),
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
  const easeOutCubic = (v) => 1 - Math.pow(1 - clamp(v), 3);
  const easeOutQuint = (v) => 1 - Math.pow(1 - clamp(v), 5);
  const easeInOutCubic = (v) => {
    const p = clamp(v);
    return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
  };
  const lerp = (a, b, t) => a + (b - a) * t;

  // ===========================================================================
  // MOTOR DE TIPOGRAFIA CINÉTICA (PADRÃO APROVADO TAKES 01 A 04)
  // ===========================================================================
  function comporLinha({ base, x, termos }, maxLargura) {
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
    const fatorLinha = totalBruto > maxLargura ? maxLargura / totalBruto : 1;

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
    const limite = b.maxLargura || 600;
    const palavras = b.linhas.flatMap((linha) => comporLinha(linha, limite));
    const entrada = Math.min(...palavras.map((p) => p.entrada));
    const ultimoTermo = Math.max(...palavras.map((p) => p.entrada));
    return { ...b, palavras, entrada, ultimoTermo };
  });

  function desenharPalavra(termo, t, opacidade, sentido) {
    const decorrido = t - termo.entrada;
    if (decorrido <= 0) return;
    const impacto = termo.tamanho >= 95;
    const entrada = clamp(decorrido / (impacto ? 0.38 : 0.24));
    const viagem = Math.pow(1 - entrada, 3);
    const encaixe = 1 - Math.pow(1 - entrada, 2) * Math.cos(entrada * 4.5);
    const escala = 1 + (impacto ? 0.36 : 0.20) * (encaixe - 1);
    const direcao = termo.indice % 2 === 0 ? sentido : -sentido;
    const eixoY = -termo.tamanho * 0.36;

    ctx.save();
    ctx.translate(
      termo.meio + direcao * (impacto ? 46 : 24) * viagem,
      termo.base + eixoY + (impacto ? 56 : -22) * viagem
    );
    ctx.rotate(direcao * viagem * (impacto ? 0.09 : 0.055));
    ctx.scale(escala, escala);
    ctx.globalAlpha = opacidade * smooth(decorrido / 0.11);
    ctx.font = termo.fonte;
    ctx.letterSpacing = termo.espaco;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.lineJoin = "round";

    ctx.shadowColor = "rgba(4, 2, 1, 0.92)";
    ctx.shadowBlur = impacto ? 22 : 14;
    ctx.shadowOffsetY = impacto ? 7 : 4;
    ctx.strokeStyle = "rgba(9, 5, 3, 0.96)";
    ctx.lineWidth = impacto ? 8 : 5.5;
    ctx.strokeText(termo.frase, 0, -eixoY);

    ctx.shadowColor = termo.cor === "ambar" ? "rgba(255, 148, 42, 0.48)" : "rgba(0, 0, 0, 0.35)";
    ctx.shadowBlur = termo.cor === "ambar" ? 26 : 10;
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
      tilt: intensidade * blocoAtual.sentido * Math.sin(fase - 0.35) * 0.018,
    };
  }

  function desenharBloco({ blocoAtual, saida, tilt }, t) {
    const { centro, inclinacao, palavras, entrada, ultimoTermo, sentido, central } = blocoAtual;
    const aprox = smooth((t - entrada) / 0.46);
    const acento = smooth((t - ultimoTermo) / 0.72);
    const z = 0.95 + aprox * 0.05 + acento * 0.03 - saida * 0.16;
    const dxSaida = central ? 0 : sentido * saida * 135;
    const dySaida = central ? -saida * 52 : -saida * 64;

    ctx.save();
    ctx.translate(
      centro[0] - (central ? 0 : sentido * (1 - aprox) * 40) + dxSaida,
      centro[1] + (1 - aprox) * 28 + dySaida
    );
    ctx.rotate(
      inclinacao -
        (central ? 0 : sentido * (1 - aprox) * 0.06) +
        (central ? 0 : sentido * saida * 0.08) +
        tilt
    );
    ctx.scale(z, z);
    for (const termo of palavras) {
      desenharPalavra(termo, t, 1 - saida, sentido);
    }
    ctx.restore();
  }

  // ===========================================================================
  // GRÃO UNIFICADO + SILHUETA DE CRUZ EM PAPEL RASGADO REAL (TEXTURA DO VÉU)
  // ===========================================================================
  const grainCanvas = document.createElement("canvas");
  grainCanvas.width = 256;
  grainCanvas.height = 256;
  const gCtx = grainCanvas.getContext("2d");
  const gImg = gCtx.createImageData(256, 256);
  let seed = 5050;
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

  // Pré-gera silhueta de cruz em papel rasgado físico (usando textura real de veuEsq + bordas fibrosas rasgadas!)
  const crossCanvas = document.createElement("canvas");
  crossCanvas.width = 560;
  crossCanvas.height = 760;
  const cCtx = crossCanvas.getContext("2d");

  function caminhoCruzRasgada(targetCtx) {
    let s = 9182;
    const r = () => {
      s = (s * 16807) % 2147483647;
      return ((s - 1) / 2147483646) - 0.5;
    };
    const pts = [];
    function seg(x0, y0, x1, y1, steps, amp) {
      for (let i = 0; i < steps; i++) {
        const u = i / steps;
        const jx = (i === 0 ? 0 : r() * amp);
        const jy = (i === 0 ? 0 : r() * amp);
        pts.push([lerp(x0, x1, u) + jx, lerp(y0, y1, u) + jy]);
      }
    }
    // Contorno horário da cruz em papel rasgado (viga vertical x=244..316, horizontal y=205..268 x=92..468)
    seg(244, 42,  316, 40,  10, 5.5);  // topo
    seg(316, 40,  318, 205, 18, 6.5);  // lado dir sup
    seg(318, 205, 468, 202, 18, 6.5);  // braço dir topo
    seg(468, 202, 464, 268, 9,  5.5);  // ponta dir
    seg(464, 268, 318, 266, 18, 6.5);  // braço dir base
    seg(318, 266, 326, 738, 42, 7.0);  // tronco dir
    seg(326, 738, 234, 738, 12, 5.0);  // base
    seg(234, 738, 242, 266, 42, 7.0);  // tronco esq
    seg(242, 266, 94,  268, 18, 6.5);  // braço esq base
    seg(94,  268, 92,  204, 9,  5.5);  // ponta esq
    seg(92,  204, 242, 205, 18, 6.5);  // braço esq topo
    seg(242, 205, 244, 42,  18, 6.5);  // lado esq sup

    targetCtx.beginPath();
    targetCtx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) {
      targetCtx.lineTo(pts[i][0], pts[i][1]);
    }
    targetCtx.closePath();
  }

  // Halo cobre traseiro nas fibras rasgadas da cruz
  cCtx.save();
  caminhoCruzRasgada(cCtx);
  cCtx.shadowColor = "rgba(255, 146, 52, 0.75)";
  cCtx.shadowBlur = 18;
  cCtx.strokeStyle = "rgba(218, 118, 46, 0.65)";
  cCtx.lineWidth = 4.5;
  cCtx.stroke();
  cCtx.restore();

  // Preenchimento com textura real de papel rasgado escuro (veuEsq)
  cCtx.save();
  caminhoCruzRasgada(cCtx);
  cCtx.clip();
  cCtx.filter = "brightness(0.46) contrast(1.18)";
  cCtx.drawImage(imgs.veuEsq, 80, 120, 620, 820, 0, 0, 560, 760);
  // Gradiente quente sutil de contraluz subindo pela base
  const gCruz = cCtx.createLinearGradient(280, 40, 280, 740);
  gCruz.addColorStop(0, "rgba(10, 5, 3, 0.65)");
  gCruz.addColorStop(0.65, "rgba(28, 12, 5, 0.35)");
  gCruz.addColorStop(1, "rgba(6, 3, 1, 0.72)");
  cCtx.fillStyle = gCruz;
  cCtx.fillRect(0, 0, 560, 760);
  cCtx.restore();

  // ===========================================================================
  // ESTILHAÇOS 3D (RUPTURA EM "IRMÃO FIEL!" 00:09.850)
  // ===========================================================================
  const FOCAL = 1.0;
  const estilhacosIrmao = [
    { peca: 0, ox: 942, oy: 495, z0: 0.96, vx: -340, vy: -310, vz: 1.56, g: 240, rot0: 0.3,  vrot: -8.2, sc: 0.34 },
    { peca: 2, ox: 978, oy: 505, z0: 0.94, vx: 350,  vy: -270, vz: 1.60, g: 250, rot0: -0.4, vrot: 8.6,  sc: 0.34 },
    { peca: 4, ox: 912, oy: 518, z0: 1.04, vx: -460, vy: -150, vz: 1.38, g: 220, rot0: 0.9,  vrot: -9.6, sc: 0.28 },
    { peca: 7, ox: 1008,oy: 488, z0: 1.02, vx: 475,  vy: -190, vz: 1.44, g: 240, rot0: -0.8, vrot: 9.2,  sc: 0.28 },
    { peca: 1, ox: 960, oy: 500, z0: 0.90, vx: -90,  vy: -420, vz: 1.68, g: 210, rot0: 0.5,  vrot: 7.2,  sc: 0.32 },
    { peca: 5, ox: 950, oy: 512, z0: 1.00, vx: 145,  vy: 280,  vz: 1.62, g: 230, rot0: -1.0, vrot: -8.8, sc: 0.26 },
    { peca: 6, ox: 974, oy: 492, z0: 1.08, vx: -410, vy: 210,  vz: 1.32, g: 260, rot0: 0.2,  vrot: 10.0, sc: 0.24 },
    { peca: 3, ox: 946, oy: 515, z0: 1.06, vx: 400,  vy: 235,  vz: 1.36, g: 250, rot0: -0.6, vrot: -9.1, sc: 0.24 },
  ];

  const lascasPapel = Array.from({ length: 22 }, (_, i) => {
    const ang = (i / 22) * Math.PI * 2 + (i % 3) * 0.27;
    const vel = 230 + (i % 5) * 90;
    return {
      vx: Math.cos(ang) * vel,
      vy: Math.sin(ang) * vel * 0.85 - 95,
      vz: 1.24 + (i % 4) * 0.22,
      w: 10 + (i % 4) * 6,
      h: 5 + (i % 3) * 4,
      rot0: i * 0.7,
      vrot: (i % 2 === 0 ? 1 : -1) * (6 + (i % 5) * 2.2),
      cor: i % 3 === 0 ? "#7c4624" : i % 2 === 0 ? "#2e241e" : "#4a3324",
    };
  });

  function desenharEstilhacos3D(lista, dt, camCx, camCy, origem) {
    if (dt <= 0 || dt > 1.32) return;
    if (dt < 0.85) {
      for (const l of lascasPapel) {
        const z = 1.15 - l.vz * dt;
        if (z <= 0.10) continue;
        const proj = FOCAL / z;
        const wx = origem[0] + l.vx * dt;
        const wy = origem[1] + l.vy * dt + 140 * dt * dt;
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
        ctx.fillRect(-l.w / 2, -l.h / 2, l.w, l.h);
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
      const alpha = smooth(dt / 0.025) * clamp((z - 0.14) / 0.14) * (1 - smooth((dt - 1.0) / 0.30));
      if (alpha <= 0.005) continue;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(sx, sy);
      ctx.rotate(f.rot0 + f.vrot * dt);
      ctx.scale(sc, sc);
      ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
      ctx.shadowBlur = Math.min(26, 6 * proj);
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(imgs.elosKit, rx, ry, rw, rh, -rw / 2, -rh / 2, rw, rh);
      ctx.restore();
    }
  }

  // ===========================================================================
  // FUNÇÕES COMUNS: CÂMERA, CONTRALUZ, SOMBRAS, JESUS E LADRA VIVOS (ZERO BOUNCE)
  // ===========================================================================
  function aplicarCamera(zoom, focusX, focusY, shakeX, shakeY, rot) {
    ctx.translate(W / 2 + shakeX, H / 2 + shakeY);
    ctx.rotate(rot);
    ctx.scale(zoom, zoom);
    ctx.translate(-focusX, -focusY);
  }

  function desenharContraluz(t, intensidade, cx, cy, raioBase) {
    const pulso = (1 - Math.cos((t * Math.PI * 2) / 3.6)) / 2;
    const rx = raioBase + pulso * 52 + intensidade * 175;
    const ry = raioBase * 0.74 + pulso * 34 + intensidade * 115;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(1, ry / rx);
    const g = ctx.createRadialGradient(0, 0, 18, 0, 0, rx);
    const a = 0.09 + pulso * 0.04 + intensidade * 0.15;
    g.addColorStop(0, `rgba(255, 152, 58, ${a})`);
    g.addColorStop(0.45, `rgba(198, 88, 26, ${a * 0.48})`);
    g.addColorStop(1, "rgba(115, 38, 10, 0)");
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = g;
    ctx.fillRect(-rx, -rx, rx * 2, rx * 2);
    ctx.restore();
  }

  function desenharSombrasJesus(intensidadeLuz, alpha) {
    if (alpha <= 0.005) return;
    ctx.save();
    ctx.globalAlpha = clamp(alpha);
    ctx.save();
    ctx.filter = "blur(30px)";
    const gradProj = ctx.createLinearGradient(960, 845, 960, 1035);
    gradProj.addColorStop(0, `rgba(6, 3, 2, ${0.58 + intensidadeLuz * 0.10})`);
    gradProj.addColorStop(0.50, `rgba(8, 4, 2, ${0.26 + intensidadeLuz * 0.05})`);
    gradProj.addColorStop(1, "rgba(8, 4, 2, 0)");
    ctx.fillStyle = gradProj;
    ctx.beginPath();
    ctx.ellipse(955, 916, 118, 88, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(956, 848);
    ctx.scale(1, 0.26);
    const ao = ctx.createRadialGradient(0, 0, 16, 0, 0, 152);
    ao.addColorStop(0, "rgba(4, 2, 1, 0.80)");
    ao.addColorStop(0.52, "rgba(6, 3, 2, 0.42)");
    ao.addColorStop(1, "rgba(6, 3, 2, 0)");
    ctx.fillStyle = ao;
    ctx.fillRect(-154, -154, 308, 308);
    ctx.restore();

    const pes = [
      [876, 845, 52, 12],
      [1036, 834, 46, 11],
    ];
    for (const [px, py, rx, ry] of pes) {
      ctx.save();
      ctx.translate(px, py);
      ctx.scale(1, ry / rx);
      const g = ctx.createRadialGradient(0, 0, 3, 0, 0, rx);
      g.addColorStop(0, "rgba(2, 1, 0, 0.90)");
      g.addColorStop(0.55, "rgba(4, 2, 1, 0.45)");
      g.addColorStop(1, "rgba(4, 2, 1, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(-rx, -rx, rx * 2, rx * 2);
      ctx.restore();
    }
    ctx.restore();
  }

  function desenharJesusVivo(img, t, alivio, alpha) {
    if (alpha <= 0.005) return;
    const natW = 1024;
    const natH = 1536;
    const dstH = 595;
    const dstW = Math.round(natW * (dstH / natH));
    const baseX = Math.round(960 - dstW * (505 / natW));
    const baseY = 261;
    const faixas = 148;
    const sh = natH / faixas;
    const dh = dstH / faixas;

    const resp = Math.sin(t * 1.42);
    const microSway = Math.sin(t * 0.82 + 0.4) * 1.35 + Math.cos(t * 0.40) * 0.60;

    ctx.save();
    ctx.globalAlpha = clamp(alpha);
    ctx.filter = "brightness(0.88) contrast(1.06) saturate(0.92)";
    ctx.imageSmoothingQuality = "high";
    for (let i = 0; i < faixas; i++) {
      const v = i / faixas;
      const pesoSup = Math.pow(clamp((0.84 - v) / 0.84), 1.65);
      const pesoTorso = Math.exp(-Math.pow((v - 0.30) / 0.20, 2));
      const dx = pesoSup * microSway;
      const dy = -(pesoSup * (resp * 1.45 + alivio * 2.0));
      const expandX = 1 + pesoTorso * (resp * 0.0052);
      const wF = dstW * expandX;
      const xF = baseX - (wF - dstW) / 2 + dx;
      ctx.drawImage(img, 0, i * sh, natW, sh + 1.0, xF, baseY + i * dh + dy, wF, dh + 0.7);
    }
    ctx.restore();
  }

  function desenharSombrasLadra(intensidadeLuz, alpha) {
    if (alpha <= 0.005) return;
    ctx.save();
    ctx.globalAlpha = clamp(alpha);
    ctx.save();
    ctx.filter = "blur(28px)";
    const gradProj = ctx.createLinearGradient(960, 845, 960, 1020);
    gradProj.addColorStop(0, `rgba(6, 3, 2, ${0.56 + intensidadeLuz * 0.10})`);
    gradProj.addColorStop(0.50, `rgba(8, 4, 2, ${0.25 + intensidadeLuz * 0.05})`);
    gradProj.addColorStop(1, "rgba(8, 4, 2, 0)");
    ctx.fillStyle = gradProj;
    ctx.beginPath();
    ctx.ellipse(960, 912, 82, 84, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(960, 849);
    ctx.scale(1, 0.27);
    const ao = ctx.createRadialGradient(0, 0, 12, 0, 0, 126);
    ao.addColorStop(0, "rgba(4, 2, 1, 0.78)");
    ao.addColorStop(0.50, "rgba(6, 3, 2, 0.40)");
    ao.addColorStop(1, "rgba(6, 3, 2, 0)");
    ctx.fillStyle = ao;
    ctx.fillRect(-128, -128, 256, 256);
    ctx.restore();

    const pes = [
      [pivos.ladraPePasso[0], pivos.ladraPePasso[1] + 1, 35, 9.5],
      [pivos.ladraPeApoio[0], pivos.ladraPeApoio[1] + 1, 35, 9.5],
    ];
    for (const [px, py, rx, ry] of pes) {
      ctx.save();
      ctx.translate(px, py);
      ctx.scale(1, ry / rx);
      const g = ctx.createRadialGradient(0, 0, 2, 0, 0, rx);
      g.addColorStop(0, "rgba(2, 1, 0, 0.90)");
      g.addColorStop(0.55, "rgba(4, 2, 1, 0.46)");
      g.addColorStop(1, "rgba(4, 2, 1, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(-rx, -rx, rx * 2, rx * 2);
      ctx.restore();
    }
    ctx.restore();
  }

  function desenharLadraViva(img, t, alivio, alpha) {
    if (alpha <= 0.005) return;
    const sx = 845;
    const sw = 245;
    const yTop = 250;
    const yBot = 860;
    const alturaTotal = yBot - yTop;
    const faixaH = 4;

    const resp = Math.sin(t * 1.48);
    const microSway = Math.sin(t * 0.88 + 0.5) * 1.25 + Math.cos(t * 0.44) * 0.55;

    ctx.save();
    ctx.globalAlpha = clamp(alpha);
    ctx.imageSmoothingQuality = "high";
    for (let y = yTop; y < yBot; y += faixaH) {
      const v = (y - yTop) / alturaTotal;
      const pesoSup = Math.pow(clamp((0.80 - v) / 0.80), 1.65);
      const pesoPeito = Math.exp(-Math.pow((v - 0.26) / 0.18, 2));
      const dx = pesoSup * microSway;
      const dy = -(pesoSup * (resp * 1.55 + alivio * 2.2));
      const expandX = 1 + pesoPeito * (resp * 0.0054);
      const dw = sw * expandX;
      const drawX = sx - (dw - sw) / 2 + dx;
      ctx.drawImage(img, sx, y, sw, faixaH + 0.6, drawX, y + dy, dw, faixaH + 0.6);
    }
    ctx.restore();
  }

  function desenharNevoaRasteira(t, intensidade) {
    ctx.save();
    const drift1 = Math.sin(t * 0.30) * 80;
    const drift2 = Math.cos(t * 0.22 + 1.1) * 100;
    const nuvens = [
      { x: 960 + drift1, y: 892, rx: 560, ry: 90, a: 0.13 + intensidade * 0.05, rgb: "194, 102, 42" },
      { x: 740 + drift2, y: 924, rx: 460, ry: 80, a: 0.09 + intensidade * 0.04, rgb: "145, 72, 28" },
      { x: 1180 - drift1 * 0.8, y: 912, rx: 490, ry: 82, a: 0.11 + intensidade * 0.05, rgb: "178, 88, 34" },
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
    const a = 0.08 + pulso * 0.04 + intensidade * 0.075;
    g.addColorStop(0, `rgba(255, 150, 56, ${a})`);
    g.addColorStop(0.55, `rgba(204, 88, 26, ${a * 0.42})`);
    g.addColorStop(1, "rgba(150, 52, 16, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(-r, -r, r * 2, r * 2);
    ctx.restore();
  }

  function desenharMetadeCorrente(img, pivo, anguloRad, dx, dy, alpha) {
    if (alpha <= 0.005) return;
    ctx.save();
    ctx.globalAlpha = clamp(alpha);
    ctx.translate(pivo[0] + dx, pivo[1] + dy);
    ctx.rotate(anguloRad);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, -pivo[0], -pivo[1], W, H);
    ctx.restore();
  }

  // ===========================================================================
  // BLOCO A: FILIPENSES 2:7 (00:00.0 – 00:10.75) — JESUS + SILHUETA CRUZ + CORRENTE ROMPENDO
  // ===========================================================================
  function desenharBlocoA(t, textBoost) {
    const pCruz = easeInOutCubic((t - cues.cruzSurgeInicio) / (cues.cruzPlena - cues.cruzSurgeInicio));
    const dtRupt = Math.max(0, t - cues.rupturaIrmaoFiel);
    const tPre = smooth((t - 8.6) / 1.25) * (t < cues.rupturaIrmaoFiel ? 1 : 0);

    const punch = dtRupt > 0 && dtRupt < 0.40 ? Math.exp(-dtRupt * 8.8) : 0;
    const shakeAmt = dtRupt > 0 && dtRupt < 0.36 ? Math.exp(-dtRupt * 8.8) * 20 : 0;
    const shakeX = Math.sin(t * 92) * shakeAmt + Math.sin(t * 76) * tPre * 3.5;
    const shakeY = Math.cos(t * 108) * shakeAmt * 0.8 + Math.cos(t * 64) * tPre * 2.5;

    const swayX = Math.sin(t * 0.44) * 3.6;
    const swayY = Math.cos(t * 0.36) * 2.4;
    const swayRot = Math.sin(t * 0.25) * 0.0018;

    // Continua suavemente do zoom final do Take 04 v03 (1.11, focusY=505) para um push firme até 1.20
    const zoom = 1.11 + smooth(t / 10.5) * 0.09 + punch * 0.045 + textBoost * 0.6;
    const focusY = lerp(505, 495, smooth(t / 10.5)) + swayY * 0.4;

    ctx.fillStyle = "#070504";
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    aplicarCamera(zoom, 960 + swayX * 0.4, focusY, shakeX * 0.5, shakeY * 0.5, swayRot);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(imgs.ponteBg, 0, 0, W, H);

    const luz = 0.42 + pCruz * 0.35 + punch * 0.40;
    desenharContraluz(t, luz, 960, 490, 620);

    // Silhueta rasgada da cruz emergindo no horizonte luminoso atrás de Jesus (05.2 -> 07.0)
    if (pCruz > 0.005) {
      const escCruz = lerp(0.84, 0.96, pCruz);
      const yCruz = lerp(120, 82, pCruz);
      ctx.save();
      ctx.globalAlpha = pCruz * 0.88;
      ctx.translate(960, 760);
      ctx.scale(escCruz, escCruz);
      ctx.drawImage(crossCanvas, -280, -738 + (yCruz - 82));
      ctx.restore();

      // Longa sombra difusa da cruz projetada pelo chão em direção ao espectador
      ctx.save();
      ctx.globalAlpha = pCruz * 0.38;
      ctx.filter = "blur(26px)";
      ctx.fillStyle = "#050201";
      ctx.beginPath();
      ctx.moveTo(915, 760);
      ctx.lineTo(1005, 760);
      ctx.lineTo(1160, 1080);
      ctx.lineTo(760, 1080);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    desenharSombrasJesus(luz, 1.0);
    desenharJesusVivo(imgs.jesusCostas, t, 0.65 + pCruz * 0.35, 1.0);
    desenharLightWrap(t, luz);
    desenharNevoaRasteira(t, luz * 0.8);
    ctx.restore();

    // Corrente diagonal íntegra (t02-meio) entra em "Tomou minha corrente" (5.3) e rompe em "IRMÃO FIEL!" (9.85)!
    const alphaCor = smooth((t - 5.25) / 0.55) * (1 - smooth((t - 10.35) / 0.45));
    if (alphaCor > 0.004) {
      const vibC = tPre * Math.sin(t * 102) * 5.2;
      const puxaC = tPre * 11;
      let angE = 0, angD = 0, abreC = 0;
      if (dtRupt > 0) {
        const chicote = easeOutQuint(dtRupt / 0.48);
        const osc = Math.exp(-dtRupt * 0.6) * Math.sin(dtRupt * 4.2);
        angE = chicote * 1.18 + osc * 0.22;
        angD = -chicote * 1.12 - osc * 0.20;
        abreC = easeOutCubic(dtRupt / 0.95) * 440;
      }
      const zoomC = 1.48 + smooth((t - 5.3) / 4.5) * 0.14 + punch * 0.28 + smooth(dtRupt / 0.9) * 0.85;
      ctx.save();
      ctx.translate(W / 2 + shakeX * 1.1, H * 0.48 + shakeY * 1.1);
      ctx.rotate(-0.12);
      ctx.scale(zoomC, zoomC);
      ctx.translate(-960, -226);
      desenharMetadeCorrente(imgs.meioEsq, pivos.meioEsq, angE, -puxaC - abreC, vibC, alphaCor);
      desenharMetadeCorrente(imgs.meioDir, pivos.meioDir, angD, puxaC + abreC, -vibC, alphaCor);
      ctx.restore();
    }

    return { dtRupt };
  }

  // ===========================================================================
  // BLOCO B: ROMANOS 6:6 (00:10.75 – 00:21.5) — VELHO ENTERRADO -> CRIATURA NOVA!
  // ===========================================================================
  function desenharBlocoB(t, textBoost) {
    const dtB = Math.max(0, t - cues.blocoBInicio);
    const pEnterra = easeInOutCubic((t - cues.enterradoInicio) / (cues.enterradoFim - cues.enterradoInicio));
    const pNova = easeInOutCubic((t - cues.criaturaNovaInicio) / (cues.criaturaNovaPlena - cues.criaturaNovaInicio));
    const dtNova = Math.max(0, t - cues.criaturaNovaInicio);

    const swayX = Math.sin(t * 0.48) * 3.8;
    const swayY = Math.cos(t * 0.38) * 2.5;
    const swayRot = Math.sin(t * 0.26) * 0.0018;

    const zoom = 1.02 + smooth(dtB / 10.7) * 0.09 + textBoost * 0.6;
    const focusY = lerp(545, 505, pNova) + swayY * 0.4;

    ctx.fillStyle = "#070504";
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    aplicarCamera(zoom, 960 + swayX * 0.4, focusY, 0, 0, swayRot);
    ctx.imageSmoothingQuality = "high";

    // Fundo evolui do Void sombrio ("o velho foi crucificado / enterrado") para o horizonte luminoso ("criatura nova"!)
    ctx.drawImage(imgs.voidBg, 0, 0, W, H);
    if (pNova > 0.004) {
      ctx.save();
      ctx.globalAlpha = pNova;
      ctx.drawImage(imgs.ponteBg, 0, 0, W, H);
      ctx.restore();
    }

    const luz = lerp(0.16, 0.56, pNova) + smooth((t - 18.5) / 2.5) * 0.18;
    desenharContraluz(t, luz, 960, lerp(580, 560, pNova), 600);

    // Sombra distante da cruz no fundo do Void durante "Romanos 6:6, o velho foi crucificado" (desaparece na criatura nova)
    const alphaCruzB = (1 - pNova) * 0.42;
    if (alphaCruzB > 0.005) {
      ctx.save();
      ctx.globalAlpha = alphaCruzB;
      ctx.translate(960, 790);
      ctx.scale(0.76, 0.76);
      ctx.drawImage(crossCanvas, -280, -738);
      ctx.restore();
    }

    // Velhas algemas e correntes caídas no chão (presentes em "o velho foi crucificado" e ENTERRADAS pelas camadas de papel!)
    const alphaVelho = 1 - pNova;
    if (alphaVelho > 0.005) {
      ctx.save();
      ctx.globalAlpha = alphaVelho;
      // Sombras no piso
      ctx.save();
      ctx.translate(960, 900);
      ctx.scale(1, 0.22);
      const gA = ctx.createRadialGradient(0, 0, 14, 0, 0, 120);
      gA.addColorStop(0, "rgba(2, 1, 0, 0.90)");
      gA.addColorStop(1, "rgba(2, 1, 0, 0)");
      ctx.fillStyle = gA;
      ctx.fillRect(-120, -120, 240, 240);
      ctx.restore();

      ctx.drawImage(imgs.algemaChao, 0, 0, W, H);

      // Par de correntes caídas nas laterais da algema
      ctx.save();
      ctx.translate(1285, 920);
      ctx.scale(0.82, 0.82);
      ctx.drawImage(imgs.correnteChao, -pivos.correntePesPivo[0], -pivos.correntePesPivo[1], W, H);
      ctx.restore();

      ctx.save();
      ctx.translate(635, 916);
      ctx.scale(-0.82, 0.82);
      ctx.drawImage(imgs.correnteChao, -pivos.correntePesPivo[0], -pivos.correntePesPivo[1], W, H);
      ctx.restore();
      ctx.restore();
    }

    // CAMADAS ESCURAS DE PAPEL RASGADO SUBINDO PARA ENTERRAR O VELHO (13.2 -> 15.8) E DESCENDO NA CRIATURA NOVA!
    // Usa os recortes reais veuEsq/veuDir rotacionados 90° em baixo (sangrados em baixo/esq/dir => ZERO borda reta!)
    const nivelEnterro = pEnterra * (1 - pNova);
    if (nivelEnterro > 0.005) {
      const ySubida = lerp(1140, 745, nivelEnterro);
      ctx.save();
      ctx.globalAlpha = clamp(nivelEnterro * 1.35) * (1 - pNova);
      ctx.translate(W / 2, ySubida);
      ctx.rotate(-Math.PI / 2); // borda rasgada fibrosa fica virada para CIMA cobrindo a algema!
      ctx.scale(1.18, 2.05);
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(imgs.veuEsq, -920, -540, W, H);
      ctx.restore();
    }

    // CRIATURA NOVA (15.85 -> 21.5): Ladra livre ressurge firme de costas no horizonte luminoso (y=842, zero bounce!)
    if (pNova > 0.005) {
      desenharSombrasLadra(luz, pNova);
      desenharLadraViva(imgs.ladraLivre, t, smooth(dtNova / 1.8), pNova);
      ctx.save();
      ctx.globalAlpha = pNova;
      desenharLightWrap(t, luz);
      ctx.restore();
    }

    desenharNevoaRasteira(t, luz * 0.85);
    ctx.restore();
  }

  // ===========================================================================
  // QUADRO PRINCIPAL
  // ===========================================================================
  function quadro(t) {
    const estadosTexto = blocos.map((b) => estadoDoBloco(b, t)).filter(Boolean);
    const leitura = estadosTexto.find((e) => e.avanco > 0);
    const textBoost = leitura ? leitura.avanco * 0.014 : 0;

    let dtRuptA = 0;

    if (t < cues.blocoBInicio) {
      const rA = desenharBlocoA(t, textBoost);
      dtRuptA = rA.dtRupt;
    } else {
      desenharBlocoB(t, textBoost);
    }

    // WIPE FÍSICO DE VÉUS EM PAPEL RASGADO NA TRANSIÇÃO A -> B (10.35 -> 11.15, sangria integral scale=1.06!)
    if (t >= cues.transicaoABInicio && t <= cues.transicaoABFim) {
      const u = clamp((t - cues.transicaoABInicio) / (cues.transicaoABFim - cues.transicaoABInicio));
      // 0 -> 0.5 fecha os véus sobre a tela; 0.5 -> 1.0 reabre revelando o Bloco B!
      const fecho = u < 0.5 ? easeInOutCubic(u * 2) : easeInOutCubic((1 - u) * 2);
      const deslize = lerp(1120, -45, fecho); // -45 garante sobreposição total no centro no pico (u=0.5)!
      const esc = 1.06;

      ctx.save();
      ctx.translate(-deslize, 540);
      ctx.scale(esc, esc);
      ctx.translate(0, -540);
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(imgs.veuEsq, 0, 0, W, H);
      ctx.restore();

      ctx.save();
      ctx.translate(W + deslize, 540);
      ctx.scale(esc, esc);
      ctx.translate(-W, -540);
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(imgs.veuDir, 0, 0, W, H);
      ctx.restore();
    }

    // EMENDA INICIAL CONTÍNUA PARTINDO DO TAKE 04 v03 (0.00 -> 0.35s)
    if (t < cues.emendaTake04Fim) {
      const a04 = 1 - smooth(t / cues.emendaTake04Fim);
      if (a04 > 0.003) {
        ctx.save();
        ctx.globalAlpha = a04;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(imgs.ancora04, 0, 0, W, H);
        ctx.restore();
      }
    }

    // TIPOGRAFIA CINÉTICA DO 3º VERSO (limpa totalmente em 21.32s < 21.35s)
    for (const estado of estadosTexto) {
      desenharBloco(estado, t);
    }

    // ESTILHAÇOS 3D NA RUPTURA DE "IRMÃO FIEL!" (09.85s)
    if (dtRuptA > 0) {
      desenharEstilhacos3D(estilhacosIrmao, dtRuptA, 960, 500, [960, 500]);
    }

    // GRÃO UNIFICADO + VINHETA
    ctx.save();
    ctx.globalAlpha = 0.030;
    ctx.globalCompositeOperation = "overlay";
    const gx = Math.floor((t * 24 * 53) % 256);
    const gy = Math.floor((t * 24 * 37) % 256);
    ctx.translate(-gx, -gy);
    ctx.fillStyle = grainPattern;
    ctx.fillRect(gx, gy, W, H);
    ctx.restore();

    ctx.save();
    const vig = ctx.createRadialGradient(W / 2, H * 0.50, W * 0.30, W / 2, H * 0.50, W * 0.74);
    vig.addColorStop(0, "rgba(0,0,0,0)");
    vig.addColorStop(1, "rgba(4,2,1,0.32)");
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
  window.__timelines.correntes05 = timeline;
  quadro(0);
});
