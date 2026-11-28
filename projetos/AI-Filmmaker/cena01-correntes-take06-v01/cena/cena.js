window.addEventListener("load", () => {
  const imgs = {
    ancora05: document.getElementById("ancora05"),
    ponteBg: document.getElementById("ponteBg"),
    coturnosBg: document.getElementById("coturnosBg"),
    correntePes: document.getElementById("correntePes"),
    jesusCostas: document.getElementById("jesusCostas"),
    ladraLivre: document.getElementById("ladraLivre"),
    frenteEsq: document.getElementById("frenteEsq"),
    frenteDir: document.getElementById("frenteDir"),
    meioEsq: document.getElementById("meioEsq"),
    meioDir: document.getElementById("meioDir"),
    elosKit: document.getElementById("elosKit"),
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
  // MOTOR DE TIPOGRAFIA CINÉTICA (PADRÃO APROVADO TAKES 01 A 05)
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

  function desenharPalavra(termo, t, opacidade, sentido, calmo) {
    const decorrido = t - termo.entrada;
    if (decorrido <= 0) return;
    const impacto = termo.tamanho >= 95 && !calmo;
    const durIn = calmo ? 0.65 : impacto ? 0.38 : 0.24;
    const entrada = clamp(decorrido / durIn);
    const viagem = Math.pow(1 - entrada, 3);
    const encaixe = calmo
      ? 1 - Math.pow(1 - entrada, 2) * 0.14
      : 1 - Math.pow(1 - entrada, 2) * Math.cos(entrada * 4.5);
    const escala = calmo
      ? 0.94 + 0.06 * smooth(entrada)
      : 1 + (impacto ? 0.36 : 0.20) * (encaixe - 1);
    const direcao = termo.indice % 2 === 0 ? sentido : -sentido;
    const eixoY = -termo.tamanho * 0.36;

    ctx.save();
    ctx.translate(
      termo.meio + (calmo ? 0 : direcao * (impacto ? 46 : 24) * viagem),
      termo.base + eixoY + (calmo ? 24 * viagem : (impacto ? 56 : -22) * viagem)
    );
    ctx.rotate(calmo ? 0 : direcao * viagem * (impacto ? 0.09 : 0.055));
    ctx.scale(escala, escala);
    ctx.globalAlpha = opacidade * smooth(decorrido / (calmo ? 0.32 : 0.11));
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

    ctx.shadowColor = termo.cor === "ambar" ? "rgba(255, 148, 42, 0.50)" : "rgba(0, 0, 0, 0.35)";
    ctx.shadowBlur = termo.cor === "ambar" ? 28 : 10;
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
      tilt: blocoAtual.calmo ? 0 : intensidade * blocoAtual.sentido * Math.sin(fase - 0.35) * 0.018,
    };
  }

  function desenharBloco({ blocoAtual, saida, tilt }, t) {
    const { centro, inclinacao, palavras, entrada, ultimoTermo, sentido, calmo, central } = blocoAtual;
    const aprox = smooth((t - entrada) / (calmo ? 0.90 : 0.46));
    const acento = smooth((t - ultimoTermo) / 0.72);
    const z = calmo
      ? 0.97 + aprox * 0.03 + acento * 0.02 - saida * 0.06
      : 0.95 + aprox * 0.05 + acento * 0.03 - saida * 0.16;
    const dxSaida = central ? 0 : sentido * saida * 135;
    const dySaida = central ? -saida * (calmo ? 28 : 52) : -saida * 64;

    ctx.save();
    ctx.translate(
      centro[0] - (central ? 0 : sentido * (1 - aprox) * 40) + dxSaida,
      centro[1] + (1 - aprox) * (calmo ? 18 : 28) + dySaida
    );
    ctx.rotate(
      inclinacao -
        (central ? 0 : sentido * (1 - aprox) * 0.06) +
        (central ? 0 : sentido * saida * 0.08) +
        tilt
    );
    ctx.scale(z, z);
    for (const termo of palavras) {
      desenharPalavra(termo, t, 1 - saida, sentido, calmo);
    }
    ctx.restore();
  }

  // ===========================================================================
  // GRÃO UNIFICADO + ESTILHAÇOS 3D + PARTÍCULAS DE ENCERRAMENTO
  // ===========================================================================
  const grainCanvas = document.createElement("canvas");
  grainCanvas.width = 256;
  grainCanvas.height = 256;
  const gCtx = grainCanvas.getContext("2d");
  const gImg = gCtx.createImageData(256, 256);
  let seed = 6060;
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

  const FOCAL = 1.0;

  // Estilhaços do X íntegro na 1ª parte do Refrão Final (00:02.650)
  const estilhacos1A = [
    { peca: 0, ox: 940, oy: 530, z0: 0.96, vx: -340, vy: -310, vz: 1.56, g: 240, rot0: 0.3,  vrot: -8.2, sc: 0.35 },
    { peca: 2, ox: 980, oy: 542, z0: 0.94, vx: 350,  vy: -270, vz: 1.60, g: 250, rot0: -0.4, vrot: 8.6,  sc: 0.35 },
    { peca: 4, ox: 910, oy: 556, z0: 1.04, vx: -470, vy: -150, vz: 1.38, g: 220, rot0: 0.9,  vrot: -9.6, sc: 0.29 },
    { peca: 7, ox: 1010,oy: 522, z0: 1.02, vx: 485,  vy: -195, vz: 1.44, g: 240, rot0: -0.8, vrot: 9.2,  sc: 0.29 },
    { peca: 1, ox: 960, oy: 536, z0: 0.90, vx: -95,  vy: -430, vz: 1.68, g: 210, rot0: 0.5,  vrot: 7.2,  sc: 0.33 },
    { peca: 5, ox: 952, oy: 548, z0: 1.00, vx: 145,  vy: 280,  vz: 1.62, g: 230, rot0: -1.0, vrot: -8.8, sc: 0.27 },
    { peca: 6, ox: 974, oy: 526, z0: 1.08, vx: -420, vy: 210,  vz: 1.32, g: 260, rot0: 0.2,  vrot: 10.0, sc: 0.25 },
    { peca: 3, ox: 946, oy: 552, z0: 1.06, vx: 410,  vy: 235,  vz: 1.36, g: 250, rot0: -0.6, vrot: -9.1, sc: 0.25 },
  ];

  // Maior explosão de estilhaços 3D na ruptura final das 4 correntes em X (00:16.200)
  const estilhacosXFinal = [
    { peca: 0, ox: 930, oy: 960, z0: 0.96, vx: -320, vy: -340, vz: 1.56, g: 240, rot0: 0.25, vrot: -7.8, sc: 0.39 },
    { peca: 2, ox: 990, oy: 970, z0: 0.93, vx: 345,  vy: -290, vz: 1.62, g: 260, rot0: -0.4, vrot: 8.5,  sc: 0.39 },
    { peca: 4, ox: 895, oy: 985, z0: 1.02, vx: -470, vy: -195, vz: 1.38, g: 220, rot0: 0.9,  vrot: -9.8, sc: 0.33 },
    { peca: 7, ox: 1025,oy: 955, z0: 1.00, vx: 485,  vy: -370, vz: 1.46, g: 250, rot0: -0.8, vrot: 9.2,  sc: 0.33 },
    { peca: 1, ox: 960, oy: 975, z0: 0.90, vx: -110, vy: -470, vz: 1.74, g: 210, rot0: 0.5,  vrot: 7.0,  sc: 0.36 },
    { peca: 5, ox: 948, oy: 988, z0: 0.98, vx: 160,  vy: -520, vz: 1.68, g: 230, rot0: -1.1, vrot: -8.6, sc: 0.31 },
    { peca: 6, ox: 976, oy: 992, z0: 1.06, vx: -550, vy: -85,  vz: 1.28, g: 280, rot0: 0.1,  vrot: 10.4, sc: 0.29 },
    { peca: 3, ox: 944, oy: 950, z0: 1.04, vx: 540,  vy: -115, vz: 1.34, g: 270, rot0: -0.6, vrot: -9.2, sc: 0.29 },
    { peca: 0, ox: 690, oy: 560, z0: 1.14, vx: -370, vy: -220, vz: 1.50, g: 220, rot0: 0.7,  vrot: -8.8, sc: 0.31 },
    { peca: 2, ox: 1230,oy: 560, z0: 1.14, vx: 370,  vy: -220, vz: 1.50, g: 220, rot0: -0.7, vrot: 8.8,  sc: 0.31 },
    { peca: 5, ox: 760, oy: 490, z0: 1.22, vx: -290, vy: 165,  vz: 1.44, g: 240, rot0: 1.1,  vrot: 9.4,  sc: 0.27 },
    { peca: 7, ox: 1160,oy: 490, z0: 1.22, vx: 290,  vy: 165,  vz: 1.44, g: 240, rot0: -1.1, vrot: -9.4, sc: 0.27 },
    { peca: 3, ox: 942, oy: 228, z0: 1.46, vx: -270, vy: -125, vz: 1.56, g: 210, rot0: -0.2, vrot: -7.8, sc: 0.28 },
    { peca: 0, ox: 982, oy: 222, z0: 1.42, vx: 285,  vy: -100, vz: 1.62, g: 230, rot0: 0.6,  vrot: 7.4,  sc: 0.28 },
    { peca: 5, ox: 920, oy: 236, z0: 1.54, vx: -400, vy: 70,   vz: 1.42, g: 260, rot0: 1.2,  vrot: -9.8, sc: 0.25 },
    { peca: 7, ox: 1000,oy: 230, z0: 1.50, vx: 405,  vy: 50,   vz: 1.48, g: 250, rot0: -0.9, vrot: 9.2,  sc: 0.25 },
    { peca: 2, ox: 960, oy: 224, z0: 1.38, vx: 65,   vy: 170,  vz: 1.70, g: 190, rot0: 0.3,  vrot: -6.5, sc: 0.27 },
    { peca: 4, ox: 938, oy: 218, z0: 1.60, vx: -185, vy: 230,  vz: 1.38, g: 240, rot0: -0.6, vrot: 8.6,  sc: 0.23 },
    { peca: 6, ox: 986, oy: 235, z0: 1.56, vx: 215,  vy: 215,  vz: 1.44, g: 240, rot0: 0.8,  vrot: -8.9, sc: 0.23 },
  ];

  // Elos quebrados caindo nos coturnos (00:08.05)
  const elosCaindoCoturnos = [
    { peca: 0, x0: 410,  y0: -120, vx: -35, vy: 220, g: 2400, delay: 0.00, sc: 0.16, rot0: 0.4,  vrot: -6.5, yChao: 868, frente: false },
    { peca: 3, x0: 1510, y0: -140, vx: 42,  vy: 240, g: 2450, delay: 0.04, sc: 0.16, rot0: -0.5, vrot: 7.0,  yChao: 870, frente: false },
    { peca: 5, x0: 540,  y0: -180, vx: -55, vy: 180, g: 2300, delay: 0.12, sc: 0.14, rot0: 1.0,  vrot: -8.2, yChao: 856, frente: false },
    { peca: 7, x0: 1390, y0: -160, vx: 58,  vy: 200, g: 2350, delay: 0.15, sc: 0.14, rot0: -0.9, vrot: 7.8,  yChao: 858, frente: false },
    { peca: 1, x0: 810,  y0: -150, vx: -62, vy: 340, g: 2650, delay: 0.06, sc: 0.25, rot0: 0.6,  vrot: -7.5, yChao: 992, frente: true },
    { peca: 2, x0: 1110, y0: -170, vx: 68,  vy: 330, g: 2600, delay: 0.10, sc: 0.26, rot0: -0.7, vrot: 8.1,  yChao: 998, frente: true },
    { peca: 4, x0: 930,  y0: -220, vx: -95, vy: 290, g: 2550, delay: 0.18, sc: 0.28, rot0: 0.1,  vrot: 9.2,  yChao: 1035, frente: true },
    { peca: 7, x0: 1020, y0: -200, vx: 90,  vy: 310, g: 2600, delay: 0.20, sc: 0.27, rot0: -0.4, vrot: -8.9, yChao: 1028, frente: true },
  ];

  // Elos e fragmentos caindo em câmera lenta no Encerramento ("A corrente caiu")
  const elosLentosFim = Array.from({ length: 14 }, (_, i) => ({
    peca: i % 8,
    x0: 140 + ((i * 257) % 1640),
    y0: -120 - (i % 5) * 180,
    vy: 62 + (i % 4) * 24,
    swayAmp: 18 + (i % 4) * 9,
    swayFreq: 0.50 + (i % 3) * 0.20,
    sc: 0.11 + (i % 3) * 0.04,
    rot0: i * 1.1,
    vrot: (i % 2 === 0 ? 1 : -1) * (0.55 + (i % 4) * 0.25),
  }));

  const lascasPapel = Array.from({ length: 26 }, (_, i) => {
    const ang = (i / 26) * Math.PI * 2 + (i % 3) * 0.27;
    const vel = 230 + (i % 5) * 95;
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
    if (dt <= 0 || dt > 1.38) return;
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
      const alpha = smooth(dt / 0.025) * clamp((z - 0.14) / 0.14) * (1 - smooth((dt - 1.05) / 0.30));
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

  // ===========================================================================
  // CÂMERA, LUZ, SOMBRAS, LADRA E JESUS VIVOS (COM OFFSET HORIZONTAL PARA LADO A LADO!)
  // ===========================================================================
  function aplicarCamera(zoom, focusX, focusY, shakeX, shakeY, rot) {
    ctx.translate(W / 2 + shakeX, H / 2 + shakeY);
    ctx.rotate(rot);
    ctx.scale(zoom, zoom);
    ctx.translate(-focusX, -focusY);
  }

  function desenharContraluz(t, intensidade, cx, cy, raioBase) {
    const pulso = (1 - Math.cos((t * Math.PI * 2) / 3.6)) / 2;
    const rx = raioBase + pulso * 55 + intensidade * 185;
    const ry = raioBase * 0.74 + pulso * 36 + intensidade * 120;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(1, ry / rx);
    const g = ctx.createRadialGradient(0, 0, 18, 0, 0, rx);
    const a = 0.09 + pulso * 0.04 + intensidade * 0.16;
    g.addColorStop(0, `rgba(255, 156, 62, ${a})`);
    g.addColorStop(0.45, `rgba(202, 92, 28, ${a * 0.48})`);
    g.addColorStop(1, "rgba(115, 38, 10, 0)");
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = g;
    ctx.fillRect(-rx, -rx, rx * 2, rx * 2);
    ctx.restore();
  }

  function desenharSombrasLadra(intensidadeLuz, alpha, offsetX) {
    if (alpha <= 0.005) return;
    ctx.save();
    ctx.globalAlpha = clamp(alpha);
    ctx.translate(offsetX, 0);

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

  function desenharLadraViva(img, t, alivio, alpha, offsetX) {
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
    ctx.translate(offsetX, 0);
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

  function desenharSombrasJesus(intensidadeLuz, alpha, offsetX) {
    if (alpha <= 0.005) return;
    ctx.save();
    ctx.globalAlpha = clamp(alpha);
    ctx.translate(offsetX, 0);

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

  function desenharJesusVivo(img, t, alivio, alpha, offsetX) {
    if (alpha <= 0.005) return;
    const natW = 1024;
    const natH = 1536;
    const dstH = 595;
    const dstW = Math.round(natW * (dstH / natH));
    const baseX = Math.round(960 - dstW * (505 / natW)) + offsetX;
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

  function desenharLightWrap(t, intensidade, cx) {
    const pulso = (1 - Math.cos((t * Math.PI * 2) / 3.6)) / 2;
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.translate(cx, 485);
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

  function desenharCorrenteCaindo(dtLocal, cx, cy, escala, espelhar, escurecer) {
    if (dtLocal <= 0) return;
    const durQueda = 0.36;
    const durQuique = 0.30;
    let dy = 0, rot = 0;
    if (dtLocal < durQueda) {
      const u = clamp(dtLocal / durQueda);
      dy = -980 * (1 - u * u);
      rot = (espelhar ? -0.22 : 0.22) * (1 - u);
    } else if (dtLocal < durQueda + durQuique) {
      const u = clamp((dtLocal - durQueda) / durQuique);
      dy = -28 * Math.sin(u * Math.PI) * (1 - u * 0.62);
      rot = (espelhar ? 0.045 : -0.045) * Math.sin(u * Math.PI);
    }
    const prox = clamp(1 - Math.abs(dy) / 520);
    ctx.save();
    ctx.globalAlpha = lerp(0.10, 0.88, prox);
    ctx.translate(cx, cy + 24 * escala);
    ctx.scale(1, 0.22);
    const rxS = lerp(290, 230, prox) * escala;
    const gS = ctx.createRadialGradient(0, 0, 18, 0, 0, rxS);
    gS.addColorStop(0, "rgba(2, 1, 0, 0.94)");
    gS.addColorStop(0.65, "rgba(4, 2, 1, 0.50)");
    gS.addColorStop(1, "rgba(4, 2, 1, 0)");
    ctx.fillStyle = gS;
    ctx.fillRect(-rxS, -rxS, rxS * 2, rxS * 2);
    ctx.restore();

    ctx.save();
    if (escurecer < 0.99) ctx.filter = `brightness(${escurecer.toFixed(2)})`;
    ctx.translate(cx, cy + dy);
    ctx.rotate(rot);
    ctx.scale(espelhar ? -escala : escala, escala);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(imgs.correntePes, -pivos.correntePesPivo[0], -pivos.correntePesPivo[1], W, H);
    ctx.restore();
  }

  // ===========================================================================
  // BLOCO 1A (00:00.0 – 00:05.3): HORIZONTE + LADRA + X ÍNTEGRO ROMPENDO EM 02.65
  // ===========================================================================
  function desenharBloco1A(t, textBoost) {
    const tPre = smooth((t - 1.55) / 1.1) * (t < cues.ruptura1A ? 1 : 0);
    const dtRupt = Math.max(0, t - cues.ruptura1A);
    const punch = dtRupt > 0 && dtRupt < 0.42 ? Math.exp(-dtRupt * 8.5) : 0;
    const shakeAmt = dtRupt > 0 && dtRupt < 0.38 ? Math.exp(-dtRupt * 8.5) * 22 : 0;
    const shakeX = Math.sin(t * 92) * shakeAmt + Math.sin(t * 76) * tPre * 3.8;
    const shakeY = Math.cos(t * 108) * shakeAmt * 0.8 + Math.cos(t * 64) * tPre * 2.8;

    const zoom = 1.11 + smooth(t / 2.65) * 0.07 - smooth(dtRupt / 2.4) * 0.08 + punch * 0.048 + textBoost * 0.6;
    const focusY = 505 + Math.cos(t * 0.4) * 2.4;

    ctx.fillStyle = "#070504";
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    aplicarCamera(zoom, 960 + Math.sin(t * 0.48) * 3.6, focusY, shakeX * 0.5, shakeY * 0.5, Math.sin(t * 0.28) * 0.0018);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(imgs.ponteBg, 0, 0, W, H);
    const luz = 0.48 + smooth(dtRupt / 1.0) * 0.36 + punch * 0.40;
    desenharContraluz(t, luz, 960, 560, 620);
    desenharSombrasLadra(luz, 1.0, 0);
    desenharLadraViva(imgs.ladraLivre, t, smooth(dtRupt / 1.2), 1.0, 0);
    desenharLightWrap(t, luz, 960);
    desenharNevoaRasteira(t, luz * 0.85);
    ctx.restore();

    // X íntegro (t02-meio orig + espelhada) entra rápido em 0.25 e rompe em 2.65
    const alphaX = smooth((t - 0.15) / 0.35) * (1 - smooth((t - 3.65) / 0.85));
    if (alphaX > 0.004) {
      const vibC = tPre * Math.sin(t * 102) * 5.2;
      const puxaC = tPre * 11;
      let angE = 0, angD = 0, abreC = 0;
      if (dtRupt > 0) {
        const chicote = easeOutQuint(dtRupt / 0.50);
        const osc = Math.exp(-dtRupt * 0.62) * Math.sin(dtRupt * 4.2);
        angE = chicote * 1.18 + osc * 0.22;
        angD = -chicote * 1.12 - osc * 0.20;
        abreC = easeOutCubic(dtRupt / 1.05) * 440;
      }
      const zoomX = 1.62 + punch * 0.28 + smooth(dtRupt / 1.0) * 0.90;

      ctx.save();
      ctx.translate(W / 2 + shakeX * 1.1, H / 2 + shakeY * 1.1);
      ctx.rotate(-0.14);
      ctx.scale(zoomX, zoomX);
      ctx.translate(-960, -226);
      desenharMetadeCorrente(imgs.meioEsq, pivos.meioEsq, angE, -puxaC - abreC, vibC, alphaX);
      desenharMetadeCorrente(imgs.meioDir, pivos.meioDir, angD, puxaC + abreC, -vibC, alphaX);
      ctx.restore();

      ctx.save();
      ctx.translate(W / 2 - shakeX * 1.1, H / 2 + shakeY * 1.1);
      ctx.scale(-1, 1);
      ctx.rotate(-0.14);
      ctx.scale(zoomX * 1.02, zoomX * 1.02);
      ctx.translate(-960, -226);
      desenharMetadeCorrente(imgs.meioEsq, pivos.meioEsq, angE * 1.04, -puxaC - abreC, -vibC, alphaX);
      desenharMetadeCorrente(imgs.meioDir, pivos.meioDir, angD * 1.04, puxaC + abreC, vibC, alphaX);
      ctx.restore();
    }

    return { dtRupt };
  }

  // ===========================================================================
  // BLOCO 1B (00:05.3 – 00:10.8): COTURNOS + 4 CORRENTES + ELOS CAINDO AOS PÉS
  // ===========================================================================
  function desenharBloco1B(t, textBoost) {
    const dtB = t - cues.corteCoturnos;
    const dtQueda = t - cues.quedaCorrenteInicio;
    const dtImp = t - cues.quedaCorrenteImpacto;
    const dtImp2 = t - (cues.quedaCorrenteImpacto + 0.14);
    const impShake =
      (dtImp > 0 && dtImp < 0.34 ? Math.exp(-dtImp * 10.5) * 14 : 0) +
      (dtImp2 > 0 && dtImp2 < 0.34 ? Math.exp(-dtImp2 * 10.5) * 11 : 0);

    const zoom = 1.01 + smooth(dtB / 5.5) * 0.07 + (dtImp > 0 && dtImp < 0.35 ? Math.exp(-dtImp * 9.5) * 0.028 : 0) + textBoost * 0.6;
    ctx.fillStyle = "#070504";
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    aplicarCamera(zoom, 960 + Math.sin(t * 0.55) * 3.5, 540 + Math.cos(t * 0.45) * 2.5, Math.sin(t * 96) * impShake, Math.cos(t * 114) * impShake, Math.sin(t * 0.32) * 0.0018);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(imgs.coturnosBg, 0, 0, W, H);
    desenharContraluz(t, 0.24 + smooth(dtImp / 1.2) * 0.30, 960, 560, 500);

    if (dtQueda > 0) {
      desenharCorrenteCaindo(dtQueda - 0.00, 1515, 868, 0.88, false, 0.82);
      desenharCorrenteCaindo(dtQueda - 0.06, 405,  868, 0.88, true,  0.82);

      for (const e of elosCaindoCoturnos) {
        const dtE = dtQueda - e.delay;
        if (dtE <= 0) continue;
        const disc = e.vy * e.vy + 2 * e.g * (e.yChao - e.y0);
        const tHit = (-e.vy + Math.sqrt(Math.max(0, disc))) / e.g;
        let x, y, rot;
        if (dtE < tHit) {
          x = e.x0 + e.vx * dtE;
          y = e.y0 + e.vy * dtE + 0.5 * e.g * dtE * dtE;
          rot = e.rot0 + e.vrot * dtE;
        } else {
          const dtPos = dtE - tHit;
          const xHit = e.x0 + e.vx * tHit;
          const b = dtPos < 0.26 ? Math.sin((dtPos / 0.26) * Math.PI) * 34 : 0;
          x = xHit + e.vx * Math.min(dtPos, 0.32) * 0.65;
          y = e.yChao - b;
          rot = e.rot0 + e.vrot * (tHit + Math.min(dtPos, 0.26) * 0.45);
        }
        const [rx, ry, rw, rh] = pecasElos[e.peca];
        ctx.save();
        if (!e.frente) ctx.filter = "brightness(0.78)";
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.scale(e.sc, e.sc);
        ctx.shadowColor = "rgba(0, 0, 0, 0.62)";
        ctx.shadowBlur = e.frente ? 14 : 6;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(imgs.elosKit, rx, ry, rw, rh, -rw / 2, -rh / 2, rw, rh);
        ctx.restore();
      }

      desenharCorrenteCaindo(dtQueda - 0.12, 1295, 962, 1.12, false, 1.0);
      desenharCorrenteCaindo(dtQueda - 0.18, 625,  958, 1.12, true,  1.0);
    }

    desenharNevoaRasteira(t, 0.22);
    ctx.restore();
  }

  // ===========================================================================
  // BLOCO 1C + ENCERRAMENTO + SILÊNCIO + BATIDA FINAL + FADE PRETO (00:10.8 – 00:57.0)
  // ===========================================================================
  function desenharBlocoFinal(t, textBoost) {
    const dtC = Math.max(0, t - cues.bloco1CInicio);
    const tPre = smooth((t - 15.05) / 1.15) * (t < cues.rupturaXFinal ? 1 : 0);
    const dtRupt = Math.max(0, t - cues.rupturaXFinal);
    const dtEnc = Math.max(0, t - cues.encerramentoInicio);

    const punchX = dtRupt > 0 && dtRupt < 0.48 ? Math.exp(-dtRupt * 8.0) : 0;
    const shakeXRaw = dtRupt > 0 && dtRupt < 0.44 ? Math.exp(-dtRupt * 8.0) * 28 : 0;

    // Pulsos secos na batida final "Hey! Hey! Hey!" (48.5, 50.0, 51.5, 53.0, 54.0)
    const golpesHey = [48.50, 50.00, 51.50, 52.80, 53.95];
    let pulseHey = 0;
    for (const g of golpesHey) {
      const dg = t - g;
      if (dg > 0 && dg < 0.42) {
        pulseHey += Math.exp(-dg * 10.5);
      }
    }

    const shakeX = Math.sin(t * 88) * (shakeXRaw + pulseHey * 7) + Math.sin(t * 74) * tPre * 4.2;
    const shakeY = Math.cos(t * 102) * (shakeXRaw * 0.8 + pulseHey * 5.5) + Math.cos(t * 66) * tPre * 3.0;

    const swayX = Math.sin(t * 0.40) * 4.0;
    const swayY = Math.cos(t * 0.32) * 2.6;
    const swayRot = Math.sin(t * 0.24) * 0.0018;

    // Evolução épica da câmera: push no X -> recuo majestoso no Encerramento -> calma no silêncio -> pulsos secos no Hey!
    let zoomBase = 1.02 + smooth(dtC / 5.4) * 0.14;
    if (t >= cues.rupturaXFinal) {
      const recuo = easeInOutCubic((t - cues.rupturaXFinal) / 16.0);
      zoomBase = 1.16 - recuo * 0.14;
    }
    if (t >= cues.jesusEntraInicio) {
      zoomBase = 1.02 + smooth((t - cues.jesusEntraInicio) / 11.0) * 0.07;
    }
    if (t >= cues.silencioInicio) {
      zoomBase = 1.09 - smooth((t - cues.silencioInicio) / 5.3) * 0.07;
    }
    const zoom = zoomBase + punchX * 0.055 + pulseHey * 0.032 + textBoost * 0.55;
    const focusY = lerp(520, 502, smooth((t - 21.5) / 6.0)) + swayY * 0.4;

    ctx.fillStyle = "#070504";
    ctx.fillRect(0, 0, W, H);

    // FUNDO: Horizonte luminoso amplo em papel rasgado
    ctx.save();
    aplicarCamera(zoom, 960 + swayX * 0.4, focusY, shakeX * 0.45, shakeY * 0.45, swayRot);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(imgs.ponteBg, 0, 0, W, H);

    const pJesus = easeInOutCubic((t - cues.jesusEntraInicio) / (cues.jesusEntraFim - cues.jesusEntraInicio));
    const pSilencio = smooth((t - cues.silencioInicio) / 1.2);
    const luzBase =
      0.34 +
      smooth(dtRupt / 1.4) * 0.34 +
      pJesus * 0.20 -
      pSilencio * 0.24 +
      punchX * 0.48 +
      pulseHey * 0.52;
    desenharContraluz(t, Math.max(0.14, luzBase), 960, 560, 640);

    // Personagens: Ladra no centro -> desliza suavemente para x=-115 quando Jesus surge ao lado em x=+135 -> ambos somem em fade no silêncio (43.2)!
    const alphaChars = 1 - pSilencio;
    if (alphaChars > 0.004) {
      const dxLadra = -115 * pJesus;
      const dxJesus = 135;

      // Ladra livre plantada em y=842
      desenharSombrasLadra(luzBase, alphaChars, dxLadra);
      desenharLadraViva(imgs.ladraLivre, t, smooth(dtRupt / 1.5), alphaChars, dxLadra);

      // Jesus de costas surgindo ao lado dela em "Eu sou livre em Cristo" (32.0 -> 43.2)
      const alphaJesus = pJesus * alphaChars;
      if (alphaJesus > 0.004) {
        desenharSombrasJesus(luzBase, alphaJesus, dxJesus);
        desenharJesusVivo(imgs.jesusCostas, t, pJesus, alphaJesus, dxJesus);
      }

      ctx.save();
      ctx.globalAlpha = alphaChars;
      desenharLightWrap(t, luzBase, 960);
      ctx.restore();
    }

    desenharNevoaRasteira(t, Math.max(0.18, luzBase * 0.85));
    ctx.restore();

    // X COLOSSAL DE 4 CORRENTES (originais + espelhadas) ATÉ A RUPTURA FINAL EM 16.20s!
    const alphaMeio = 1 - smooth((t - 17.65) / 1.05);
    if (alphaMeio > 0.004) {
      const zoomMeio = 1.01 + smooth(dtC / 5.4) * 0.22 + smooth(dtRupt / 1.8) * 1.15 + punchX * 1.25;
      const vibM = Math.sin(t * 105) * tPre * 4.8;
      const puxaM = tPre * 11;
      let angME = 0, angMD = 0, abreM = 0;
      if (dtRupt > 0) {
        const chicote = easeOutQuint(dtRupt / 0.50);
        const osc = Math.exp(-dtRupt * 0.65) * Math.sin(dtRupt * 4.4);
        angME = chicote * 1.22 + osc * 0.24;
        angMD = -chicote * 1.16 - osc * 0.22;
        abreM = easeOutCubic(dtRupt / 1.35) * 320;
      }
      ctx.save();
      aplicarCamera(zoomMeio, 960 + swayX * 0.45, focusY, shakeX * 0.78, shakeY * 0.78, swayRot * 1.25);
      desenharMetadeCorrente(imgs.meioEsq, pivos.meioEsq, angME, -puxaM - abreM, vibM, alphaMeio);
      desenharMetadeCorrente(imgs.meioDir, pivos.meioDir, angMD, puxaM + abreM, -vibM, alphaMeio);
      ctx.restore();

      ctx.save();
      aplicarCamera(zoomMeio * 1.02, 960 + swayX * 0.45, focusY, -shakeX * 0.78, shakeY * 0.78, -swayRot * 1.25);
      ctx.translate(W, 0);
      ctx.scale(-1, 1);
      desenharMetadeCorrente(imgs.meioEsq, pivos.meioEsq, angME * 1.04, -puxaM - abreM, -vibM, alphaMeio);
      desenharMetadeCorrente(imgs.meioDir, pivos.meioDir, angMD * 1.04, puxaM + abreM, vibM, alphaMeio);
      ctx.restore();
    }

    const alphaFrente = 1 - smooth((t - 17.30) / 1.00);
    if (alphaFrente > 0.004) {
      const zoomFrente = 1.01 + smooth(dtC / 5.4) * 0.28 + smooth(dtRupt / 1.6) * 1.75 + punchX * 1.65;
      const vibF = Math.sin(t * 96 + 1.1) * tPre * 6.8;
      const puxaF = tPre * 16;
      let angFE = 0, angFD = 0, dropFD = 0, abreF = 0;
      if (dtRupt > 0) {
        const chicote = easeOutQuint(dtRupt / 0.56);
        const osc = Math.exp(-dtRupt * 0.56) * Math.sin(dtRupt * 3.6);
        angFE = chicote * 0.98 + osc * 0.20;
        angFD = -chicote * 0.78 - osc * 0.18;
        dropFD = chicote * 155;
        abreF = easeOutCubic(dtRupt / 1.25) * 420;
      }
      ctx.save();
      aplicarCamera(zoomFrente, 960 + swayX * 0.45, focusY, shakeX * 1.18, shakeY * 1.18, swayRot * 1.65);
      desenharMetadeCorrente(imgs.frenteEsq, pivos.frenteEsq, angFE, -puxaF - abreF, vibF, alphaFrente);
      desenharMetadeCorrente(imgs.frenteDir, pivos.frenteDir, angFD, puxaF + abreF, dropFD - vibF, alphaFrente);
      ctx.restore();

      ctx.save();
      aplicarCamera(zoomFrente * 1.02, 960 + swayX * 0.45, focusY, -shakeX * 1.18, shakeY * 1.18, -swayRot * 1.65);
      ctx.translate(W, 0);
      ctx.scale(-1, 1);
      desenharMetadeCorrente(imgs.frenteEsq, pivos.frenteEsq, angFE * 1.03, -puxaF - abreF, -vibF, alphaFrente);
      desenharMetadeCorrente(imgs.frenteDir, pivos.frenteDir, angFD * 1.03, puxaF + abreF, dropFD + vibF, alphaFrente);
      ctx.restore();
    }

    // ELOS QUEBRADOS CAINDO EM CÂMERA LENTA NO ENCERRAMENTO ("A corrente caiu", 21.5 -> 33.5)
    const alphaElosLentos = smooth((t - 21.5) / 1.2) * (1 - smooth((t - 31.8) / 2.0));
    if (alphaElosLentos > 0.005) {
      for (const e of elosLentosFim) {
        const y = ((e.y0 + dtEnc * e.vy) % (H + 220)) - 110;
        const x = e.x0 + Math.sin(dtEnc * e.swayFreq + e.rot0) * e.swayAmp;
        const [rx, ry, rw, rh] = pecasElos[e.peca];
        ctx.save();
        ctx.globalAlpha = alphaElosLentos * 0.62;
        ctx.translate(x, y);
        ctx.rotate(e.rot0 + e.vrot * dtEnc);
        ctx.scale(e.sc, e.sc);
        ctx.drawImage(imgs.elosKit, rx, ry, rw, rh, -rw / 2, -rh / 2, rw, rh);
        ctx.restore();
      }
    }

    return { dtRupt };
  }

  // ===========================================================================
  // QUADRO PRINCIPAL
  // ===========================================================================
  function quadro(t) {
    const estadosTexto = blocos.map((b) => estadoDoBloco(b, t)).filter(Boolean);
    const leitura = estadosTexto.find((e) => e.avanco > 0);
    const textBoost = leitura ? leitura.avanco * 0.014 : 0;

    let dtRupt1A = 0;
    let dtRuptX = 0;

    if (t < cues.corteCoturnos) {
      const r = desenharBloco1A(t, textBoost);
      dtRupt1A = r.dtRupt;
    } else if (t < cues.bloco1CInicio) {
      desenharBloco1B(t, textBoost);
    } else {
      const r = desenharBlocoFinal(t, textBoost);
      dtRuptX = r.dtRupt;
    }

    // EMENDA INICIAL PARTINDO DO TAKE 05 v01 (0.00 -> 0.35s)
    if (t < cues.emendaTake05Fim) {
      const a05 = 1 - smooth(t / cues.emendaTake05Fim);
      if (a05 > 0.003) {
        ctx.save();
        ctx.globalAlpha = a05;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(imgs.ancora05, 0, 0, W, H);
        ctx.restore();
      }
    }

    // TIPOGRAFIA CINÉTICA
    for (const estado of estadosTexto) {
      desenharBloco(estado, t);
    }

    // ESTILHAÇOS 3D VOANDO EM DIREÇÃO À LENTE
    if (dtRupt1A > 0) {
      desenharEstilhacos3D(estilhacos1A, dtRupt1A, 960, 536, [960, 536]);
    }
    if (dtRuptX > 0) {
      desenharEstilhacos3D(estilhacosXFinal, dtRuptX, 960, 540, pivos.frenteRuptura);
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

    // FADE FINAL LIMPO PARA PRETO ABSOLUTO (#000000) PREPARANDO A CORTINA FECHADA (54.40 -> 56.75)
    if (t > cues.fadeFinalInicio) {
      const fOut = smooth((t - cues.fadeFinalInicio) / (cues.fadeFinalFim - cues.fadeFinalInicio));
      ctx.fillStyle = `rgba(0, 0, 0, ${fOut.toFixed(4)})`;
      ctx.fillRect(0, 0, W, H);
    }
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
  window.__timelines.correntes06 = timeline;
  quadro(0);
});
