const montagem = {
  fps: 24,
  quadros: 516, // 21.500 s exatos a 24 fps
  duracaoSeg: 21.5,
  origemMp3Seg: 145.5, // 02:25.500 – 02:47.000 no MP3
  cues: {
    inicio: 0.0,
    emendaTake04Fim: 0.35,
    cruzSurgeInicio: 5.2,
    cruzPlena: 7.0,
    rupturaIrmaoFiel: 9.85,
    transicaoABInicio: 10.35,
    blocoBInicio: 10.75,
    transicaoABFim: 11.15,
    enterradoInicio: 13.2,
    enterradoFim: 15.8,
    criaturaNovaInicio: 15.85,
    criaturaNovaPlena: 16.65,
    limparTipografia: 21.35,
    saida: 21.5,
  },
  pivos: {
    meioEsq: [0, 436],
    meioDir: [1919, 38],
    meioRuptura: [960, 226],
    algemaPiso: [960, 892],
    correntePesPivo: [1443, 898],
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
  // 8 blocos de tipografia cinética do 3º Verso (Filipenses 2:7 + Romanos 6:6)
  blocosTexto: [
    // ==================== BLOCO A: FILIPENSES 2:7 (00:00 – 00:10.7) ====================
    {
      id: "t5a1-filipenses",
      centro: [395, 440],
      maxLargura: 600,
      inclinacao: -0.026,
      sentido: -1,
      ciclo: 1.7,
      intensidade: 0.84,
      saidaInicio: 2.32,
      saidaFim: 2.65,
      central: false,
      linhas: [
        {
          base: -64, x: 0,
          termos: [
            ["Filipenses", 62, "prata", 0.12],
            ["2:7", 86, "ambar", 0.42],
          ],
        },
        {
          base: 30, x: 0,
          termos: [
            ["Escuta", 74, "branco", 1.00],
            ["o que", 54, "prata", 1.38],
          ],
        },
        {
          base: 126, x: 0,
          termos: [
            ["Ele fez", 104, "branco", 1.65],
          ],
        },
      ],
    },
    {
      id: "t5a2-servo",
      centro: [1525, 440],
      maxLargura: 600,
      inclinacao: 0.026,
      sentido: 1,
      ciclo: 1.7,
      intensidade: 0.88,
      saidaInicio: 4.92,
      saidaFim: 5.25,
      central: false,
      linhas: [
        {
          base: -64, x: 0,
          termos: [
            ["Cristo se fez", 66, "prata", 2.75],
          ],
        },
        {
          base: 32, x: 0,
          termos: [
            ["servo", 122, "ambar", 3.30],
          ],
        },
        {
          base: 132, x: 0,
          termos: [
            ["pra eu ser", 54, "prata", 3.92],
            ["livre", 98, "branco", 4.22],
          ],
        },
      ],
    },
    {
      id: "t5a3-tomou-corrente",
      centro: [395, 440],
      maxLargura: 600,
      inclinacao: -0.026,
      sentido: -1,
      ciclo: 1.7,
      intensidade: 0.90,
      saidaInicio: 7.55,
      saidaFim: 7.88,
      central: false,
      linhas: [
        {
          base: -64, x: 0,
          termos: [
            ["Tomou minha", 58, "prata", 5.32],
            ["corrente", 90, "branco", 5.75],
          ],
        },
        {
          base: 34, x: 0,
          termos: [
            ["levou pra", 58, "prata", 6.32],
            ["cruz", 118, "ambar", 6.62],
          ],
        },
        {
          base: 126, x: 0,
          termos: [
            ["com Ele", 86, "branco", 7.05],
          ],
        },
      ],
    },
    {
      id: "t5a4-irmao-fiel",
      centro: [1525, 440],
      maxLargura: 600,
      inclinacao: 0.026,
      sentido: 1,
      ciclo: 1.6,
      intensidade: 0.96,
      saidaInicio: 10.25,
      saidaFim: 10.58,
      central: false,
      linhas: [
        {
          base: -64, x: 0,
          termos: [
            ["Morreu como", 56, "prata", 7.98],
            ["escravo", 88, "branco", 8.42],
          ],
        },
        {
          base: 28, x: 0,
          termos: [
            ["pra me chamar de", 58, "prata", 9.00],
          ],
        },
        {
          base: 136, x: 0,
          termos: [
            ["irmão fiel!", 122, "ambar", 9.55],
          ],
        },
      ],
    },

    // ==================== BLOCO B: ROMANOS 6:6 (00:10.7 – 00:21.5) ====================
    {
      id: "t5b1-romanos",
      centro: [395, 435],
      maxLargura: 600,
      inclinacao: -0.026,
      sentido: -1,
      ciclo: 1.7,
      intensidade: 0.88,
      saidaInicio: 12.92,
      saidaFim: 13.25,
      central: false,
      linhas: [
        {
          base: -64, x: 0,
          termos: [
            ["Romanos", 62, "prata", 10.78],
            ["6:6", 88, "ambar", 11.12],
          ],
        },
        {
          base: 30, x: 0,
          termos: [
            ["O velho foi", 62, "prata", 11.65],
          ],
        },
        {
          base: 128, x: 0,
          termos: [
            ["crucificado", 98, "branco", 12.10],
          ],
        },
      ],
    },
    {
      id: "t5b2-enterrado",
      centro: [1525, 435],
      maxLargura: 600,
      inclinacao: 0.026,
      sentido: 1,
      ciclo: 1.7,
      intensidade: 0.90,
      saidaInicio: 15.55,
      saidaFim: 15.88,
      central: false,
      linhas: [
        {
          base: -60, x: 0,
          termos: [
            ["O homem que", 56, "prata", 13.32],
            ["eu era", 78, "branco", 13.78],
          ],
        },
        {
          base: 32, x: 0,
          termos: [
            ["hoje tá", 62, "prata", 14.32],
          ],
        },
        {
          base: 134, x: 0,
          termos: [
            ["enterrado", 112, "ambar", 14.68],
          ],
        },
      ],
    },
    {
      id: "t5b3-criatura-nova",
      centro: [395, 435],
      maxLargura: 600,
      inclinacao: -0.024,
      sentido: -1,
      ciclo: 1.7,
      intensidade: 0.92,
      saidaInicio: 18.18,
      saidaFim: 18.50,
      central: false,
      linhas: [
        {
          base: -62, x: 0,
          termos: [
            ["Não sou mais", 62, "prata", 16.00],
            ["o mesmo", 78, "branco", 16.45],
          ],
        },
        {
          base: 32, x: 0,
          termos: [
            ["sou criatura", 78, "branco", 17.00],
          ],
        },
        {
          base: 138, x: 0,
          termos: [
            ["nova!", 134, "ambar", 17.48],
          ],
        },
      ],
    },
    {
      // Clímax superior central acima da cabeça da Ladra — sai totalmente em 21.32s (< 21.35s)
      id: "t5b4-unica-prova",
      centro: [960, 158],
      maxLargura: 1520,
      inclinacao: 0.0,
      sentido: 1,
      ciclo: 1.6,
      intensidade: 0.96,
      saidaInicio: 20.92,
      saidaFim: 21.32,
      central: true,
      linhas: [
        {
          base: -26, x: 0,
          termos: [
            ["A liberdade", 74, "branco", 18.58],
            ["que eu tenho", 64, "prata", 19.15],
          ],
        },
        {
          base: 84, x: 0,
          termos: [
            ["é a única", 86, "branco", 19.72],
            ["que prova!", 116, "ambar", 20.22],
          ],
        },
      ],
    },
  ],
};
