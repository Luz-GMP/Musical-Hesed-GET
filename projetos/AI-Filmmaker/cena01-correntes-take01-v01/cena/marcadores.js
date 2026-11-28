const montagem = {
  fps: 24,
  quadros: 1128, // 47.000 s exatos a 24 fps
  duracaoSeg: 47,
  cues: {
    inicio: 0,
    primeiroVerso: 13.0,
    beatDrop: 25.0,
    aproximacaoGuarita: 36.0,
    saidaAncora: 47.0,
  },
  // Blocos de tipografia cinética pontual sincronizados aos picos vocais do MP3 (em segundos)
  blocosTexto: [
    {
      id: "corrente-invisivel",
      centro: [960, 315],
      inclinacao: -0.032,
      sentido: -1,
      ciclo: 1.9,
      intensidade: 0.78,
      saidaInicio: 20.9,
      saidaFim: 21.45,
      linhas: [
        {
          base: -22, x: -30,
          termos: [
            ["A", 68, "prata", 17.85],
            ["corrente", 112, "branco", 18.05],
          ],
        },
        {
          base: 108, x: 25,
          termos: [
            ["era", 76, "prata", 18.45],
            ["invisível", 148, "ambar", 18.70],
          ],
        },
      ],
    },
    {
      id: "era-escravo",
      centro: [960, 325],
      inclinacao: 0.028,
      sentido: 1,
      ciclo: 1.5,
      intensidade: 0.85,
      saidaInicio: 24.55,
      saidaFim: 25.0,
      linhas: [
        {
          base: -20, x: -20,
          termos: [
            ["eu", 74, "prata", 22.35],
            ["era", 74, "prata", 22.55],
          ],
        },
        {
          base: 116, x: 10,
          termos: [
            ["escravo", 178, "branco", 22.85],
          ],
        },
      ],
    },
    {
      id: "liberdade-prisao",
      centro: [960, 315],
      inclinacao: -0.026,
      sentido: -1,
      ciclo: 2.3,
      intensidade: 0.95,
      saidaInicio: 35.15,
      saidaFim: 35.75,
      linhas: [
        {
          base: -34, x: -18,
          termos: [
            ["O que", 58, "prata", 30.45],
            ["chamei de", 58, "prata", 30.72],
            ["liberdade", 118, "branco", 31.12],
          ],
        },
        {
          base: 116, x: 28,
          termos: [
            ["era", 82, "prata", 31.72],
            ["prisão", 176, "ambar", 32.02],
          ],
        },
      ],
    },
    {
      id: "mandava-obedecia",
      centro: [960, 320],
      inclinacao: 0.030,
      sentido: 1,
      ciclo: 2.2,
      intensidade: 0.90,
      saidaInicio: 40.65,
      saidaFim: 41.25,
      linhas: [
        {
          base: -26, x: -24,
          termos: [
            ["Pensei que", 62, "prata", 36.05],
            ["mandava", 122, "branco", 36.50],
          ],
        },
        {
          base: 112, x: 22,
          termos: [
            ["mas eu", 68, "prata", 37.15],
            ["obedecia", 156, "ambar", 37.55],
          ],
        },
      ],
    },
  ],
};
