window.addEventListener("load", () => {
  const imgQ01 = document.getElementById("q01");
  const imgQ03 = document.getElementById("q03");
  const imgQ02 = document.getElementById("q02");
  const plano = document.getElementById("plano");
  const ctx = plano.getContext("2d", { alpha: false });
  const W = plano.width;
  const H = plano.height;
  const { fps, quadros, blocosTexto } = montagem;

  const paleta = {
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
  const lerp = (a, b, t) => a + (b - a) * t;

  // Pré-computar medidas das linhas tipográficas
  function comporLinha({ base, x, termos }) {
    const palavras = termos.map(([texto, tamanho, cor, entrada], indice) => {
      const frase = texto.toLocaleUpperCase("pt-BR");
      const fonte = `${tamanho}px Impact, "Arial Black", sans-serif`;
      const espaco = tamanho < 90 ? "2.4px" : "1.8px";
      ctx.font = fonte;
      ctx.letterSpacing = espaco;
      const largura = ctx.measureText(frase).width;
      return { frase, tamanho, cor, entrada, fonte, espaco, largura, base, indice };
    });
    const intervalo = 28;
    const total =
      palavras.reduce((s, p) => s + p.largura, 0) +
      intervalo * (palavras.length - 1);
    let cursor = x - total / 2;
    return palavras.map((p) => {
      const meio = cursor + p.largura / 2;
      cursor += p.largura + intervalo;
      return { ...p, meio };
    });
  }

  const blocos = blocosTexto.map((b) => {
    const palavras = b.linhas.flatMap(comporLinha);
    const entrada = Math.min(...palavras.map((p) => p.entrada));
    const ultimoTermo = Math.max(...palavras.map((p) => p.entrada));
    return { ...b, palavras, entrada, ultimoTermo };
  });

  // Desenha uma imagem cover (1672x941 -> 1920x1080) com câmera viva
  function desenharPlano(img, zoom, panX, panY, rot, alpha) {
    if (alpha <= 0.001) return;
    ctx.save();
    ctx.globalAlpha = clamp(alpha);
    ctx.translate(W / 2 + panX, H / 2 + panY);
    ctx.rotate(rot);
    ctx.scale(zoom, zoom);
    const scaleCover = Math.max(W / img.naturalWidth, H / img.naturalHeight);
    const dw = img.naturalWidth * scaleCover;
    const dh = img.naturalHeight * scaleCover;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();
  }

  // Neblina em camadas translúcidas sobre o asfalto molhado e horizonte
  function desenharNeblina(t, densidade) {
    ctx.save();
    const camadas = [
      { y: H * 0.86, rx: 720, ry: 170, speed: 36, offset: 0.0, alpha: 0.14 * densidade },
      { y: H * 0.78, rx: 640, ry: 150, speed: -24, offset: 2.1, alpha: 0.11 * densidade },
      { y: H * 0.92, rx: 860, ry: 190, speed: 52, offset: 4.3, alpha: 0.16 * densidade },
    ];
    for (const c of camadas) {
      const x = ((t * c.speed + c.offset * 380) % (W + c.rx * 2)) - c.rx;
      const g = ctx.createRadialGradient(x, c.y, 10, x, c.y, c.rx);
      g.addColorStop(0, `rgba(180, 205, 232, ${c.alpha})`);
      g.addColorStop(0.55, `rgba(140, 172, 208, ${c.alpha * 0.45})`);
      g.addColorStop(1, "rgba(120, 150, 190, 0)");
      ctx.save();
      ctx.translate(x, c.y);
      ctx.scale(1, c.ry / c.rx);
      ctx.fillStyle = g;
      ctx.fillRect(-c.rx, -c.rx, c.rx * 2, c.rx * 2);
      ctx.restore();
    }
    ctx.restore();
  }

  // Respiração luminosa da prisão (reflexo âmbar + pulso vermelho discreto + atmosfera fria)
  function desenharAtmosfera(t, pulsoBeat, pesoFrio, tensaoFinal) {
    // Leve resfriamento azul-noturno no 1º verso ("corrente invisível")
    if (pesoFrio > 0.001) {
      ctx.save();
      ctx.fillStyle = `rgba(10, 24, 48, ${0.22 * pesoFrio})`;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }

    // Pulso âmbar sutil no centro do pátio acompanhando a batida
    ctx.save();
    const aura = ctx.createRadialGradient(W * 0.5, H * 0.54, 40, W * 0.5, H * 0.54, W * 0.48);
    const forca = 0.08 + pulsoBeat * 0.09 + tensaoFinal * 0.10;
    aura.addColorStop(0, `rgba(255, 148, 48, ${forca})`);
    aura.addColorStop(0.45, `rgba(255, 108, 32, ${forca * 0.42})`);
    aura.addColorStop(1, "rgba(255, 90, 20, 0)");
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = aura;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();

    // Vinheta cinematográfica + proteção sutil no terço superior para leitura da tipografia
    ctx.save();
    const vig = ctx.createRadialGradient(W * 0.5, H * 0.52, W * 0.25, W * 0.5, H * 0.52, W * 0.72);
    vig.addColorStop(0, "rgba(5, 10, 20, 0)");
    vig.addColorStop(1, `rgba(4, 8, 16, ${0.46 + tensaoFinal * 0.16})`);
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  // Palavra individual no padrão cinético aprovado (v30 adaptado à paleta noturna)
  function desenharPalavra(termo, t, opacidade, sentido) {
    const decorrido = t - termo.entrada;
    if (decorrido <= 0) return;
    const impacto = termo.tamanho >= 110;
    const entrada = clamp(decorrido / (impacto ? 0.42 : 0.26));
    const viagem = Math.pow(1 - entrada, 3);
    const encaixe = 1 - Math.pow(1 - entrada, 2) * Math.cos(entrada * 4.5);
    const escala = 1 + (impacto ? 0.42 : 0.22) * (encaixe - 1);
    const direcao = termo.indice % 2 === 0 ? sentido : -sentido;
    const eixoY = -termo.tamanho * 0.36;

    ctx.save();
    ctx.translate(
      termo.meio + direcao * (impacto ? 74 : 38) * viagem,
      termo.base + eixoY + (impacto ? 88 : -32) * viagem
    );
    ctx.rotate(direcao * viagem * (impacto ? 0.13 : 0.08));
    ctx.scale(escala, escala);
    ctx.globalAlpha = opacidade * smooth(decorrido / 0.14);
    ctx.font = termo.fonte;
    ctx.letterSpacing = termo.espaco;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.lineJoin = "round";

    // Contorno e sombra profundos para contraste no LED noturno
    ctx.shadowColor = "rgba(4, 9, 18, 0.85)";
    ctx.shadowBlur = impacto ? 22 : 12;
    ctx.shadowOffsetY = impacto ? 8 : 5;
    ctx.strokeStyle = "rgba(7, 13, 24, 0.96)";
    ctx.lineWidth = impacto ? 9 : 6;
    ctx.strokeText(termo.frase, 0, -eixoY);

    ctx.shadowColor = termo.cor === "ambar" ? "rgba(255, 148, 42, 0.42)" : "rgba(0, 0, 0, 0.35)";
    ctx.shadowBlur = termo.cor === "ambar" ? 26 : 10;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = paleta[termo.cor];
    ctx.fillText(termo.frase, 0, -eixoY);
    ctx.restore();
  }

  function estadoDoBloco(blocoAtual, t) {
    if (t <= blocoAtual.entrada) return null;
    const saida = smooth((t - blocoAtual.saidaInicio) / (blocoAtual.saidaFim - blocoAtual.saidaInicio));
    if (saida >= 1) return null;
    const tempoLeitura = Math.max(0, t - blocoAtual.ultimoTermo - 0.12);
    const fase = (2 * Math.PI * tempoLeitura) / blocoAtual.ciclo;
    const intensidade = blocoAtual.intensidade * smooth(tempoLeitura / 0.24) * (1 - saida);
    return {
      blocoAtual,
      saida,
      avanco: (intensidade * (1 - Math.cos(fase))) / 2,
      tilt: intensidade * blocoAtual.sentido * Math.sin(fase - 0.35) * 0.026,
    };
  }

  function desenharBloco({ blocoAtual, saida, tilt }, t) {
    const { centro, inclinacao, palavras, entrada, ultimoTermo, sentido } = blocoAtual;
    const aprox = smooth((t - entrada) / 0.58);
    const acento = smooth((t - ultimoTermo) / 0.85);
    const z = 0.95 + aprox * 0.05 + acento * 0.036 - saida * 0.22;

    // Leve véu atrás do bloco para garantir leitura cristalina à distância
    ctx.save();
    const grad = ctx.createRadialGradient(centro[0], centro[1] + 25, 40, centro[0], centro[1] + 25, 580);
    grad.addColorStop(0, `rgba(6, 12, 24, ${0.52 * (1 - saida) * aprox})`);
    grad.addColorStop(1, "rgba(6, 12, 24, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H * 0.65);
    ctx.restore();

    ctx.save();
    ctx.translate(
      centro[0] - sentido * (1 - aprox) * 56 + sentido * saida * 220,
      centro[1] + (1 - aprox) * 42 - saida * 105
    );
    ctx.rotate(inclinacao - sentido * (1 - aprox) * 0.09 + sentido * saida * 0.13 + tilt);
    ctx.scale(z, z);
    for (const termo of palavras) {
      desenharPalavra(termo, t, 1 - saida, sentido);
    }
    ctx.restore();
  }

  function quadro(t) {
    // 1. Progressão de câmera e transições entre Q01 -> Q03 -> Q02
    const tBeat = smooth((t - 24.7) / 0.7); // beat drop em 25.0s
    const tGuarita = smooth((t - 35.6) / 0.9); // aproximação final em 36.0s

    // Pulso rítmico após 25.0s (cadência do rap ~96 BPM -> 0.625 s)
    const beatAtivo = smooth((t - 24.9) / 0.3);
    const pulsoBeat = beatAtivo * Math.pow((1 + Math.cos((t - 25.0) * Math.PI * 2 / 0.625)) / 2, 3);

    // Peso atmosférico frio no 1º verso e tensão crescente antes do refrão (44.0 -> 47.0)
    const pesoFrio = smooth((t - 13.0) / 3.0) * (1 - smooth((t - 44.5) / 2.2));
    const tensaoFinal = smooth((t - 43.5) / 3.2);

    // Micro-movimento vivo de câmera (nunca congela)
    const swayX = Math.sin(t * 0.55) * 14 + Math.cos(t * 0.23) * 8;
    const swayY = Math.cos(t * 0.42) * 8;
    const swayRot = Math.sin(t * 0.31) * 0.0045;

    // Estados de tipografia ativa (também impulsionam a câmera levemente)
    const estados = blocos.map((b) => estadoDoBloco(b, t)).filter(Boolean);
    const leitura = estados.find((e) => e.avanco > 0);
    const camBoost = leitura ? leitura.avanco * 0.028 : 0;
    const camShiftX = leitura ? leitura.blocoAtual.sentido * leitura.avanco * 14 : 0;

    ctx.fillStyle = "#070d18";
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    // Câmera global reage suavemente à leitura e ao beat
    const globalZoom = 1 + camBoost + pulsoBeat * 0.006;
    ctx.translate(W / 2 + camShiftX, H / 2);
    ctx.scale(globalZoom, globalZoom);
    ctx.translate(-W / 2, -H / 2);

    // Camada 1: Q01 Exterior Mestre (00:00 -> 25.4s)
    // Quadro 0 exato sem deslocamento para emenda limpa com pós-MM-02!
    const introEase = smooth(t / 3.5);
    const zoomQ01 = 1.0 + easeOutCubic(t / 25.4) * 0.11 + tBeat * 0.08;
    desenharPlano(
      imgQ01,
      zoomQ01,
      swayX * introEase,
      swayY * introEase - t * 0.6,
      swayRot * introEase,
      1 - tBeat
    );

    // Camada 2: Q03 Pátio / Muro com concertina (24.7s -> 36.5s)
    const localQ03 = clamp((t - 24.7) / 11.8);
    const zoomQ03 = lerp(1.02, 1.11, localQ03) + tGuarita * 0.06;
    desenharPlano(
      imgQ03,
      zoomQ03,
      swayX * 1.1 - localQ03 * 18,
      swayY * 1.1 - localQ03 * 10,
      swayRot * 1.1,
      tBeat * (1 - tGuarita)
    );

    // Camada 3: Q02 Guarita e Cancela Fechada (35.6s -> 47.0s, prepara Quadro-Âncora para Q04 no Take 02!)
    const localQ02 = clamp((t - 35.6) / 11.4);
    const zoomQ02 = lerp(1.03, 1.10, easeOutCubic(localQ02));
    // Nos últimos 1.2s desacelera o sway para estabilizar o quadro-âncora limpo em 47.0s
    const freioFinal = 1 - smooth((t - 45.8) / 1.2) * 0.7;
    desenharPlano(
      imgQ02,
      zoomQ02,
      swayX * freioFinal * 0.9,
      swayY * freioFinal * 0.8 - localQ02 * 8,
      swayRot * freioFinal * 0.8,
      tGuarita
    );

    // Neblina e atmosfera luminosa
    desenharNeblina(t, 0.85 + pesoFrio * 0.35 + tensaoFinal * 0.4);
    desenharAtmosfera(t, pulsoBeat, pesoFrio, tensaoFinal);

    ctx.restore();

    // Camada de primeiro plano: Tipografia cinética no terço superior-central
    for (const estado of estados) {
      desenharBloco(estado, t);
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
  window.__timelines.correntes01 = timeline;
  quadro(0);
});
