window.addEventListener("load", () => {
  const imgs = {
    ancora02: document.getElementById("ancora02"),
    voidBg: document.getElementById("voidBg"),
    ladraLivre: document.getElementById("ladraLivre"),
    arcoFrente: document.getElementById("arcoFrente"),
    portaMoldura: document.getElementById("portaMoldura"),
    portaFolha: document.getElementById("portaFolha"),
    ladraPorta: document.getElementById("ladraPorta"),
    caminhoBg: document.getElementById("caminhoBg"),
    redeasEsq: document.getElementById("redeasEsq"),
  };

  const plano = document.getElementById("plano");
  const ctx = plano.getContext("2d", { alpha: false });
  const W = plano.width;
  const H = plano.height;
  const { fps, quadros, cues, pivos, blocosTexto } = montagem;

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
  const easeInCubic = (v) => Math.pow(clamp(v), 3);
  const easeInOutCubic = (v) => {
    const p = clamp(v);
    return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
  };
  const lerp = (a, b, t) => a + (b - a) * t;

  // ===========================================================================
  // MOTOR DE TIPOGRAFIA CINÉTICA (PADRÃO APROVADO TAKE 01 / TAKE 02 v03)
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
      termo.meio + direcao * (impacto ? 48 : 26) * viagem,
      termo.base + eixoY + (impacto ? 58 : -22) * viagem
    );
    ctx.rotate(direcao * viagem * (impacto ? 0.095 : 0.06));
    ctx.scale(escala, escala);
    ctx.globalAlpha = opacidade * smooth(decorrido / 0.11);
    ctx.font = termo.fonte;
    ctx.letterSpacing = termo.espaco;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.lineJoin = "round";

    ctx.shadowColor = "rgba(4, 2, 1, 0.92)";
    ctx.shadowBlur = impacto ? 22 : 12;
    ctx.shadowOffsetY = impacto ? 7 : 4;
    ctx.strokeStyle = "rgba(9, 5, 3, 0.96)";
    ctx.lineWidth = impacto ? 8 : 5.5;
    ctx.strokeText(termo.frase, 0, -eixoY);

    ctx.shadowColor = termo.cor === "ambar" ? "rgba(255, 148, 42, 0.44)" : "rgba(0, 0, 0, 0.35)";
    ctx.shadowBlur = termo.cor === "ambar" ? 24 : 10;
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
      tilt: intensidade * blocoAtual.sentido * Math.sin(fase - 0.35) * 0.020,
    };
  }

  function desenharBloco({ blocoAtual, saida, tilt }, t) {
    const { centro, inclinacao, palavras, entrada, ultimoTermo, sentido } = blocoAtual;
    const aprox = smooth((t - entrada) / 0.46);
    const acento = smooth((t - ultimoTermo) / 0.72);
    const z = 0.95 + aprox * 0.05 + acento * 0.03 - saida * 0.16;
    const dxSaida = blocoAtual.id === "c4-pergunta-alma" ? 0 : sentido * saida * 135;
    const dySaida = blocoAtual.id === "c4-pergunta-alma" ? -saida * 55 : -saida * 64;

    ctx.save();
    ctx.translate(
      centro[0] - (blocoAtual.id === "c4-pergunta-alma" ? 0 : sentido * (1 - aprox) * 40) + dxSaida,
      centro[1] + (1 - aprox) * 28 + dySaida
    );
    ctx.rotate(
      inclinacao -
        (blocoAtual.id === "c4-pergunta-alma" ? 0 : sentido * (1 - aprox) * 0.065) +
        (blocoAtual.id === "c4-pergunta-alma" ? 0 : sentido * saida * 0.08) +
        tilt
    );
    ctx.scale(z, z);
    for (const termo of palavras) {
      desenharPalavra(termo, t, 1 - saida, sentido);
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
  let seed = 2026;
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
  // FUNÇÕES DE ATERRAMENTO, SOMBRAS MACIAS E RESPIRAÇÃO EM MALHA (ZERO BOUNCE)
  // ===========================================================================
  function aplicarCamera(zoom, focusX, focusY, shakeX, shakeY, rot) {
    ctx.translate(W / 2 + shakeX, H / 2 + shakeY);
    ctx.rotate(rot);
    ctx.scale(zoom, zoom);
    ctx.translate(-focusX, -focusY);
  }

  function desenharContraluz(t, intensidade, cx, cy, corQuente) {
    const pulso = (1 - Math.cos((t * Math.PI * 2) / 3.8)) / 2;
    const rx = 560 + pulso * 48 + intensidade * 145;
    const ry = 420 + pulso * 32 + intensidade * 100;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(1, ry / rx);
    const g = ctx.createRadialGradient(0, 0, 18, 0, 0, rx);
    const a = 0.08 + pulso * 0.04 + intensidade * 0.14;
    if (corQuente) {
      g.addColorStop(0, `rgba(255, 142, 52, ${a})`);
      g.addColorStop(0.45, `rgba(192, 82, 24, ${a * 0.48})`);
      g.addColorStop(1, "rgba(110, 36, 10, 0)");
    } else {
      g.addColorStop(0, `rgba(218, 92, 30, ${a})`);
      g.addColorStop(0.50, `rgba(135, 48, 16, ${a * 0.46})`);
      g.addColorStop(1, "rgba(70, 22, 8, 0)");
    }
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = g;
    ctx.fillRect(-rx, -rx, rx * 2, rx * 2);
    ctx.restore();
  }

  function desenharSombrasLadra(peEsq, peDir, intensidadeLuz, alpha) {
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
    const ao = ctx.createRadialGradient(0, 0, 12, 0, 0, 124);
    ao.addColorStop(0, "rgba(4, 2, 1, 0.78)");
    ao.addColorStop(0.50, "rgba(6, 3, 2, 0.40)");
    ao.addColorStop(1, "rgba(6, 3, 2, 0)");
    ctx.fillStyle = ao;
    ctx.fillRect(-126, -126, 252, 252);
    ctx.restore();

    const pes = [
      [peEsq[0], peEsq[1] + 1, 35, 9.5],
      [peDir[0], peDir[1] + 1, 35, 9.5],
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

  function desenharSombraPorta(alpha, abertura) {
    if (alpha <= 0.005) return;
    ctx.save();
    ctx.globalAlpha = clamp(alpha);
    const bases = [
      [776, 843, 56, 14],
      [1134, 843, 56, 14],
    ];
    for (const [bx, by, rx, ry] of bases) {
      ctx.save();
      ctx.translate(bx, by);
      ctx.scale(1, ry / rx);
      const g = ctx.createRadialGradient(0, 0, 4, 0, 0, rx);
      g.addColorStop(0, "rgba(2, 1, 0, 0.88)");
      g.addColorStop(0.55, "rgba(4, 2, 1, 0.42)");
      g.addColorStop(1, "rgba(4, 2, 1, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(-rx, -rx, rx * 2, rx * 2);
      ctx.restore();
    }
    ctx.save();
    ctx.filter = "blur(18px)";
    ctx.fillStyle = `rgba(4, 2, 1, ${lerp(0.52, 0.16, abertura)})`;
    ctx.beginPath();
    ctx.ellipse(955, 850, 195, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.restore();
  }

  function desenharLadraViva(img, t, tensao, alpha) {
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

      const dx = pesoSup * (microSway + tensao * 1.6);
      const dy = -(pesoSup * (resp * 1.55 + tensao * 1.8));
      const expandX = 1 + pesoPeito * (resp * 0.0052);
      const dw = sw * expandX;
      const drawX = sx - (dw - sw) / 2 + dx;

      ctx.drawImage(img, sx, y, sw, faixaH + 0.6, drawX, y + dy, dw, faixaH + 0.6);
    }
    ctx.restore();
  }

  function desenharNevoaRasteira(t, intensidade, ladoFrio) {
    ctx.save();
    const drift1 = Math.sin(t * 0.30) * 80;
    const drift2 = Math.cos(t * 0.22 + 1.1) * 100;
    const nuvens = [
      { x: 960 + drift1, y: 892, rx: 560, ry: 90, a: 0.13 + intensidade * 0.05, rgb: "194, 102, 42" },
      {
        x: 680 + drift2,
        y: 924,
        rx: 460,
        ry: 80,
        a: 0.09 + intensidade * 0.04,
        rgb: ladoFrio ? "58, 70, 86" : "140, 68, 26",
      },
      { x: 1210 - drift1 * 0.8, y: 912, rx: 490, ry: 82, a: 0.11 + intensidade * 0.05, rgb: "178, 88, 34" },
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
    const r = 190 + intensidade * 40;
    const g = ctx.createRadialGradient(0, 0, 18, 0, 0, r);
    const a = 0.08 + pulso * 0.035 + intensidade * 0.065;
    g.addColorStop(0, `rgba(255, 146, 54, ${a})`);
    g.addColorStop(0.55, `rgba(202, 86, 26, ${a * 0.42})`);
    g.addColorStop(1, "rgba(150, 52, 16, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(-r, -r, r * 2, r * 2);
    ctx.restore();
  }

  // ===========================================================================
  // PORTA 2.5D — FOLHA EM PERSPECTIVA REAL (SEM PORTA COLADA ATRÁS)
  // ===========================================================================
  function desenharFolhaPerspectiva(abertura) {
    const [fx, fy, fw, fh] = pivos.folhaRect; // [791, 151, 327, 691]
    const eixoX = pivos.folhaEixoX; // 795
    const cy = 500;
    // Abre amplamente (~82 graus) para liberar totalmente a passagem da câmera pelo vão!
    const theta = abertura * 1.42;
    const D = 1150;
    const fatias = 28;
    const sw = fw / fatias;

    ctx.save();
    ctx.imageSmoothingQuality = "high";
    if (abertura <= 0.002) {
      ctx.drawImage(imgs.portaFolha, 0, 0, W, H);
    } else {
      for (let i = 0; i < fatias; i++) {
        const sx0 = fx + i * sw;
        const sx1 = sx0 + sw;
        const u0 = sx0 - eixoX;
        const u1 = sx1 - eixoX;

        const px0 = u0 * Math.cos(theta);
        const pz0 = u0 * Math.sin(theta);
        const px1 = u1 * Math.cos(theta);
        const pz1 = u1 * Math.sin(theta);

        const p0 = D / (D + pz0);
        const p1 = D / (D + pz1);
        const pm = (p0 + p1) * 0.5;

        const dx0 = eixoX + px0 * p0;
        const dx1 = eixoX + px1 * p1;
        const dw = Math.max(0.8, dx1 - dx0 + 0.85);
        const dh = fh * pm;
        const dy = cy + (fy - cy) * pm;

        ctx.drawImage(imgs.portaFolha, sx0, fy, sw + 0.5, fh, dx0, dy, dw, dh);
      }

      const uEnd = fx + fw - eixoX;
      const pEnd = D / (D + uEnd * Math.sin(theta));
      const xEdge = eixoX + uEnd * Math.cos(theta) * pEnd;
      const yTopEdge = cy + (fy - cy) * pEnd;
      const yBotEdge = cy + (fy + fh - cy) * pEnd;

      ctx.fillStyle = `rgba(4, 2, 1, ${abertura * 0.42})`;
      ctx.beginPath();
      ctx.moveTo(eixoX, fy);
      ctx.lineTo(xEdge, yTopEdge);
      ctx.lineTo(xEdge, yBotEdge);
      ctx.lineTo(eixoX, fy + fh);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = `rgba(225, 134, 62, ${abertura * 0.62})`;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(xEdge, yTopEdge + 2);
      ctx.lineTo(xEdge, yBotEdge - 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function desenharPorta(alpha, abertura, escala, pivoY, comSombraBase, escurecerPassagem) {
    if (alpha <= 0.004) return;
    ctx.save();
    ctx.globalAlpha = clamp(alpha);
    ctx.translate(955, pivoY);
    ctx.scale(escala, escala);
    ctx.translate(-955, -pivoY);

    if (comSombraBase) {
      desenharSombraPorta(1.0, abertura);
    }

    if (escurecerPassagem > 0.01) {
      ctx.filter = `brightness(${lerp(1.0, 0.55, escurecerPassagem).toFixed(2)})`;
    }

    // Folha sempre atrás do batente para preservar as dobradiças sobre a aresta esquerda
    desenharFolhaPerspectiva(abertura);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(imgs.portaMoldura, 0, 0, W, H);
    ctx.restore();
  }

  // ===========================================================================
  // ARCO LIMPO DO BLOCO A (APENAS 01-arco-papel-frente, SEMPRE scale >= 1.03!)
  // ===========================================================================
  function desenharArcoLimpoBlocoA(t, swayX, swayY, swayRot) {
    if (t >= cues.arcoAbreFim) return;

    // 0.00 -> 1.00: entra de fora das bordas da lente (1.52 -> 1.04)
    const pEntra = easeOutCubic(t / cues.arcoAssentado);
    // 7.80 -> 10.95: abre em um único avanço para fora da tela (1.04 -> 2.75)
    const pAbre = easeInOutCubic((t - cues.arcoAbreInicio) / (cues.arcoAbreFim - cues.arcoAbreInicio));

    const respiro = Math.sin(t * 0.65) * 0.010 * (1 - pAbre);
    // Garantia matemática absoluta: escala NUNCA fica abaixo de 1.03 (zero bordas de PNG, zero corte na cabeça!)
    const escala = Math.max(1.03, lerp(1.52, 1.04, pEntra) + pAbre * 1.72 + respiro);

    const alphaIn = smooth(t / 0.80);
    const alphaOut = 1 - smooth((t - 10.30) / 0.65);
    const alpha = alphaIn * alphaOut;
    if (alpha <= 0.004) return;

    const cyPiso = 800;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(W / 2 + swayX * 1.1, cyPiso + swayY * 0.8);
    ctx.rotate(swayRot * 0.85);
    ctx.scale(escala, escala);
    ctx.translate(-960, -cyPiso);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(imgs.arcoFrente, 0, 0, W, H);
    ctx.restore();
  }

  // ===========================================================================
  // RENDERIZAÇÃO DOS MUNDOS (BLOCOS A/B E BLOCO C PARA ESTEIRA LATERAL)
  // ===========================================================================
  function desenharMundoAB(t, textBoost) {
    const emBlocoB = smooth((t - cues.transicaoABInicio) / (cues.blocoBInicio - cues.transicaoABInicio));
    // Porta #1 emerge suavemente quando o arco abre (7.8 -> 10.8)
    const surgPorta1 = smooth((t - 7.8) / 3.0);
    const trocaLadra = smooth((t - 9.4) / 1.4);

    // ---- TRAVESSIA FÍSICA PELA PORTA ABERTA (BLOCO B: 13.80 -> 16.25) ----
    // 1. Porta #1 abre amplamente (13.80 -> 14.65)
    const abertura1 = easeOutCubic((t - cues.portaAbreInicio) / (cues.portaAbreFim - cues.portaAbreInicio));
    // 2. Porta #1 cresce forte em direção ao espectador (1.0 -> 6.8) e sai pelas 4 bordas da tela (14.45 -> 15.80)
    const pass1 = easeInCubic((t - cues.portaPassaInicio) / (cues.portaPassaFim - cues.portaPassaInicio));
    const escalaPorta1 = t < cues.blocoBInicio
      ? lerp(0.86, 1.0, surgPorta1)
      : Math.pow(6.8, pass1);
    const alphaPorta1 = surgPorta1 * (1 - smooth((pass1 - 0.86) / 0.14));
    // Quando a Porta #1 já está vindo para cima da câmera (pass1 > 0.14), desenha NA FRENTE da Ladra!
    const porta1NaFrenteDaLadra = pass1 > 0.14;

    // 3. Porta #2 (idêntica e FECHADA) emerge do fundo escuro do Void logo após atravessarmos a Porta #1 (14.85 -> 16.25)
    const progPorta2 = easeOutCubic((t - cues.porta2SurgeInicio) / (cues.porta2CravaFim - cues.porta2SurgeInicio));
    const alphaPorta2 = smooth((t - cues.porta2SurgeInicio) / 0.45);
    const escalaPorta2 = lerp(0.56, 1.0, progPorta2);

    // Peso seco quando a 2ª porta idêntica crava na frente da Ladra em 16.25 ("todo dia")
    const dtBatida = t - cues.porta2CravaFim;
    const batidaShake = dtBatida > 0 && dtBatida < 0.30 ? Math.exp(-dtBatida * 13) * 9.0 : 0;
    const shakeX = Math.sin(t * 95) * batidaShake;
    const shakeY = Math.cos(t * 112) * batidaShake * 0.75;

    const swayX = Math.sin(t * 0.52) * 4.2;
    const swayY = Math.cos(t * 0.42) * 2.8;
    const swayRot = Math.sin(t * 0.30) * 0.0020;

    // Agostinho baixa a luz para brasa profunda (16.6 -> 21.8)
    const agostinhoDim = smooth((t - cues.agostinhoBrilhoBaixa) / 2.2);

    // Câmera: Bloco A estável com avanço suave; Bloco B avança durante a travessia da porta e depois firma sobre Agostinho
    const pushA = smooth(t / 11.0) * 0.05;
    const rushTravessia = Math.sin(clamp((t - 14.3) / 1.95) * Math.PI) * 0.075;
    const pushPosPorta = easeInOutCubic((t - 16.3) / 5.5) * 0.11;
    const zoom = lerp(1.0 + pushA, 1.0 + rushTravessia + pushPosPorta, emBlocoB) + textBoost * 0.75;
    const focusX = 960 + swayX * 0.45;
    const focusY = lerp(540, 532, emBlocoB) + swayY * 0.45;

    ctx.fillStyle = "#070504";
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    aplicarCamera(zoom, focusX, focusY, shakeX, shakeY, swayRot);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(imgs.voidBg, 0, 0, W, H);

    if (agostinhoDim > 0.005) {
      ctx.fillStyle = `rgba(10, 4, 2, ${agostinhoDim * 0.24})`;
      ctx.fillRect(0, 0, W, H);
    }

    const forcaLuz = lerp(0.32, 0.10, agostinhoDim) + rushTravessia * 2.2;
    desenharContraluz(t, forcaLuz, 960, 540, agostinhoDim < 0.5);

    // PORTA #2 (idêntica fechada emergindo do fundo do Void, sempre atrás da Ladra)
    if (alphaPorta2 > 0.004) {
      desenharPorta(alphaPorta2, 0, escalaPorta2, 842, progPorta2 > 0.65, (1 - progPorta2) * 0.45);
    }

    // PORTA #1 enquanto ainda está ATRÁS da Ladra (antes de passar por ela rumo ao espectador)
    if (!porta1NaFrenteDaLadra && alphaPorta1 > 0.004) {
      desenharPorta(alphaPorta1, abertura1, escalaPorta1, 842, pass1 < 0.05, 0);
    }

    // Sombras macias de aterramento da Ladra
    const peEsq = [
      lerp(pivos.ladraLivrePeEsq[0], pivos.ladraPortaPeEsq[0], trocaLadra),
      lerp(pivos.ladraLivrePeEsq[1], pivos.ladraPortaPeEsq[1], trocaLadra),
    ];
    const peDir = [
      lerp(pivos.ladraLivrePeDir[0], pivos.ladraPortaPeDir[0], trocaLadra),
      lerp(pivos.ladraLivrePeDir[1], pivos.ladraPortaPeDir[1], trocaLadra),
    ];
    desenharSombrasLadra(peEsq, peDir, forcaLuz, 1.0);

    // Ladra viva (respiração em malha, pés 100% plantados, zero bounce)
    const tensao = abertura1 * (1 - pass1) * 0.40 + (dtBatida > 0 && dtBatida < 0.6 ? Math.exp(-dtBatida * 5) * 0.5 : 0);
    if (1 - trocaLadra > 0.004) {
      desenharLadraViva(imgs.ladraLivre, t, tensao, 1 - trocaLadra);
    }
    if (trocaLadra > 0.004) {
      desenharLadraViva(imgs.ladraPorta, t, tensao, trocaLadra);
    }

    desenharLightWrap(t, forcaLuz, 960);
    desenharNevoaRasteira(t, forcaLuz, false);

    // PORTA #1 passando NA FRENTE da Ladra, crescendo rumo à lente até sair pelas 4 bordas da tela!
    if (porta1NaFrenteDaLadra && alphaPorta1 > 0.004) {
      const pivoYPassagem = lerp(842, 500, smooth((pass1 - 0.14) / 0.28));
      desenharPorta(alphaPorta1, abertura1, escalaPorta1, pivoYPassagem, false, pass1 * 0.55);
    }

    ctx.restore();

    // Moldura de papel rasgado do Bloco A (SEMPRE scale >= 1.03, sem sobrepor cabeça nem bordas)
    desenharArcoLimpoBlocoA(t, swayX, swayY, swayRot);
  }

  function desenharMundoC(t, textBoost) {
    const dtC = Math.max(0, t - cues.blocoCInicio);
    const swayX = Math.sin(t * 0.50) * 4.2;
    const swayY = Math.cos(t * 0.40) * 2.8;
    const swayRot = Math.sin(t * 0.28) * 0.0020;

    const pushC = easeInOutCubic(dtC / 8.2) * 0.11;
    const dtClimax = Math.max(0, t - cues.climaxPergunta);
    const punchClimax = dtClimax > 0 ? Math.exp(-dtClimax * 3.8) * 0.028 : 0;
    const zoomC = 1.01 + pushC + punchClimax + textBoost * 0.7;

    const focusX = 960 + swayX * 0.4;
    const focusY = 530 + swayY * 0.4;

    // Fade dissolvendo a Ladra (e suas sombras) na entrada de "A pergunta é só uma:" (30.00 -> 30.95)
    const alphaLadraC = 1 - smooth((t - cues.ladraFadeInicio) / (cues.ladraFadeFim - cues.ladraFadeInicio));

    ctx.fillStyle = "#070504";
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    aplicarCamera(zoomC, focusX, focusY, 0, 0, swayRot);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(imgs.caminhoBg, 0, 0, W, H);

    const forcaDir = 0.24 + smooth((t - 25.0) / 5.5) * 0.22;
    desenharContraluz(t, forcaDir, 1180, 560, true);

    ctx.save();
    const gradEsq = ctx.createLinearGradient(0, 0, 820, 0);
    gradEsq.addColorStop(0, "rgba(6, 10, 16, 0.28)");
    gradEsq.addColorStop(1, "rgba(6, 10, 16, 0)");
    ctx.fillStyle = gradEsq;
    ctx.fillRect(0, 0, 820, H);
    ctx.restore();

    if (alphaLadraC > 0.004) {
      desenharSombrasLadra(pivos.ladraLivrePeEsq, pivos.ladraLivrePeDir, forcaDir, alphaLadraC);
      desenharLadraViva(imgs.ladraLivre, t, smooth((t - 29.5) / 1.5) * 0.35, alphaLadraC);
      ctx.save();
      ctx.globalAlpha = alphaLadraC;
      desenharLightWrap(t, forcaDir, 968);
      ctx.restore();
    }
    desenharNevoaRasteira(t, forcaDir, true);
    ctx.restore();

    // Saída das rédeas/sela para fora à esquerda (29.85 -> 30.75)
    const pSaiRedeas = easeInOutCubic((t - cues.redeasSaiInicio) / (cues.redeasSaiFim - cues.redeasSaiInicio));
    const alphaRedeas = 1 - smooth((t - 30.40) / 0.38);

    if (alphaRedeas > 0.004) {
      const tugDiabo =
        smooth((t - 25.8) / 0.45) * (1 - smooth((t - 27.1) / 0.55));
      const rotRedeas =
        Math.sin(t * 1.15) * 0.024 +
        Math.cos(t * 0.62) * 0.012 +
        tugDiabo * 0.042 -
        pSaiRedeas * 0.14;
      const scaleRedeas = 1.02 + (zoomC - 1.01) * 1.65;
      const dxRedeas = -14 - (zoomC - 1.01) * 45 + swayX * 1.35 + tugDiabo * 14 - pSaiRedeas * 680;
      const dyRedeas = swayY * 1.1;

      ctx.save();
      ctx.globalAlpha = alphaRedeas;
      ctx.translate(pivos.redeasPivo[0] + dxRedeas, pivos.redeasPivo[1] + dyRedeas);
      ctx.rotate(rotRedeas);
      ctx.scale(scaleRedeas, scaleRedeas);
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(imgs.redeasEsq, -pivos.redeasPivo[0], -pivos.redeasPivo[1], W, H);
      ctx.restore();
    }
  }

  // ===========================================================================
  // QUADRO PRINCIPAL
  // ===========================================================================
  function quadro(t) {
    const estadosTexto = blocos.map((b) => estadoDoBloco(b, t)).filter(Boolean);
    const leitura = estadosTexto.find((e) => e.avanco > 0);
    const textBoost = leitura ? leitura.avanco * 0.014 : 0;

    if (t < cues.transicaoBCInicio) {
      desenharMundoAB(t, textBoost);
    } else if (t >= cues.transicaoBCFim) {
      desenharMundoC(t, textBoost);
    } else {
      const slide = easeInOutCubic((t - cues.transicaoBCInicio) / (cues.transicaoBCFim - cues.transicaoBCInicio));
      const divX = Math.round(W * (1 - slide));

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, divX, H);
      ctx.clip();
      ctx.translate(-W * slide, 0);
      desenharMundoAB(t, textBoost);
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.rect(divX, 0, W - divX, H);
      ctx.clip();
      ctx.translate(W * (1 - slide), 0);
      desenharMundoC(t, textBoost);
      ctx.restore();

      ctx.save();
      const seam = ctx.createLinearGradient(divX - 48, 0, divX + 18, 0);
      seam.addColorStop(0, "rgba(0, 0, 0, 0)");
      seam.addColorStop(0.75, "rgba(4, 2, 1, 0.72)");
      seam.addColorStop(0.90, "rgba(186, 102, 44, 0.25)");
      seam.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = seam;
      ctx.fillRect(divX - 48, 0, 66, H);
      ctx.restore();
    }

    // EMENDA INICIAL CONTÍNUA PARTINDO DO TAKE 02 v03 (0.00 -> 0.65s)
    if (t < cues.emendaTake02Fim) {
      const pEmenda = smooth(t / cues.emendaTake02Fim);
      const a02 = 1 - pEmenda;
      if (a02 > 0.003) {
        ctx.save();
        ctx.globalAlpha = a02;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(imgs.ancora02, 0, 0, W, H);
        ctx.restore();
      }
    }

    // TIPOGRAFIA CINÉTICA DO 2º VERSO (limpa totalmente em 32.82s)
    for (const estado of estadosTexto) {
      desenharBloco(estado, t);
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
  window.__timelines.correntes03v03 = timeline;
  quadro(0);
});
