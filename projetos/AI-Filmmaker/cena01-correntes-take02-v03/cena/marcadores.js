const montagem = {
  fps: 24,
  quadros: 528, // 22.000 s exatos a 24 fps
  duracaoSeg: 22,
  origemMp3Seg: 47,
  cues: {
    inicio: 0.0,
    emendaTake01Fim: 0.42,
    rupturaDiagonais: 2.8,
    avancoCamera: 5.6,
    rupturaLadra: 8.4,
    ladraLivreAvanca: 11.2,
    saida: 22.0,
  },
  pivos: {
    ladra: [960, 842],
    frenteEsq: [0, 664],
    frenteDir: [1919, 1050],
    frenteRuptura: [960, 982],
    meioEsq: [0, 436],
    meioDir: [1919, 38],
    meioRuptura: [960, 226],
    ladraPulsos: [960, 565],
    ladraTornozelos: [960, 825],
    algemaPiso: [960, 892],
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
  // 8 blocos de tipografia cinética do 1º Refrão (mesmo estilo do Take 01, alternando esquerda/direita sem cobrir a Ladra)
  blocosTexto: [
    {
      id: "b1-filho-libertar",
      centro: [425, 420],
      inclinacao: -0.028,
      sentido: -1,
      ciclo: 1.7,
      intensidade: 0.78,
      saidaInicio: 2.38,
      saidaFim: 2.75,
      linhas: [
        {
          base: -22, x: 0,
          termos: [
            ["Se o", 56, "prata", 0.32],
            ["Filho", 104, "branco", 0.62],
          ],
        },
        {
          base: 92, x: 0,
          termos: [
            ["me", 62, "prata", 1.05],
            ["libertar", 124, "ambar", 1.28],
          ],
        },
      ],
    },
    {
      id: "b2-verdadeiramente-livre",
      centro: [1495, 440],
      inclinacao: 0.028,
      sentido: 1,
      ciclo: 1.8,
      intensidade: 0.92,
      saidaInicio: 5.15,
      saidaFim: 5.55,
      linhas: [
        {
          base: -30, x: 0,
          termos: [
            ["Verdadeiramente", 88, "branco", 2.82],
          ],
        },
        {
          base: 88, x: 0,
          termos: [
            ["eu sou", 64, "prata", 3.55],
            ["livre", 142, "ambar", 3.92],
          ],
        },
      ],
    },
    {
      id: "b3-filho-libertar-2",
      centro: [425, 455],
      inclinacao: -0.026,
      sentido: -1,
      ciclo: 1.7,
      intensidade: 0.80,
      saidaInicio: 7.92,
      saidaFim: 8.32,
      linhas: [
        {
          base: -22, x: 0,
          termos: [
            ["Se o", 56, "prata", 5.62],
            ["Filho", 104, "branco", 5.95],
          ],
        },
        {
          base: 92, x: 0,
          termos: [
            ["me", 62, "prata", 6.38],
            ["libertar", 124, "ambar", 6.62],
          ],
        },
      ],
    },
    {
      id: "b4-corrente-cai",
      centro: [1495, 445],
      inclinacao: 0.026,
      sentido: 1,
      ciclo: 1.9,
      intensidade: 0.95,
      saidaInicio: 10.75,
      saidaFim: 11.15,
      linhas: [
        {
          base: -64, x: 0,
          termos: [
            ["A", 52, "prata", 8.38],
            ["corrente", 100, "branco", 8.55],
          ],
        },
        {
          base: 32, x: 0,
          termos: [
            ["cai", 108, "ambar", 8.95],
            ["aos meus pés", 64, "prata", 9.28],
          ],
        },
        {
          base: 142, x: 0,
          termos: [
            ["eu", 68, "prata", 9.95],
            ["vivo!", 136, "branco", 10.15],
          ],
        },
      ],
    },
    {
      id: "b5-cristo-comprou",
      centro: [425, 435],
      inclinacao: -0.025,
      sentido: -1,
      ciclo: 1.9,
      intensidade: 0.85,
      saidaInicio: 13.52,
      saidaFim: 13.90,
      linhas: [
        {
          base: -56, x: 0,
          termos: [
            ["Eu era", 54, "prata", 11.20],
            ["escravo", 92, "branco", 11.55],
          ],
        },
        {
          base: 36, x: 0,
          termos: [
            ["mas", 56, "prata", 12.12],
            ["Cristo", 108, "branco", 12.32],
          ],
        },
        {
          base: 136, x: 0,
          termos: [
            ["me", 62, "prata", 12.75],
            ["comprou", 122, "ambar", 12.95],
          ],
        },
      ],
    },
    {
      id: "b6-chamou-carregou",
      centro: [1495, 435],
      inclinacao: 0.025,
      sentido: 1,
      ciclo: 1.9,
      intensidade: 0.85,
      saidaInicio: 16.32,
      saidaFim: 16.70,
      linhas: [
        {
          base: -52, x: 0,
          termos: [
            ["Me chamou", 66, "prata", 13.95],
          ],
        },
        {
          base: 36, x: 0,
          termos: [
            ["pelo", 58, "prata", 14.52],
            ["nome", 108, "branco", 14.75],
          ],
        },
        {
          base: 136, x: 0,
          termos: [
            ["me", 60, "prata", 15.22],
            ["carregou", 120, "ambar", 15.42],
          ],
        },
      ],
    },
    {
      id: "b7-filho-libertar-3",
      centro: [425, 430],
      inclinacao: -0.026,
      sentido: -1,
      ciclo: 1.6,
      intensidade: 0.82,
      saidaInicio: 18.62,
      saidaFim: 18.98,
      linhas: [
        {
          base: -22, x: 0,
          termos: [
            ["Se o", 56, "prata", 16.75],
            ["Filho", 104, "branco", 17.05],
          ],
        },
        {
          base: 92, x: 0,
          termos: [
            ["me", 62, "prata", 17.45],
            ["libertar", 124, "ambar", 17.70],
          ],
        },
      ],
    },
    {
      id: "b8-verdadeiramente-sou",
      centro: [1495, 435],
      inclinacao: 0.024,
      sentido: 1,
      ciclo: 2.0,
      intensidade: 0.96,
      saidaInicio: 21.35,
      saidaFim: 21.85,
      linhas: [
        {
          base: -58, x: 0,
          termos: [
            ["Verdadeiramente", 82, "branco", 19.02],
          ],
        },
        {
          base: 28, x: 0,
          termos: [
            ["verdadeiramente", 76, "prata", 19.95],
          ],
        },
        {
          base: 146, x: 0,
          termos: [
            ["sou!", 156, "ambar", 20.68],
          ],
        },
      ],
    },
  ],
};
