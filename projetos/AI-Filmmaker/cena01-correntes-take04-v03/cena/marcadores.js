const montagem = {
  fps: 24,
  quadros: 1044, // 43.500 s exatos a 24 fps
  duracaoSeg: 43.5,
  origemMp3Seg: 102, // 01:42.000 – 02:25.500 no MP3
  cues: {
    inicio: 0.0,
    emendaTake03Fim: 0.35,
    rupturaPulsos: 1.9,
    corteCoturnos: 5.3,
    quedaCorrenteInicio: 8.1,
    quedaCorrenteImpacto: 8.48,
    quedaCorrenteFim: 8.8,
    bloco2Inicio: 11.0,
    rupturaX: 16.4,
    voidLimpo: 18.9,
    dissolucaoPonteInicio: 21.6,
    ponteInicio: 21.8,
    dissolucaoPonteFim: 22.4,
    rupturaPonteX: 25.10,
    ponteAbreSuaveInicio: 25.70,
    aberturaVeusInicio: 32.0,
    aberturaVeusFim: 34.3,
    limparTipografia: 43.35,
    saida: 43.5,
  },
  pivos: {
    pulsosJuncao: [960, 621],
    correntePesImpacto: [1277, 962],
    correntePesPivo: [1443, 898],
    frenteEsq: [0, 664],
    frenteDir: [1919, 1050],
    frenteRuptura: [960, 982],
    meioEsq: [0, 436],
    meioDir: [1919, 38],
    meioRuptura: [960, 226],
    ladraPivo: [960, 842],
    ladraPeApoio: [996, 842],
    ladraPePasso: [924, 849],
    fendaCentro: [960, 540],
  },
  pecasElos: [
    [74, 188, 440, 369],
    [544, 199, 424, 365],
    [998, 151, 380, 460],
    [1461, 153, 386, 456],
    [83, 700, 409, 213],
    [525, 680, 429, 251],
    [991, 686, 412, 239],
    [1454, 697, 387, 230],
  ],
  // 12 blocos de tipografia cinética (2º Refrão + Ponte) — limpos até 43.32s (< 43.35s)
  blocosTexto: [
    // ==================== BLOCO 1A: PULSOS MACRO (00:00 – 00:05.3) ====================
    {
      id: "t1a-filho-libertar",
      centro: [960, 235],
      maxLargura: 1280,
      inclinacao: 0.0,
      sentido: -1,
      ciclo: 1.7,
      intensidade: 0.85,
      saidaInicio: 2.28,
      saidaFim: 2.58,
      calmo: false,
      central: true,
      linhas: [
        {
          base: -24, x: 0,
          termos: [
            ["Se o", 62, "prata", 0.20],
            ["Filho", 104, "branco", 0.52],
          ],
        },
        {
          base: 88, x: 0,
          termos: [
            ["me", 66, "prata", 0.98],
            ["libertar", 128, "ambar", 1.25],
          ],
        },
      ],
    },
    {
      id: "t1a-verdadeiramente-livre",
      centro: [960, 305],
      maxLargura: 1420,
      inclinacao: 0.0,
      sentido: 1,
      ciclo: 1.8,
      intensidade: 0.92,
      saidaInicio: 4.88,
      saidaFim: 5.20,
      calmo: false,
      central: true,
      linhas: [
        {
          base: -26, x: 0,
          termos: [
            ["Verdadeiramente", 96, "branco", 2.70],
          ],
        },
        {
          base: 92, x: 0,
          termos: [
            ["eu sou", 70, "prata", 3.45],
            ["livre!", 146, "ambar", 3.85],
          ],
        },
      ],
    },

    // ==================== BLOCO 1B: COTURNOS + CORRENTE (00:05.3 – 00:11.0) ====================
    {
      id: "t1b-filho-libertar",
      centro: [305, 420],
      maxLargura: 460,
      inclinacao: -0.026,
      sentido: -1,
      ciclo: 1.7,
      intensidade: 0.82,
      saidaInicio: 7.72,
      saidaFim: 8.02,
      calmo: false,
      central: false,
      linhas: [
        {
          base: -22, x: 0,
          termos: [
            ["Se o", 56, "prata", 5.48],
            ["Filho", 102, "branco", 5.82],
          ],
        },
        {
          base: 90, x: 0,
          termos: [
            ["me", 60, "prata", 6.26],
            ["libertar", 118, "ambar", 6.52],
          ],
        },
      ],
    },
    {
      id: "t1b-corrente-cai",
      centro: [1615, 415],
      maxLargura: 460,
      inclinacao: 0.026,
      sentido: 1,
      ciclo: 1.8,
      intensidade: 0.94,
      saidaInicio: 10.60,
      saidaFim: 10.92,
      calmo: false,
      central: false,
      linhas: [
        {
          base: -64, x: 0,
          termos: [
            ["A", 50, "prata", 8.10],
            ["corrente", 94, "branco", 8.26],
          ],
        },
        {
          base: 32, x: 0,
          termos: [
            ["cai", 104, "ambar", 8.55],
            ["aos meus pés", 60, "prata", 8.95],
          ],
        },
        {
          base: 138, x: 0,
          termos: [
            ["eu", 64, "prata", 9.68],
            ["vivo!", 130, "branco", 9.90],
          ],
        },
      ],
    },

    // ==================== BLOCO 2: X DE 4 CORRENTES (00:11.0 – 00:21.8) ====================
    {
      id: "t2-cristo-comprou",
      centro: [410, 435],
      maxLargura: 600,
      inclinacao: -0.025,
      sentido: -1,
      ciclo: 1.9,
      intensidade: 0.86,
      saidaInicio: 13.35,
      saidaFim: 13.70,
      calmo: false,
      central: false,
      linhas: [
        {
          base: -56, x: 0,
          termos: [
            ["Eu era", 54, "prata", 11.10],
            ["escravo", 92, "branco", 11.45],
          ],
        },
        {
          base: 36, x: 0,
          termos: [
            ["mas", 56, "prata", 12.00],
            ["Cristo", 108, "branco", 12.22],
          ],
        },
        {
          base: 136, x: 0,
          termos: [
            ["me", 62, "prata", 12.64],
            ["comprou", 122, "ambar", 12.84],
          ],
        },
      ],
    },
    {
      id: "t2-chamou-carregou",
      centro: [1510, 435],
      maxLargura: 600,
      inclinacao: 0.025,
      sentido: 1,
      ciclo: 1.9,
      intensidade: 0.86,
      saidaInicio: 16.05,
      saidaFim: 16.35,
      calmo: false,
      central: false,
      linhas: [
        {
          base: -52, x: 0,
          termos: [
            ["Me chamou", 66, "prata", 13.80],
          ],
        },
        {
          base: 36, x: 0,
          termos: [
            ["pelo", 58, "prata", 14.38],
            ["nome", 108, "branco", 14.62],
          ],
        },
        {
          base: 136, x: 0,
          termos: [
            ["me", 60, "prata", 15.10],
            ["carregou", 120, "ambar", 15.32],
          ],
        },
      ],
    },
    {
      id: "t2-filho-libertar",
      centro: [410, 430],
      maxLargura: 600,
      inclinacao: -0.026,
      sentido: -1,
      ciclo: 1.6,
      intensidade: 0.90,
      saidaInicio: 18.50,
      saidaFim: 18.82,
      calmo: false,
      central: false,
      linhas: [
        {
          base: -22, x: 0,
          termos: [
            ["Se o", 56, "prata", 16.40],
            ["Filho", 104, "branco", 16.72],
          ],
        },
        {
          base: 92, x: 0,
          termos: [
            ["me", 62, "prata", 17.15],
            ["libertar", 124, "ambar", 17.42],
          ],
        },
      ],
    },
    {
      id: "t2-verdadeiramente-sou",
      centro: [1510, 435],
      maxLargura: 600,
      inclinacao: 0.024,
      sentido: 1,
      ciclo: 2.0,
      intensidade: 0.96,
      saidaInicio: 21.18,
      saidaFim: 21.58,
      calmo: false,
      central: false,
      linhas: [
        {
          base: -58, x: 0,
          termos: [
            ["Verdadeiramente", 82, "branco", 18.90],
          ],
        },
        {
          base: 28, x: 0,
          termos: [
            ["verdadeiramente", 76, "prata", 19.82],
          ],
        },
        {
          base: 146, x: 0,
          termos: [
            ["sou!", 156, "ambar", 20.52],
          ],
        },
      ],
    },

    // ==================== BLOCO 3A: PONTE RESPIRO (00:21.8 – 00:32.0) ====================
    {
      id: "t3a-nao-foi-forca",
      centro: [960, 505],
      maxLargura: 1480,
      inclinacao: 0.0,
      sentido: -1,
      ciclo: 2.8,
      intensidade: 0.45,
      saidaInicio: 25.05,
      saidaFim: 25.55,
      calmo: true,
      central: true,
      linhas: [
        {
          base: -34, x: 0,
          termos: [
            ["Não foi", 64, "prata", 22.00],
            ["força de vontade", 82, "branco", 22.55],
          ],
        },
        {
          base: 84, x: 0,
          termos: [
            ["que quebrou", 68, "prata", 23.45],
            ["minha corrente", 96, "ambar", 24.00],
          ],
        },
      ],
    },
    {
      id: "t3a-amor-maior",
      centro: [960, 505],
      maxLargura: 1500,
      inclinacao: 0.0,
      sentido: 1,
      ciclo: 3.2,
      intensidade: 0.50,
      saidaInicio: 31.25,
      saidaFim: 31.85,
      calmo: true,
      central: true,
      linhas: [
        {
          base: -34, x: 0,
          termos: [
            ["Foi um", 66, "prata", 25.70],
            ["amor maior", 104, "ambar", 26.35],
            ["que entrou", 76, "branco", 27.30],
          ],
        },
        {
          base: 92, x: 0,
          termos: [
            ["e mudou", 78, "prata", 28.40],
            ["o que eu sentia", 106, "branco", 29.10],
          ],
        },
      ],
    },

    // ==================== BLOCO 3B: PONTE CRESCENDO (00:32.0 – 00:43.5) ====================
    {
      id: "t3b-maior-tesouro",
      centro: [960, 158],
      maxLargura: 1500,
      inclinacao: 0.0,
      sentido: -1,
      ciclo: 2.0,
      intensidade: 0.82,
      saidaInicio: 36.95,
      saidaFim: 37.38,
      calmo: false,
      central: true,
      linhas: [
        {
          base: -26, x: 0,
          termos: [
            ["Quando", 64, "prata", 32.10],
            ["Cristo virou", 86, "branco", 32.65],
          ],
        },
        {
          base: 84, x: 0,
          termos: [
            ["o meu", 68, "prata", 33.85],
            ["maior tesouro", 112, "ambar", 34.35],
          ],
        },
      ],
    },
    {
      id: "t3b-prazer-barato",
      centro: [960, 158],
      maxLargura: 1560,
      inclinacao: 0.0,
      sentido: 1,
      ciclo: 1.8,
      intensidade: 0.95,
      saidaInicio: 42.90,
      saidaFim: 43.30,
      calmo: false,
      central: true,
      linhas: [
        {
          base: -28, x: 0,
          termos: [
            ["O prazer", 72, "prata", 37.55],
            ["barato", 94, "branco", 38.20],
          ],
        },
        {
          base: 84, x: 0,
          termos: [
            ["perdeu o seu valor", 92, "branco", 39.25],
            ["agora!", 118, "ambar", 41.20],
          ],
        },
      ],
    },
  ],
};
