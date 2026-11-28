const montagem = {
  fps: 24,
  quadros: 792, // 33.000 s exatos a 24 fps
  duracaoSeg: 33,
  origemMp3Seg: 69, // 01:09.000 – 01:42.000 no MP3
  cues: {
    inicio: 0.0,
    emendaTake02Fim: 0.65,
    arcoAssentado: 1.0,
    arcoAbreInicio: 7.8,
    arcoAbreFim: 10.95,
    transicaoABInicio: 10.5,
    blocoBInicio: 11.0,
    portaAbreInicio: 13.8,
    portaAbreFim: 14.65,
    portaPassaInicio: 14.45,
    portaPassaFim: 15.80,
    porta2SurgeInicio: 14.85,
    porta2CravaFim: 16.25,
    agostinhoBrilhoBaixa: 16.6,
    transicaoBCInicio: 21.8,
    blocoCInicio: 22.0,
    transicaoBCFim: 22.4,
    climaxPergunta: 30.1,
    redeasSaiInicio: 29.85,
    redeasSaiFim: 30.75,
    ladraFadeInicio: 30.00,
    ladraFadeFim: 30.95,
    limparTipografia: 32.85,
    saida: 33.0,
  },
  pivos: {
    arcoFrenteCentro: [922, 499],
    molduraCentro: [955, 500],
    molduraVao: [798, 158, 314, 684],
    folhaEixoX: 795,
    folhaPivo: [795, 463],
    folhaRect: [791, 151, 327, 691],
    ladraPortaPeEsq: [928, 842],
    ladraPortaPeDir: [992, 842],
    ladraPortaPivo: [960, 842],
    ladraLivrePeEsq: [924, 849],
    ladraLivrePeDir: [996, 842],
    redeasPivo: [0, 530],
  },
  // 11 blocos de tipografia cinética do 2º Verso (padrão aprovado Take 01 / Take 02 v03)
  blocosTexto: [
    // ==================== BLOCO A (00:00 – 00:11) ====================
    {
      id: "a1-joao-8-34",
      centro: [390, 445],
      maxLargura: 600,
      inclinacao: -0.026,
      sentido: -1,
      ciclo: 1.9,
      intensidade: 0.80,
      saidaInicio: 4.18,
      saidaFim: 4.55,
      linhas: [
        {
          base: -82, x: 0,
          termos: [
            ["João", 60, "prata", 0.35],
            ["8:34", 82, "ambar", 0.65],
          ],
        },
        {
          base: 8, x: 0,
          termos: [
            ["Quem comete", 56, "prata", 1.25],
            ["o pecado", 84, "branco", 1.72],
          ],
        },
        {
          base: 108, x: 0,
          termos: [
            ["é escravo,", 92, "branco", 2.45],
            ["é fato", 96, "ambar", 3.15],
          ],
        },
      ],
    },
    {
      id: "a2-escolha-habito",
      centro: [1530, 445],
      maxLargura: 600,
      inclinacao: 0.026,
      sentido: 1,
      ciclo: 1.7,
      intensidade: 0.86,
      saidaInicio: 7.45,
      saidaFim: 7.82,
      linhas: [
        {
          base: -34, x: 0,
          termos: [
            ["1ª vez é", 58, "prata", 4.78],
            ["escolha", 98, "branco", 5.20],
          ],
        },
        {
          base: 84, x: 0,
          termos: [
            ["10ª é", 64, "prata", 6.08],
            ["hábito", 122, "ambar", 6.45],
          ],
        },
      ],
    },
    {
      id: "a3-identidade-maldito",
      centro: [390, 450],
      maxLargura: 600,
      inclinacao: -0.028,
      sentido: -1,
      ciclo: 1.6,
      intensidade: 0.94,
      saidaInicio: 10.42,
      saidaFim: 10.78,
      linhas: [
        {
          base: -56, x: 0,
          termos: [
            ["A milésima é", 56, "prata", 7.98],
          ],
        },
        {
          base: 32, x: 0,
          termos: [
            ["identidade", 104, "branco", 8.42],
          ],
        },
        {
          base: 132, x: 0,
          termos: [
            ["é doente,", 72, "prata", 9.18],
            ["é maldito", 96, "ambar", 9.65],
          ],
        },
      ],
    },

    // ==================== BLOCO B (00:11 – 00:22) ====================
    {
      id: "b1-queria-parar",
      centro: [1530, 445],
      maxLargura: 600,
      inclinacao: 0.024,
      sentido: 1,
      ciclo: 1.8,
      intensidade: 0.78,
      saidaInicio: 13.28,
      saidaFim: 13.65,
      linhas: [
        {
          base: -30, x: 0,
          termos: [
            ["Eu queria", 58, "prata", 11.12],
            ["parar", 108, "branco", 11.55],
          ],
        },
        {
          base: 84, x: 0,
          termos: [
            ["mas não", 60, "prata", 12.15],
            ["conseguia", 96, "ambar", 12.48],
          ],
        },
      ],
    },
    {
      id: "b2-mesma-porta",
      centro: [390, 445],
      maxLargura: 600,
      inclinacao: -0.024,
      sentido: -1,
      ciclo: 1.8,
      intensidade: 0.88,
      saidaInicio: 16.05,
      saidaFim: 16.40,
      linhas: [
        {
          base: -56, x: 0,
          termos: [
            ["A porta", 88, "branco", 13.85],
            ["era a", 54, "prata", 14.28],
          ],
        },
        {
          base: 34, x: 0,
          termos: [
            ["mesma", 116, "ambar", 14.55],
          ],
        },
        {
          base: 126, x: 0,
          termos: [
            ["todo dia", 90, "branco", 15.18],
          ],
        },
      ],
    },
    {
      id: "b3-agostinho",
      centro: [1530, 445],
      maxLargura: 600,
      inclinacao: 0.022,
      sentido: 1,
      ciclo: 1.9,
      intensidade: 0.80,
      saidaInicio: 18.88,
      saidaFim: 19.25,
      linhas: [
        {
          base: -72, x: 0,
          termos: [
            ["Agostinho", 52, "prata", 16.60],
          ],
        },
        {
          base: 18, x: 0,
          termos: [
            ["“Meu peso é", 78, "branco", 17.18],
          ],
        },
        {
          base: 118, x: 0,
          termos: [
            ["o meu", 60, "prata", 17.88],
            ["amor”", 118, "ambar", 18.18],
          ],
        },
      ],
    },
    {
      id: "b4-amava-matava",
      centro: [390, 445],
      maxLargura: 600,
      inclinacao: -0.024,
      sentido: -1,
      ciclo: 1.8,
      intensidade: 0.86,
      saidaInicio: 21.35,
      saidaFim: 21.72,
      linhas: [
        {
          base: -28, x: 0,
          termos: [
            ["Eu", 60, "prata", 19.42],
            ["amava", 112, "branco", 19.68],
          ],
        },
        {
          base: 88, x: 0,
          termos: [
            ["o que", 58, "prata", 20.18],
            ["matava", 118, "ambar", 20.45],
          ],
        },
      ],
    },

    // ==================== BLOCO C (00:22 – 00:33) ====================
    {
      id: "c1-lutero",
      centro: [1530, 445],
      maxLargura: 600,
      inclinacao: 0.024,
      sentido: 1,
      ciclo: 1.8,
      intensidade: 0.84,
      saidaInicio: 24.48,
      saidaFim: 24.85,
      linhas: [
        {
          base: -72, x: 0,
          termos: [
            ["Lutero", 52, "prata", 22.25],
          ],
        },
        {
          base: 18, x: 0,
          termos: [
            ["“A vontade", 86, "branco", 22.80],
          ],
        },
        {
          base: 118, x: 0,
          termos: [
            ["é um", 60, "prata", 23.42],
            ["cavalo”", 112, "ambar", 23.72],
          ],
        },
      ],
    },
    {
      id: "c2-sela-salto",
      centro: [425, 240],
      maxLargura: 620,
      inclinacao: -0.024,
      sentido: -1,
      ciclo: 1.7,
      intensidade: 0.90,
      saidaInicio: 26.98,
      saidaFim: 27.35,
      linhas: [
        {
          base: -22, x: 0,
          termos: [
            ["Ou Deus", 78, "branco", 25.00],
            ["tá na sela", 74, "ambar", 25.45],
          ],
        },
        {
          base: 84, x: 0,
          termos: [
            ["Ou o diabo", 72, "prata", 26.00],
            ["no salto", 82, "branco", 26.42],
          ],
        },
      ],
    },
    {
      id: "c3-homem-livre",
      centro: [1530, 445],
      maxLargura: 600,
      inclinacao: 0.024,
      sentido: 1,
      ciclo: 1.8,
      intensidade: 0.88,
      saidaInicio: 29.55,
      saidaFim: 29.92,
      linhas: [
        {
          base: -56, x: 0,
          termos: [
            ["Não existe", 60, "prata", 27.52],
            ["homem livre", 82, "branco", 27.95],
          ],
        },
        {
          base: 42, x: 0,
          termos: [
            ["andando solto", 70, "prata", 28.55],
          ],
        },
        {
          base: 130, x: 0,
          termos: [
            ["na rua", 104, "ambar", 29.02],
          ],
        },
      ],
    },
    {
      // Clímax hero centralizado e ampliado após saída das rédeas e fade da Ladra — sai totalmente em 32.82s
      id: "c4-pergunta-alma",
      centro: [960, 505],
      maxLargura: 1580,
      inclinacao: 0.0,
      sentido: 1,
      ciclo: 1.6,
      intensidade: 0.96,
      saidaInicio: 32.45,
      saidaFim: 32.82,
      linhas: [
        {
          base: -48, x: 0,
          termos: [
            ["A pergunta é", 84, "prata", 30.10],
            ["só uma:", 104, "branco", 30.65],
          ],
        },
        {
          base: 112, x: 0,
          termos: [
            ["De quem é", 122, "branco", 31.22],
            ["a alma sua?", 156, "ambar", 31.72],
          ],
        },
      ],
    },
  ],
};
