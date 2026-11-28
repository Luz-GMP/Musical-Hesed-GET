window.addEventListener("load", () => {
  const imgs = {
    ancora03: document.getElementById("ancora03"),
    voidBg: document.getElementById("voidBg"),
    ladraLivre: document.getElementById("ladraLivre"),
    jesusCostas: document.getElementById("jesusCostas"),
    frenteEsq: document.getElementById("frenteEsq"),
    frenteDir: document.getElementById("frenteDir"),
    meioEsq: document.getElementById("meioEsq"),
    meioDir: document.getElementById("meioDir"),
    elosKit: document.getElementById("elosKit"),
    pulsosEsq: document.getElementById("pulsosEsq"),
    pulsosDir: document.getElementById("pulsosDir"),
    coturnosBg: document.getElementById("coturnosBg"),
    correntePes: document.getElementById("correntePes"),
    ponteBg: document.getElementById("ponteBg"),
    veuEsq: document.getElementById("veuEsq"),
    veuDir: document.getElementById("veuDir"),
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
  // MOTOR DE TIPOGRAFIA CINÉTICA (PADRÃO APROVADO TAKES 01, 02 v03 e 03 v03)
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
    const durIn = calmo ? 0.55 : impacto ? 0.38 : 0.24;
    const entrada = clamp(decorrido / durIn);
    const viagem = Math.pow(1 - entrada, 3);
    const encaixe = calmo
      ? 1 - Math.pow(1 - entrada, 2) * 0.18
      : 1 - Math.pow(1 - entrada, 2) * Math.cos(entrada * 4.5);
    const escala = calmo
      ? 0.94 + 0.06 * smooth(entrada)
      : 1 + (impacto ? 0.36 : 0.20) * (encaixe - 1);
    const direcao = termo.indice % 2 === 0 ? sentido : -sentido;
    const eixoY = -termo.tamanho * 0.36;

    ctx.save();
    ctx.translate(
      termo.meio + (calmo ? 0 : direcao * (impacto ? 46 : 24) * viagem),
      termo.base + eixoY + (calmo ? 26 * viagem : (impacto ? 56 : -22) * viagem)
    );
    ctx.rotate(calmo ? 0 : direcao * viagem * (impacto ? 0.09 : 0.055));
    ctx.scale(escala, escala);
    ctx.globalAlpha = opacidade * smooth(decorrido / (calmo ? 0.28 : 0.11));
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
      tilt: blocoAtual.calmo ? 0 : intensidade * blocoAtual.sentido * Math.sin(fase - 0.35) * 0.018,
    };
  }

  function desenharBloco({ blocoAtual, saida, tilt }, t) {
    const { centro, inclinacao, palavras, entrada, ultimoTermo, sentido, calmo, central } = blocoAtual;
    const aprox = smooth((t - entrada) / (calmo ? 0.85 : 0.46));
    const acento = smooth((t - ultimoTermo) / 0.72);
    const z = calmo
      ? 0.97 + aprox * 0.03 + acento * 0.02 - saida * 0.06
      : 0.95 + aprox * 0.05 + acento * 0.03 - saida * 0.16;
    const dxSaida = central ? 0 : sentido * saida * 135;
    const dySaida = central ? -saida * (calmo ? 26 : 52) : -saida * 64;

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
  // GRÃO UNIFICADO DE PAPEL/FILME
  // ===========================================================================
  const grainCanvas = document.createElement("canvas");
  grainCanvas.width = 256;
  grainCanvas.height = 256;
  const gCtx = grainCanvas.getContext("2d");
  const gImg = gCtx.createImageData(256, 256);
  let seed = 4096;
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
  // ESTILHAÇOS 3D PROJETIVOS (MECÂNICOS, SEM FOGO NEM FAÍSCAS!)
  // ===========================================================================
  const FOCAL = 1.0;

  // Estilhaços da ruptura macro dos pulsos em 00:01.900 (partem de [960, 621])
  const estilhacosPulsos = [
    { peca: 0, ox: 948, oy: 618, z0: 0.96, vx: -340, vy: -290, vz: 1.56, g: 260, rot0: 0.3,  vrot: -8.5, sc: 0.34 },
    { peca: 2, ox: 972, oy: 624, z0: 0.92, vx: 355,  vy: -250, vz: 1.62, g: 270, rot0: -0.5, vrot: 9.1,  sc: 0.36 },
    { peca: 4, ox: 956, oy: 610, z0: 1.02, vx: -120, vy: -420, vz: 1.68, g: 240, rot0: 0.8,  vrot: -9.8, sc: 0.28 },
    { peca: 5, ox: 966, oy: 632, z0: 1.00, vx: 165,  vy: -380, vz: 1.58, g: 250, rot0: -1.0, vrot: 8.6,  sc: 0.28 },
    { peca: 6, ox: 938, oy: 626, z0: 1.08, vx: -480, vy: 110,  vz: 1.38, g: 280, rot0: 0.2,  vrot: -10.2,sc: 0.26 },
    { peca: 7, ox: 984, oy: 620, z0: 1.06, vx: 495,  vy: 95,   vz: 1.42, g: 280, rot0: -0.7, vrot: 9.6,  sc: 0.26 },
    { peca: 1, ox: 960, oy: 621, z0: 0.90, vx: 45,   vy: 230,  vz: 1.72, g: 230, rot0: 0.4,  vrot: -7.4, sc: 0.32 },
    { peca: 3, ox: 952, oy: 628, z0: 1.12, vx: -260, vy: 280,  vz: 1.35, g: 260, rot0: -0.3, vrot: 8.9,  sc: 0.24 },
  ];

  // Estilhaços dobrados da ruptura simultânea das 4 correntes em X (00:16.400)
  const estilhacosX = [
    // Cruzamento inferior/frente (original + espelhado)
    { peca: 0, ox: 930, oy: 960, z0: 0.98, vx: -310, vy: -330, vz: 1.54, g: 240, rot0: 0.25, vrot: -7.6, sc: 0.38 },
    { peca: 2, ox: 990, oy: 970, z0: 0.95, vx: 335,  vy: -280, vz: 1.60, g: 260, rot0: -0.4, vrot: 8.4,  sc: 0.38 },
    { peca: 4, ox: 895, oy: 985, z0: 1.04, vx: -460, vy: -190, vz: 1.36, g: 220, rot0: 0.9,  vrot: -9.8, sc: 0.32 },
    { peca: 7, ox: 1025,oy: 955, z0: 1.02, vx: 475,  vy: -360, vz: 1.44, g: 250, rot0: -0.8, vrot: 9.2,  sc: 0.32 },
    { peca: 1, ox: 960, oy: 975, z0: 0.92, vx: -105, vy: -460, vz: 1.72, g: 210, rot0: 0.5,  vrot: 7.0,  sc: 0.35 },
    { peca: 5, ox: 948, oy: 988, z0: 0.99, vx: 155,  vy: -510, vz: 1.66, g: 230, rot0: -1.1, vrot: -8.6, sc: 0.30 },
    { peca: 6, ox: 976, oy: 992, z0: 1.07, vx: -540, vy: -85,  vz: 1.28, g: 280, rot0: 0.1,  vrot: 10.4, sc: 0.28 },
    { peca: 3, ox: 944, oy: 950, z0: 1.05, vx: 530,  vy: -115, vz: 1.32, g: 270, rot0: -0.6, vrot: -9.2, sc: 0.28 },
    // Cruzamento central do X (interseção frente/meio)
    { peca: 0, ox: 690, oy: 560, z0: 1.15, vx: -360, vy: -210, vz: 1.48, g: 220, rot0: 0.7,  vrot: -8.8, sc: 0.30 },
    { peca: 2, ox: 1230,oy: 560, z0: 1.15, vx: 360,  vy: -210, vz: 1.48, g: 220, rot0: -0.7, vrot: 8.8,  sc: 0.30 },
    { peca: 5, ox: 760, oy: 490, z0: 1.24, vx: -280, vy: 160,  vz: 1.42, g: 240, rot0: 1.1,  vrot: 9.4,  sc: 0.26 },
    { peca: 7, ox: 1160,oy: 490, z0: 1.24, vx: 280,  vy: 160,  vz: 1.42, g: 240, rot0: -1.1, vrot: -9.4, sc: 0.26 },
    // Cruzamento superior/meio (original + espelhado)
    { peca: 3, ox: 942, oy: 228, z0: 1.48, vx: -260, vy: -125, vz: 1.54, g: 210, rot0: -0.2, vrot: -7.8, sc: 0.27 },
    { peca: 0, ox: 982, oy: 222, z0: 1.44, vx: 275,  vy: -100, vz: 1.60, g: 230, rot0: 0.6,  vrot: 7.4,  sc: 0.27 },
    { peca: 5, ox: 920, oy: 236, z0: 1.56, vx: -390, vy: 70,   vz: 1.40, g: 260, rot0: 1.2,  vrot: -9.8, sc: 0.24 },
    { peca: 7, ox: 1000,oy: 230, z0: 1.52, vx: 395,  vy: 50,   vz: 1.46, g: 250, rot0: -0.9, vrot: 9.2,  sc: 0.24 },
    { peca: 2, ox: 960, oy: 224, z0: 1.40, vx: 60,   vy: 165,  vz: 1.68, g: 190, rot0: 0.3,  vrot: -6.5, sc: 0.26 },
    { peca: 4, ox: 938, oy: 218, z0: 1.62, vx: -175, vy: 225,  vz: 1.36, g: 240, rot0: -0.6, vrot: 8.6,  sc: 0.22 },
    { peca: 6, ox: 986, oy: 235, z0: 1.58, vx: 205,  vy: 210,  vz: 1.42, g: 240, rot0: 0.8,  vrot: -8.9, sc: 0.22 },
  ];

  const lascasPapel = Array.from({ length: 26 }, (_, i) => {
    const ang = (i / 26) * Math.PI * 2 + (i % 3) * 0.27;
    const vel = 220 + (i % 5) * 95;
    return {
      vx: Math.cos(ang) * vel,
      vy: Math.sin(ang) * vel * 0.85 - 95,
      vz: 1.22 + (i % 4) * 0.22,
      w: 10 + (i % 4) * 6,
      h: 5 + (i % 3) * 4,
      rot0: i * 0.7,
      vrot: (i % 2 === 0 ? 1 : -1) * (6 + (i % 5) * 2.2),
      cor: i % 3 === 0 ? "#7c4624" : i % 2 === 0 ? "#2e241e" : "#4a3324",
    };
  });

  // Estilhaços da ruptura do X na Ponte (00:25.100, logo após "não foi força de vontade que quebrou minha corrente")
  const estilhacosPonteX = [
    { peca: 0, ox: 940, oy: 545, z0: 0.96, vx: -340, vy: -310, vz: 1.54, g: 240, rot0: 0.3,  vrot: -8.2, sc: 0.36 },
    { peca: 2, ox: 980, oy: 558, z0: 0.94, vx: 350,  vy: -270, vz: 1.58, g: 250, rot0: -0.4, vrot: 8.6,  sc: 0.36 },
    { peca: 4, ox: 910, oy: 570, z0: 1.04, vx: -470, vy: -150, vz: 1.38, g: 220, rot0: 0.9,  vrot: -9.6, sc: 0.30 },
    { peca: 7, ox: 1010,oy: 535, z0: 1.02, vx: 485,  vy: -195, vz: 1.42, g: 240, rot0: -0.8, vrot: 9.2,  sc: 0.30 },
    { peca: 1, ox: 960, oy: 550, z0: 0.90, vx: -95,  vy: -430, vz: 1.68, g: 210, rot0: 0.5,  vrot: 7.2,  sc: 0.34 },
    { peca: 5, ox: 952, oy: 562, z0: 1.00, vx: 145,  vy: 280,  vz: 1.62, g: 230, rot0: -1.0, vrot: -8.8, sc: 0.28 },
    { peca: 6, ox: 974, oy: 540, z0: 1.08, vx: -420, vy: 210,  vz: 1.32, g: 260, rot0: 0.2,  vrot: 10.0, sc: 0.26 },
    { peca: 3, ox: 946, oy: 568, z0: 1.06, vx: 410,  vy: 235,  vz: 1.36, g: 250, rot0: -0.6, vrot: -9.1, sc: 0.26 },
    { peca: 0, ox: 720, oy: 430, z0: 1.18, vx: -310, vy: -180, vz: 1.46, g: 220, rot0: 0.7,  vrot: -8.4, sc: 0.28 },
    { peca: 2, ox: 1200,oy: 430, z0: 1.18, vx: 310,  vy: -180, vz: 1.46, g: 220, rot0: -0.7, vrot: 8.4,  sc: 0.28 },
    { peca: 4, ox: 720, oy: 675, z0: 1.16, vx: -330, vy: 190,  vz: 1.44, g: 240, rot0: -0.5, vrot: 9.0,  sc: 0.28 },
    { peca: 7, ox: 1200,oy: 675, z0: 1.16, vx: 330,  vy: 190,  vz: 1.44, g: 240, rot0: 0.5,  vrot: -9.0, sc: 0.28 },
  ];

  // Elos quebrados caindo por trás/laterais e pela frente das pernas no Bloco 1B (00:08.10 – 00:09.60)
  const elosCaindoCoturnos = [
    // Laterais / atrás dos coturnos (menores e mais escuros)
    { peca: 0, x0: 410,  y0: -120, vx: -35, vy: 220, g: 2400, delay: 0.00, sc: 0.16, rot0: 0.4,  vrot: -6.5, yChao: 868, frente: false },
    { peca: 3, x0: 1510, y0: -140, vx: 42,  vy: 240, g: 2450, delay: 0.04, sc: 0.16, rot0: -0.5, vrot: 7.0,  yChao: 870, frente: false },
    { peca: 5, x0: 540,  y0: -180, vx: -55, vy: 180, g: 2300, delay: 0.12, sc: 0.14, rot0: 1.0,  vrot: -8.2, yChao: 856, frente: false },
    { peca: 7, x0: 1390, y0: -160, vx: 58,  vy: 200, g: 2350, delay: 0.15, sc: 0.14, rot0: -0.9, vrot: 7.8,  yChao: 858, frente: false },
    { peca: 2, x0: 320,  y0: -210, vx: -25, vy: 260, g: 2500, delay: 0.22, sc: 0.15, rot0: 0.2,  vrot: 6.2,  yChao: 882, frente: false },
    { peca: 6, x0: 1605, y0: -200, vx: 28,  vy: 250, g: 2500, delay: 0.25, sc: 0.15, rot0: -0.3, vrot: -6.8, yChao: 884, frente: false },
    // Pela FRENTE das pernas/coturnos (maiores, mais próximos da lente, caindo diante das botas!)
    { peca: 1, x0: 810,  y0: -150, vx: -62, vy: 340, g: 2650, delay: 0.06, sc: 0.25, rot0: 0.6,  vrot: -7.5, yChao: 992, frente: true },
    { peca: 2, x0: 1110, y0: -170, vx: 68,  vy: 330, g: 2600, delay: 0.10, sc: 0.26, rot0: -0.7, vrot: 8.1,  yChao: 998, frente: true },
    { peca: 4, x0: 930,  y0: -220, vx: -95, vy: 290, g: 2550, delay: 0.18, sc: 0.28, rot0: 0.1,  vrot: 9.2,  yChao: 1035, frente: true },
    { peca: 7, x0: 1020, y0: -200, vx: 90,  vy: 310, g: 2600, delay: 0.20, sc: 0.27, rot0: -0.4, vrot: -8.9, yChao: 1028, frente: true },
    { peca: 0, x0: 690,  y0: -260, vx: -40, vy: 360, g: 2700, delay: 0.28, sc: 0.24, rot0: 0.9,  vrot: -7.2, yChao: 975, frente: true },
    { peca: 3, x0: 1230, y0: -240, vx: 45,  vy: 350, g: 2700, delay: 0.30, sc: 0.24, rot0: -0.8, vrot: 7.6,  yChao: 980, frente: true },
  ];

  // Lascas rasas do impacto das 4 correntes no chão em 00:08.480
  const lascasChao = Array.from({ length: 28 }, (_, i) => {
    const centros = [1515, 405, 1290, 630];
    const cx = centros[i % 4];
    const dir = (i % 2 === 0 ? 1 : -1) * (65 + (i % 5) * 58);
    return {
      ox: cx + ((i % 5) - 2) * 38,
      oy: (i % 4 < 2 ? 875 : 968) + (i % 3) * 12,
      vx: dir,
      vy: -(115 + (i % 4) * 68),
      g: 460,
      w: 9 + (i % 4) * 5,
      h: 4 + (i % 3) * 3,
      rot0: i * 0.9,
      vrot: (i % 2 === 0 ? 1 : -1) * (5 + (i % 4) * 2.4),
      cor: i % 3 === 0 ? "#824b28" : "#3a291f",
      delay: (i % 4) * 0.06,
    };
  });

  // Fragmentos lentos caindo na Ponte (câmera lenta contemplativa, zero fogo)
  const fragmentosPonte = Array.from({ length: 18 }, (_, i) => ({
    x0: 220 + ((i * 197) % 1480),
    y0: -60 - (i % 6) * 130,
    vy: 38 + (i % 5) * 16,
    swayAmp: 14 + (i % 4) * 8,
    swayFreq: 0.45 + (i % 3) * 0.22,
    w: 12 + (i % 4) * 5,
    h: 6 + (i % 3) * 4,
    rot0: i * 1.1,
    vrot: (i % 2 === 0 ? 1 : -1) * (0.4 + (i % 4) * 0.25),
    cor: i % 3 === 0 ? "#5a3520" : "#221a16",
  }));

  function desenharEstilhacos3D(lista, dt, camCx, camCy, comLascas, origemLascas) {
    if (dt <= 0 || dt > 1.38) return;

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
      const alpha = smooth(dt / 0.025) * nearFade * (1 - smooth((dt - 1.05) / 0.30));
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
  // ATERRAMENTO, SOMBRAS MACIAS E MALHA VIVA DA LADRA (ZERO BOUNCE)
  // ===========================================================================
  function aplicarCamera(zoom, focusX, focusY, shakeX, shakeY, rot) {
    ctx.translate(W / 2 + shakeX, H / 2 + shakeY);
    ctx.rotate(rot);
    ctx.scale(zoom, zoom);
    ctx.translate(-focusX, -focusY);
  }

  function desenharContraluz(t, intensidade, cx, cy, raioBase) {
    const pulso = (1 - Math.cos((t * Math.PI * 2) / 3.6)) / 2;
    const rx = raioBase + pulso * 52 + intensidade * 170;
    const ry = raioBase * 0.74 + pulso * 34 + intensidade * 110;
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
      // Pés 100% plantados em y=842 (v >= 0.80 => zero movimento vertical!)
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

  // Sombras macias de aterramento + malha viva de Jesus de costas (MM-16, 1024x1536, apoio no piso y=842)
  function desenharSombrasJesus(intensidadeLuz, alpha) {
    if (alpha <= 0.005) return;
    ctx.save();
    ctx.globalAlpha = clamp(alpha);

    // Sombra projetada difusa no chão
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

    // Oclusão ambiente sob a base das sandálias/túnica
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

    // Sombras de contato macias sob cada sandália (pé esq. apoiado em [876, 845], pé dir. em [1036, 833])
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
    const dstW = Math.round(natW * (dstH / natH)); // 397 px
    const baseX = Math.round(960 - dstW * (505 / natW)); // centralizado em x=960
    const baseY = 261; // sandália de apoio (y=1510 nativo) cravada em y=846, coroa em y=271
    const faixas = 148;
    const sh = natH / faixas;
    const dh = dstH / faixas;

    const resp = Math.sin(t * 1.42);
    const microSway = Math.sin(t * 0.82 + 0.4) * 1.35 + Math.cos(t * 0.40) * 0.60;

    ctx.save();
    ctx.globalAlpha = clamp(alpha);
    // Integração atmosférica suave à luz cobre-âmbar do horizonte da Ponte
    ctx.filter = "brightness(0.88) contrast(1.06) saturate(0.92)";
    ctx.imageSmoothingQuality = "high";

    for (let i = 0; i < faixas; i++) {
      const v = i / faixas;
      // Pés e sandálias 100% plantados (v >= 0.84 => zero movimento vertical!)
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
  // BLOCO 1A: MACRO DOS PULSOS (00:00.0 – 00:05.3)
  // ===========================================================================
  function desenharBloco1A(t, textBoost) {
    const dtRupt = Math.max(0, t - cues.rupturaPulsos);
    const tPre = smooth((t - 0.85) / 1.05) * (t < cues.rupturaPulsos ? 1 : 0);
    const punch = dtRupt > 0 && dtRupt < 0.42 ? Math.exp(-dtRupt * 8.5) : 0;
    const shakeAmt = dtRupt > 0 && dtRupt < 0.38 ? Math.exp(-dtRupt * 9.0) * 20 : 0;
    const shakeX = Math.sin(t * 92) * shakeAmt + Math.sin(t * 78) * tPre * 4.0;
    const shakeY = Math.cos(t * 108) * shakeAmt * 0.8 + Math.cos(t * 68) * tPre * 3.0;

    // Câmera sempre em zoom >= 1.04 para garantir sangria absoluta em x=0 e x=1920!
    const zoom = 1.05 + smooth(t / 1.9) * 0.04 + punch * 0.045 - smooth(dtRupt / 2.2) * 0.03 + textBoost * 0.6;
    const swayX = Math.sin(t * 0.6) * 3.5;
    const swayY = Math.cos(t * 0.5) * 2.5;

    ctx.fillStyle = "#070504";
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    aplicarCamera(zoom, 960 + swayX, 540 + swayY, shakeX, shakeY, 0);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(imgs.voidBg, 0, 0, W, H);

    // Luz cobre-âmbar invade da direita para a esquerda ao romper!
    const luzPos = smooth(dtRupt / 1.1);
    const cxLuz = lerp(1180, 960, luzPos);
    desenharContraluz(t, 0.25 + luzPos * 0.48 + punch * 0.45, cxLuz, 580, 560);

    // Separação física dos pulsos (01 sempre dx <= 0, 02 sempre dx >= 0 => ZERO borda exposta!)
    const sep = dtRupt > 0 ? easeOutQuint(dtRupt / 0.85) : 0;
    const recuoSuave = dtRupt > 0 ? smooth((dtRupt - 0.65) / 2.5) * 45 : 0;
    const vibX = Math.sin(t * 110) * tPre * 4.5;
    const vibY = Math.cos(t * 96) * tPre * 3.2;
    const sepDist = sep * 265 + recuoSuave;

    // Pulso esquerdo (sangra em x=0)
    ctx.save();
    ctx.translate(-sepDist - Math.abs(vibX) * 0.4, vibY);
    ctx.translate(0, 621);
    ctx.rotate(-sep * 0.045);
    ctx.translate(0, -621);
    ctx.drawImage(imgs.pulsosEsq, 0, 0, W, H);
    ctx.restore();

    // Pulso direito (sangra em x=1920)
    ctx.save();
    ctx.translate(sepDist + Math.abs(vibX) * 0.4, -vibY);
    ctx.translate(W, 621);
    ctx.rotate(sep * 0.045);
    ctx.translate(-W, -621);
    ctx.drawImage(imgs.pulsosDir, 0, 0, W, H);
    ctx.restore();

    desenharNevoaRasteira(t, 0.20 + luzPos * 0.25);
    ctx.restore();

    // Estilhaços 3D voando do elo central rompido [960, 621] para a lente (serão desenhados sobre o texto abaixo)
    return { dtRupt };
  }

  // ===========================================================================
  // BLOCO 1B: PLANO BAIXO DOS COTURNOS + 4 CORRENTES CAINDO (2 ATRÁS/LADOS + 2 FRENTE) + ESTILHAÇOS
  // ===========================================================================
  function desenharCorrenteCaindo(dtLocal, cx, cy, escala, espelhar, escurecer) {
    if (dtLocal <= 0) return;
    const durQueda = 0.36;
    const durQuique = 0.30;
    let dy = 0;
    let rot = 0;
    if (dtLocal < durQueda) {
      const u = clamp(dtLocal / durQueda);
      dy = -980 * (1 - u * u);
      rot = (espelhar ? -0.22 : 0.22) * (1 - u);
    } else if (dtLocal < durQueda + durQuique) {
      const u = clamp((dtLocal - durQueda) / durQuique);
      dy = -28 * Math.sin(u * Math.PI) * (1 - u * 0.62);
      rot = (espelhar ? 0.045 : -0.045) * Math.sin(u * Math.PI);
    }

    // Sombra de contato dinâmica crescendo no piso conforme a corrente chega
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
    if (escurecer < 0.99) {
      ctx.filter = `brightness(${escurecer.toFixed(2)})`;
    }
    ctx.translate(cx, cy + dy);
    ctx.rotate(rot);
    ctx.scale(espelhar ? -escala : escala, escala);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(imgs.correntePes, -pivos.correntePesPivo[0], -pivos.correntePesPivo[1], W, H);
    ctx.restore();
  }

  function desenharBloco1B(t, textBoost) {
    const dtB = t - cues.corteCoturnos;
    const dtQueda = t - cues.quedaCorrenteInicio;
    const dtImp = t - cues.quedaCorrenteImpacto;
    const dtImp2 = t - (cues.quedaCorrenteImpacto + 0.14);

    const impShake =
      (dtImp > 0 && dtImp < 0.34 ? Math.exp(-dtImp * 10.5) * 14 : 0) +
      (dtImp2 > 0 && dtImp2 < 0.34 ? Math.exp(-dtImp2 * 10.5) * 11 : 0);
    const shakeX = Math.sin(t * 96) * impShake;
    const shakeY = Math.cos(t * 114) * impShake;

    const zoom =
      1.01 +
      smooth(dtB / 5.7) * 0.07 +
      (dtImp > 0 && dtImp < 0.35 ? Math.exp(-dtImp * 9.5) * 0.028 : 0) +
      textBoost * 0.6;
    const swayX = Math.sin(t * 0.55) * 3.5;
    const swayY = Math.cos(t * 0.45) * 2.5;

    ctx.fillStyle = "#070504";
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    aplicarCamera(zoom, 960 + swayX, 540 + swayY, shakeX, shakeY, Math.sin(t * 0.32) * 0.0018);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(imgs.coturnosBg, 0, 0, W, H);

    desenharContraluz(t, 0.22 + smooth(dtImp / 1.2) * 0.30, 960, 560, 500);

    // 4 CORRENTES CAINDO (2 atrás/laterais espelhadas + 2 pela frente das pernas/coturnos) + ELOS QUEBRADOS
    if (dtQueda > 0) {
      // 1) Par de fundo/laterais (direita original + esquerda espelhada, levemente mais recuadas e escuras)
      desenharCorrenteCaindo(dtQueda - 0.00, 1515, 868, 0.88, false, 0.82);
      desenharCorrenteCaindo(dtQueda - 0.06, 405,  868, 0.88, true,  0.82);

      // 2) Elos quebrados caindo nas laterais/fundo e pela frente das pernas
      for (const e of elosCaindoCoturnos) {
        const dtE = dtQueda - e.delay;
        if (dtE <= 0) continue;
        // Tempo até tocar yChao
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
          const bounceDur = 0.26;
          const b = dtPos < bounceDur ? Math.sin((dtPos / bounceDur) * Math.PI) * 34 : 0;
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

      // 3) Par da FRENTE (caindo na frente das pernas/coturnos e pousando mais perto da lente!)
      desenharCorrenteCaindo(dtQueda - 0.12, 1295, 962, 1.12, false, 1.0);
      desenharCorrenteCaindo(dtQueda - 0.18, 625,  958, 1.12, true,  1.0);

      // 4) Lascas rasas de papel levantando nos impactos das 4 correntes (sem fogo/faíscas)
      for (const c of lascasChao) {
        const dtC = dtImp - c.delay;
        if (dtC <= 0 || dtC > 0.72) continue;
        const x = c.ox + c.vx * dtC;
        const y = c.oy + c.vy * dtC + 0.5 * c.g * dtC * dtC;
        if (y > 1055) continue;
        const a = smooth(dtC / 0.03) * (1 - smooth((dtC - 0.35) / 0.35));
        ctx.save();
        ctx.globalAlpha = a * 0.85;
        ctx.translate(x, y);
        ctx.rotate(c.rot0 + c.vrot * dtC);
        ctx.fillStyle = c.cor;
        ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
        ctx.restore();
      }
    }

    desenharNevoaRasteira(t, 0.22);
    ctx.restore();
  }

  // ===========================================================================
  // BLOCO 2: VOID COM 4 CORRENTES EM X (DUPLICADAS + ESPELHADAS) (00:11.0 – 00:21.8)
  // ===========================================================================
  function desenharBloco2(t, textBoost) {
    const dt2 = t - cues.bloco2Inicio;
    const tPre = smooth((t - 15.25) / 1.15) * (t < cues.rupturaX ? 1 : 0);
    const dtRupt = Math.max(0, t - cues.rupturaX);
    const tPos = easeInOutCubic((t - cues.rupturaX) / (cues.ponteInicio - cues.rupturaX));

    const punch = dtRupt > 0 && dtRupt < 0.45 ? Math.exp(-dtRupt * 8.2) : 0;
    const shakeAmt = dtRupt > 0 && dtRupt < 0.42 ? Math.exp(-dtRupt * 8.2) * 26 : 0;
    const shakeX = Math.sin(t * 88) * shakeAmt + Math.sin(t * 74) * tPre * 4.2;
    const shakeY = Math.cos(t * 102) * shakeAmt * 0.8 + Math.cos(t * 66) * tPre * 3.0;

    const swayX = Math.sin(t * 0.55) * 4.8;
    const swayY = Math.cos(t * 0.44) * 3.2;
    const swayRot = Math.sin(t * 0.33) * 0.0024;

    const zoomBase =
      1.01 +
      smooth(dt2 / 5.4) * 0.16 -
      tPos * 0.14 +
      punch * 0.052 +
      textBoost * 0.7;
    const focusX = 960 + swayX * 0.45;
    const focusY = lerp(540, 552, smooth(dt2 / 5.4)) - tPos * 12 + swayY * 0.45;

    ctx.fillStyle = "#070504";
    ctx.fillRect(0, 0, W, H);

    // Camada 1: Fundo Void + contraluz + sombras + Ladra livre plantada
    ctx.save();
    aplicarCamera(zoomBase, focusX, focusY, shakeX * 0.45, shakeY * 0.45, swayRot);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(imgs.voidBg, 0, 0, W, H);

    const forcaLuz = 0.24 + smooth(dt2 / 5.4) * 0.20 + smooth(dtRupt / 1.2) * 0.42 + punch * 0.45;
    desenharContraluz(t, forcaLuz, 960, 560, 580);
    desenharSombrasLadra(forcaLuz, 1.0);
    desenharLadraViva(imgs.ladraLivre, t, smooth(dtRupt / 1.4), 1.0);
    desenharLightWrap(t, forcaLuz);
    desenharNevoaRasteira(t, forcaLuz);
    ctx.restore();

    // Camada 2: PAR MEIO DO X (2 correntes superiores/meio cruzadas = original + espelhada!)
    const alphaMeio = 1 - smooth((t - 17.85) / 1.05);
    if (alphaMeio > 0.004) {
      const zoomMeio = 1.01 + smooth(dt2 / 5.4) * 0.22 + smooth(dtRupt / 1.8) * 1.15 + punch * 1.25;
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

      // Original (sentido 1)
      ctx.save();
      aplicarCamera(zoomMeio, focusX, focusY, shakeX * 0.78, shakeY * 0.78, swayRot * 1.25);
      desenharMetadeCorrente(imgs.meioEsq, pivos.meioEsq, angME, -puxaM - abreM, vibM, alphaMeio);
      desenharMetadeCorrente(imgs.meioDir, pivos.meioDir, angMD, puxaM + abreM, -vibM, alphaMeio);
      ctx.restore();

      // Duplicada espelhada horizontalmente (sentido oposto -> forma o X!)
      ctx.save();
      aplicarCamera(zoomMeio * 1.02, focusX, focusY, -shakeX * 0.78, shakeY * 0.78, -swayRot * 1.25);
      ctx.translate(W, 0);
      ctx.scale(-1, 1);
      desenharMetadeCorrente(imgs.meioEsq, pivos.meioEsq, angME * 1.04, -puxaM - abreM, -vibM, alphaMeio);
      desenharMetadeCorrente(imgs.meioDir, pivos.meioDir, angMD * 1.04, puxaM + abreM, vibM, alphaMeio);
      ctx.restore();
    }

    // Camada 3: PAR FRENTE DO X (2 correntes inferiores/frente cruzadas = original + espelhada!)
    const alphaFrente = 1 - smooth((t - 17.50) / 1.00);
    if (alphaFrente > 0.004) {
      const zoomFrente = 1.01 + smooth(dt2 / 5.4) * 0.28 + smooth(dtRupt / 1.6) * 1.75 + punch * 1.65;
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

      // Original (sentido 1)
      ctx.save();
      aplicarCamera(zoomFrente, focusX, focusY, shakeX * 1.18, shakeY * 1.18, swayRot * 1.65);
      desenharMetadeCorrente(imgs.frenteEsq, pivos.frenteEsq, angFE, -puxaF - abreF, vibF, alphaFrente);
      desenharMetadeCorrente(imgs.frenteDir, pivos.frenteDir, angFD, puxaF + abreF, dropFD - vibF, alphaFrente);
      ctx.restore();

      // Duplicada espelhada horizontalmente (sentido oposto -> completa o X colossal!)
      ctx.save();
      aplicarCamera(zoomFrente * 1.02, focusX, focusY, -shakeX * 1.18, shakeY * 1.18, -swayRot * 1.65);
      ctx.translate(W, 0);
      ctx.scale(-1, 1);
      desenharMetadeCorrente(imgs.frenteEsq, pivos.frenteEsq, angFE * 1.03, -puxaF - abreF, -vibF, alphaFrente);
      desenharMetadeCorrente(imgs.frenteDir, pivos.frenteDir, angFD * 1.03, puxaF + abreF, dropFD + vibF, alphaFrente);
      ctx.restore();
    }

    return { dtRupt };
  }

  // ===========================================================================
  // BLOCO 3: A PONTE — X TRAVANDO FENDA (ESFORÇO SEM ABRIR) -> EXPLOSÃO EM 25.10 -> AMOR MAIOR ABRE!
  // ===========================================================================
  function desenharBloco3(t, textBoost) {
    const dt3 = Math.max(0, t - cues.ponteInicio);
    const dtRuptPonte = Math.max(0, t - cues.rupturaPonteX);
    const dtAmor = Math.max(0, t - cues.ponteAbreSuaveInicio);
    const dtAbre = Math.max(0, t - cues.aberturaVeusInicio);

    const pAmor = easeInOutCubic(dtAmor / (cues.aberturaVeusInicio - cues.ponteAbreSuaveInicio));
    const pAbre = easeInOutCubic(dtAbre / (cues.aberturaVeusFim - cues.aberturaVeusInicio));

    // Impacto seco quando as 2 correntes em X da Ponte explodem em 25.10s!
    const punchPonte = dtRuptPonte > 0 && dtRuptPonte < 0.42 ? Math.exp(-dtRuptPonte * 8.5) : 0;
    const shakePonteAmt = dtRuptPonte > 0 && dtRuptPonte < 0.40 ? Math.exp(-dtRuptPonte * 8.5) * 22 : 0;
    // Esforço tenso (vai e vem) antes da ruptura (21.80 -> 25.10): tenta abrir e não consegue!
    const emEsforco = t >= cues.ponteInicio && t < cues.rupturaPonteX;
    const pulsoEsforco = emEsforco
      ? Math.pow(Math.max(0, Math.sin(dt3 * 4.2)), 2) * (0.65 + 0.35 * smooth(dt3 / 2.5))
      : 0;
    const vibEsforco = emEsforco ? Math.sin(t * 68) * pulsoEsforco * 3.8 : 0;

    const shakeX = Math.sin(t * 90) * shakePonteAmt + vibEsforco * 0.4;
    const shakeY = Math.cos(t * 106) * shakePonteAmt * 0.8 + Math.cos(t * 58) * pulsoEsforco * 2.0;

    const swayX = Math.sin(t * 0.36) * 3.5;
    const swayY = Math.cos(t * 0.28) * 2.2;
    const swayRot = Math.sin(t * 0.22) * 0.0014;

    // Câmera: tensão contida na 3A antes da explosão, soltura em "Amor Maior" e push solene na 3B
    const zoomBg =
      1.01 +
      pAmor * 0.025 +
      easeInOutCubic(dtAbre / 11.5) * 0.075 +
      punchPonte * 0.042 +
      textBoost * 0.4;
    const focusY = lerp(535, 505, pAbre) + swayY * 0.4;

    ctx.fillStyle = "#070504";
    ctx.fillRect(0, 0, W, H);

    // Fundo da Ponte (horizonte amplo em papel rasgado) + Ladra plantada em y=842
    ctx.save();
    aplicarCamera(zoomBg, 960 + swayX * 0.4, focusY, shakeX * 0.5, shakeY * 0.5, swayRot);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(imgs.ponteBg, 0, 0, W, H);

    const luzPonte = 0.20 + pAmor * 0.24 + pAbre * 0.34 + punchPonte * 0.35;
    desenharContraluz(t, luzPonte, 960, 610, 620);

    const alphaJesus = smooth((t - 31.6) / 0.85);
    if (alphaJesus > 0.004) {
      desenharSombrasJesus(luzPonte, alphaJesus);
      desenharJesusVivo(imgs.jesusCostas, t, pAbre * 0.85, alphaJesus);
      ctx.save();
      ctx.globalAlpha = alphaJesus;
      desenharLightWrap(t, luzPonte);
      ctx.restore();
    }
    desenharNevoaRasteira(t, luzPonte * 0.85);
    ctx.restore();

    // Fragmentos escuros lentos na Ponte (aparecem após a ruptura em 25.10s)
    const alphaFrag = (1 - smooth((t - 40.5) / 2.2)) * smooth((t - 25.3) / 1.2);
    if (alphaFrag > 0.005) {
      for (const f of fragmentosPonte) {
        const y = ((f.y0 + dt3 * f.vy) % (H + 180)) - 90;
        const x = f.x0 + Math.sin(dt3 * f.swayFreq + f.rot0) * f.swayAmp;
        ctx.save();
        ctx.globalAlpha = alphaFrag * 0.58;
        ctx.translate(x, y);
        ctx.rotate(f.rot0 + f.vrot * dt3);
        ctx.fillStyle = f.cor;
        ctx.beginPath();
        ctx.moveTo(-f.w / 2, -f.h / 2);
        ctx.lineTo(f.w * 0.45, -f.h * 0.3);
        ctx.lineTo(f.w / 2, f.h / 2);
        ctx.lineTo(-f.w * 0.4, f.h * 0.4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    // VÉUS FRONTAIS EM PAPEL RASGADO (07 e 08): SEMPRE scale >= 1.04, ZERO rotação, sangria integral!
    // - 21.80 -> 25.10 ("Não foi força de vontade..."): NÃO ABRE! Fica em vai-e-vem tenso (0..28px) tentando abrir contra o X!
    // - 25.70 -> 32.00 ("Foi um amor maior que entrou..."): AGORA SIM começa a abrir suave e continuamente (0 -> 155px)!
    // - 32.00 -> 34.30 ("Quando Cristo virou..."): abre totalmente para fora (155 -> 1150px)!
    const deslizeEsforco = emEsforco ? pulsoEsforco * 28 : 0;
    const deslize = deslizeEsforco + pAmor * 155 + pAbre * 995;

    if (deslize < 1090) {
      const escalaVeu = 1.04;
      // Véu Esquerdo (ancorado em x=0, sempre deslize >= 0 => x <= 0)
      ctx.save();
      ctx.translate(-deslize + shakeX * 0.4, 540 + shakeY * 0.25);
      ctx.scale(escalaVeu, escalaVeu);
      ctx.translate(0, -540);
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(imgs.veuEsq, 0, 0, W, H);
      ctx.restore();

      // Véu Direito (ancorado em x=1920, sempre deslize >= 0 => x >= 1920)
      ctx.save();
      ctx.translate(W + deslize + shakeX * 0.4, 540 + shakeY * 0.25);
      ctx.scale(escalaVeu, escalaVeu);
      ctx.translate(-W, -540);
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(imgs.veuDir, 0, 0, W, H);
      ctx.restore();
    }

    // DUAS CORRENTES EM X ATRAVESSANDO A DIAGONAL DA FENDA (21.80 -> explode em 25.10 -> sai até 26.35!)
    // Usa t02-meio-esq + t02-meio-dir (elos 100% íntegros por cima e por baixo, ZERO corte reto!)
    const alphaXPonte = 1 - smooth((t - 25.75) / 0.65);
    if (alphaXPonte > 0.004) {
      const vibC = emEsforco ? Math.sin(t * 98) * (2.2 + pulsoEsforco * 5.8) : 0;
      const puxaC = emEsforco ? pulsoEsforco * 12 : 0;
      let angE = 0, angD = 0, abreC = 0;
      if (dtRuptPonte > 0) {
        const chicote = easeOutQuint(dtRuptPonte / 0.50);
        const osc = Math.exp(-dtRuptPonte * 0.62) * Math.sin(dtRuptPonte * 4.2);
        angE = chicote * 1.18 + osc * 0.22;
        angD = -chicote * 1.12 - osc * 0.20;
        abreC = easeOutCubic(dtRuptPonte / 1.05) * 420;
      }

      const zoomXPonte = 1.68 + punchPonte * 0.26 + smooth(dtRuptPonte / 1.1) * 0.95;

      // Diagonal 1 (inferior-esq -> superior-dir, cruzando a fenda no centro [960, 540], elos 100% íntegros!)
      ctx.save();
      ctx.translate(W / 2 + shakeX * 1.1, H / 2 + shakeY * 1.1);
      ctx.rotate(-0.14);
      ctx.scale(zoomXPonte, zoomXPonte);
      ctx.translate(-960, -226);
      desenharMetadeCorrente(imgs.meioEsq, pivos.meioEsq, angE, -puxaC - abreC, vibC, alphaXPonte);
      desenharMetadeCorrente(imgs.meioDir, pivos.meioDir, angD, puxaC + abreC, -vibC, alphaXPonte);
      ctx.restore();

      // Diagonal 2 (espelhada: superior-esq -> inferior-dir, formando o X completo e 100% íntegro!)
      ctx.save();
      ctx.translate(W / 2 - shakeX * 1.1, H / 2 + shakeY * 1.1);
      ctx.scale(-1, 1);
      ctx.rotate(-0.14);
      ctx.scale(zoomXPonte * 1.02, zoomXPonte * 1.02);
      ctx.translate(-960, -226);
      desenharMetadeCorrente(imgs.meioEsq, pivos.meioEsq, angE * 1.04, -puxaC - abreC, -vibC, alphaXPonte);
      desenharMetadeCorrente(imgs.meioDir, pivos.meioDir, angD * 1.04, puxaC + abreC, vibC, alphaXPonte);
      ctx.restore();
    }

    return { dtRuptPonte };
  }

  // ===========================================================================
  // QUADRO PRINCIPAL
  // ===========================================================================
  function quadro(t) {
    const estadosTexto = blocos.map((b) => estadoDoBloco(b, t)).filter(Boolean);
    const leitura = estadosTexto.find((e) => e.avanco > 0);
    const textBoost = leitura ? leitura.avanco * 0.014 : 0;

    let dtRuptPulsos = 0;
    let dtRuptX = 0;
    let dtRuptPonte = 0;

    if (t < cues.corteCoturnos) {
      const r = desenharBloco1A(t, textBoost);
      dtRuptPulsos = r.dtRupt;
    } else if (t < cues.bloco2Inicio) {
      desenharBloco1B(t, textBoost);
    } else if (t < cues.dissolucaoPonteInicio) {
      const r = desenharBloco2(t, textBoost);
      dtRuptX = r.dtRupt;
    } else if (t < cues.dissolucaoPonteFim) {
      // Dissolução suave Bloco 2 -> Ponte (21.60 -> 22.40)
      const pDiss = smooth((t - cues.dissolucaoPonteInicio) / (cues.dissolucaoPonteFim - cues.dissolucaoPonteInicio));
      desenharBloco2(t, textBoost);
      ctx.save();
      ctx.globalAlpha = pDiss;
      const r3 = desenharBloco3(t, textBoost);
      dtRuptPonte = r3.dtRuptPonte;
      ctx.restore();
    } else {
      const r3 = desenharBloco3(t, textBoost);
      dtRuptPonte = r3.dtRuptPonte;
    }

    // EMENDA INICIAL PARTINDO DO QUADRO FINAL APROVADO DO TAKE 03 v03 (0.00 -> 0.35s)
    if (t < cues.emendaTake03Fim) {
      const pEm = smooth(t / cues.emendaTake03Fim);
      const a03 = 1 - pEm;
      if (a03 > 0.003) {
        const z03 = 1.0 + pEm * 0.14;
        ctx.save();
        ctx.globalAlpha = a03;
        ctx.translate(W / 2, H / 2);
        ctx.scale(z03, z03);
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(imgs.ancora03, -W / 2, -H / 2, W, H);
        ctx.restore();
      }
    }

    // TIPOGRAFIA CINÉTICA (limpa totalmente até 43.30s < 43.35s)
    for (const estado of estadosTexto) {
      desenharBloco(estado, t);
    }

    // ESTILHAÇOS 3D VOANDO EM DIREÇÃO À LENTE (PASSAM NA FRENTE DA TIPOGRAFIA!)
    if (dtRuptPulsos > 0) {
      desenharEstilhacos3D(estilhacosPulsos, dtRuptPulsos, 960, 621, true, pivos.pulsosJuncao);
    }
    if (dtRuptX > 0) {
      desenharEstilhacos3D(estilhacosX, dtRuptX, 960, 540, true, pivos.frenteRuptura);
    }
    if (dtRuptPonte > 0) {
      desenharEstilhacos3D(estilhacosPonteX, dtRuptPonte, 960, 540, true, [960, 552]);
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
  window.__timelines.correntes04v03 = timeline;
  quadro(0);
});
