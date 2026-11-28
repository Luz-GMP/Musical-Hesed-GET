const montagem = {
  fps: 24,
  quadros: 1368, // 57.000 s exatos a 24 fps
  duracaoSeg: 57.0,
  origemMp3Seg: 167.0, // 02:47.000 – 03:44.000 no MP3
  cues: {
    inicio: 0.0,
    emendaTake05Fim: 0.35,
    ruptura1A: 2.65,
    corteCoturnos: 5.30,
    quedaCorrenteInicio: 8.05,
    quedaCorrenteImpacto: 8.42,
    bloco1CInicio: 10.80,
    rupturaXFinal: 16.20,
    encerramentoInicio: 21.50,
    jesusEntraInicio: 32.00,
    jesusEntraFim: 33.80,
    silencioInicio: 43.20,
    batidaFinalInicio: 48.50,
    fadeFinalInicio: 54.40,
    fadeFinalFim: 56.75,
    saida: 57.00,
  },
  pivos: {
    correntePesPivo: [1443, 898],
    frenteEsq: [0, 664],
    frenteDir: [1919, 1050],
    frenteRuptura: [960, 982],
    meioEsq: [0, 436],
    meioDir: [1919, 38],
    meioRuptura: [960, 226],
    ladraPeApoio: [996, 842],
    ladraPePasso: [924, 849],
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
  // 13 blocos de tipografia cinética (Refrão Final + Encerramento)
  blocosTexto: [
    // ==================== PARTE 1: REFRÃO FINAL (00:00 – 00:21.5) ====================
    {
      id: "t6-1a-filho",
      centro: [405, 435],
      maxLargura: 600,
      inclinacao: -0.026,
      sentido: -1,
      ciclo: 1.6,
      intensidade: 0.88,
      saidaInicio: 2.35,
      saidaFim: 2.65,
      calmo: false,
      central: false,
      linhas: [
        {
          base: -22, x: 0,
          termos: [
            ["Se o", 56, "prata", 0.15],
            ["Filho", 104, "branco", 0.45],
          ],
        },
        {
          base: 92, x: 0,
          termos: [
            ["me", 62, "prata", 0.90],
            ["libertar", 124, "ambar", 1.18],
          ],
        },
      ],
    },
    {
      id: "t6-1a-livre",
      centro: [1515, 435],
      maxLargura: 600,
      inclinacao: 0.026,
      sentido: 1,
      ciclo: 1.7,
      intensidade: 0.94,
      saidaInicio: 4.92,
      saidaFim: 5.22,
      calmo: false,
      central: false,
      linhas: [
        {
          base: -30, x: 0,
          termos: [
            ["Verdadeiramente", 88, "branco", 2.70],
          ],
        },
        {
          base: 88, x: 0,
          termos: [
            ["eu sou", 64, "prata", 3.45],
            ["livre!", 142, "ambar", 3.82],
          ],
        },
      ],
    },
    {
      id: "t6-1b-filho",
      centro: [305, 420],
      maxLargura: 460,
      inclinacao: -0.026,
      sentido: -1,
      ciclo: 1.6,
      intensidade: 0.85,
      saidaInicio: 7.68,
      saidaFim: 7.98,
      calmo: false,
      central: false,
      linhas: [
        {
          base: -22, x: 0,
          termos: [
            ["Se o", 56, "prata", 5.45],
            ["Filho", 102, "branco", 5.78],
          ],
        },
        {
          base: 90, x: 0,
          termos: [
            ["me", 60, "prata", 6.20],
            ["libertar", 118, "ambar", 6.48],
          ],
        },
      ],
    },
    {
      id: "t6-1b-corrente-cai",
      centro: [1615, 415],
      maxLargura: 460,
      inclinacao: 0.026,
      sentido: 1,
      ciclo: 1.7,
      intensidade: 0.95,
      saidaInicio: 10.45,
      saidaFim: 10.75,
      calmo: false,
      central: false,
      linhas: [
        {
          base: -64, x: 0,
          termos: [
            ["A", 50, "prata", 8.05],
            ["corrente", 94, "branco", 8.20],
          ],
        },
        {
          base: 32, x: 0,
          termos: [
            ["cai", 104, "ambar", 8.50],
            ["aos meus pés", 60, "prata", 8.90],
          ],
        },
        {
          base: 138, x: 0,
          termos: [
            ["eu", 64, "prata", 9.60],
            ["vivo!", 130, "branco", 9.82],
          ],
        },
      ],
    },
    {
      id: "t6-1c-comprou",
      centro: [405, 435],
      maxLargura: 600,
      inclinacao: -0.025,
      sentido: -1,
      ciclo: 1.8,
      intensidade: 0.88,
      saidaInicio: 13.18,
      saidaFim: 13.50,
      calmo: false,
      central: false,
      linhas: [
        {
          base: -56, x: 0,
          termos: [
            ["Eu era", 54, "prata", 10.90],
            ["escravo", 92, "branco", 11.25],
          ],
        },
        {
          base: 36, x: 0,
          termos: [
            ["mas", 56, "prata", 11.80],
            ["Cristo", 108, "branco", 12.02],
          ],
        },
        {
          base: 136, x: 0,
          termos: [
            ["me", 62, "prata", 12.45],
            ["comprou", 122, "ambar", 12.68],
          ],
        },
      ],
    },
    {
      id: "t6-1c-carregou",
      centro: [1515, 435],
      maxLargura: 600,
      inclinacao: 0.025,
      sentido: 1,
      ciclo: 1.8,
      intensidade: 0.88,
      saidaInicio: 15.85,
      saidaFim: 16.15,
      calmo: false,
      central: false,
      linhas: [
        {
          base: -52, x: 0,
          termos: [
            ["Me chamou", 66, "prata", 13.60],
          ],
        },
        {
          base: 36, x: 0,
          termos: [
            ["pelo", 58, "prata", 14.18],
            ["nome", 108, "branco", 14.42],
          ],
        },
        {
          base: 136, x: 0,
          termos: [
            ["me", 60, "prata", 14.90],
            ["carregou", 120, "ambar", 15.12],
          ],
        },
      ],
    },
    {
      id: "t6-1c-filho",
      centro: [405, 430],
      maxLargura: 600,
      inclinacao: -0.026,
      sentido: -1,
      ciclo: 1.6,
      intensidade: 0.92,
      saidaInicio: 18.30,
      saidaFim: 18.62,
      calmo: false,
      central: false,
      linhas: [
        {
          base: -22, x: 0,
          termos: [
            ["Se o", 56, "prata", 16.20],
            ["Filho", 104, "branco", 16.52],
          ],
        },
        {
          base: 92, x: 0,
          termos: [
            ["me", 62, "prata", 16.95],
            ["libertar", 124, "ambar", 17.22],
          ],
        },
      ],
    },
    {
      id: "t6-1c-sou",
      centro: [1515, 435],
      maxLargura: 600,
      inclinacao: 0.024,
      sentido: 1,
      ciclo: 1.9,
      intensidade: 0.98,
      saidaInicio: 20.98,
      saidaFim: 21.38,
      calmo: false,
      central: false,
      linhas: [
        {
          base: -58, x: 0,
          termos: [
            ["Verdadeiramente", 82, "branco", 18.70],
          ],
        },
        {
          base: 28, x: 0,
          termos: [
            ["verdadeiramente", 76, "prata", 19.62],
          ],
        },
        {
          base: 146, x: 0,
          termos: [
            ["sou!", 156, "ambar", 20.32],
          ],
        },
      ],
    },

    // ==================== PARTE 2: ENCERRAMENTO ÉPICO (00:21.5 – 00:43.2) ====================
    {
      id: "t6-2a-caiu1",
      centro: [960, 162],
      maxLargura: 1480,
      inclinacao: 0.0,
      sentido: -1,
      ciclo: 2.2,
      intensidade: 0.82,
      saidaInicio: 26.60,
      saidaFim: 27.10,
      calmo: false,
      central: true,
      linhas: [
        {
          base: -20, x: 0,
          termos: [
            ["A corrente", 82, "branco", 22.80],
          ],
        },
        {
          base: 90, x: 0,
          termos: [
            ["caiu", 132, "ambar", 23.60],
          ],
        },
      ],
    },
    {
      id: "t6-2a-caiu2",
      centro: [960, 162],
      maxLargura: 1520,
      inclinacao: 0.0,
      sentido: 1,
      ciclo: 2.2,
      intensidade: 0.90,
      saidaInicio: 31.80,
      saidaFim: 32.30,
      calmo: false,
      central: true,
      linhas: [
        {
          base: -20, x: 0,
          termos: [
            ["A corrente", 88, "branco", 27.80],
          ],
        },
        {
          base: 92, x: 0,
          termos: [
            ["caiu!", 142, "ambar", 28.60],
          ],
        },
      ],
    },
    {
      id: "t6-2b-livre1",
      centro: [960, 160],
      maxLargura: 1520,
      inclinacao: 0.0,
      sentido: -1,
      ciclo: 2.0,
      intensidade: 0.88,
      saidaInicio: 37.55,
      saidaFim: 38.00,
      calmo: false,
      central: true,
      linhas: [
        {
          base: -22, x: 0,
          termos: [
            ["Eu sou", 74, "prata", 33.40],
            ["livre", 108, "branco", 34.00],
          ],
        },
        {
          base: 88, x: 0,
          termos: [
            ["em Cristo", 122, "ambar", 34.75],
          ],
        },
      ],
    },
    {
      id: "t6-2b-livre2",
      centro: [960, 160],
      maxLargura: 1560,
      inclinacao: 0.0,
      sentido: 1,
      ciclo: 2.0,
      intensidade: 0.95,
      saidaInicio: 42.60,
      saidaFim: 43.10,
      calmo: false,
      central: true,
      linhas: [
        {
          base: -22, x: 0,
          termos: [
            ["Eu sou", 78, "prata", 38.30],
            ["livre", 114, "branco", 38.90],
          ],
        },
        {
          base: 90, x: 0,
          termos: [
            ["em Cristo!", 134, "ambar", 39.65],
          ],
        },
      ],
    },

    // ==================== PARTE 3: SILÊNCIO ÍNTIMO (00:43.2 – 00:48.5) ====================
    {
      id: "t6-3-verdadeiramente-livre",
      centro: [960, 505],
      maxLargura: 1620,
      inclinacao: 0.0,
      sentido: 1,
      ciclo: 3.4,
      intensidade: 0.45,
      saidaInicio: 47.95,
      saidaFim: 48.45,
      calmo: true,
      central: true,
      linhas: [
        {
          base: -40, x: 0,
          termos: [
            ["Verdadeiramente", 102, "branco", 43.80],
          ],
        },
        {
          base: 118, x: 0,
          termos: [
            ["livre.", 168, "ambar", 45.40],
          ],
        },
      ],
    },
  ],
};
