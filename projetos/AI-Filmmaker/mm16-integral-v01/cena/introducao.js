window.addEventListener("load", () => {
  const tela = document.getElementById("filme");
  const papel = document.getElementById("papel");
  const olhos = document.getElementById("olhos");
  const ctx = tela.getContext("2d", { alpha: false });
  const W = tela.width;
  const H = tela.height;
  const largura = papel.naturalWidth;
  const altura = papel.naturalHeight;
  const duracao = Number(document.querySelector("[data-composition-id]").dataset.duration);
  const limitar = n => Math.max(0, Math.min(1, n));
  const suave = n => {
    const p = limitar(n);
    return p * p * (3 - 2 * p);
  };
  const entre = (t, inicio, fim) => suave((t - inicio) / (fim - inicio));
  const crista = new Path2D(
    "M -25 698 Q 95 670 210 641 Q 305 594 437 614 Q 584 630 745 575 " +
    "Q 817 541 932 532 Q 1015 496 1106 499 Q 1210 504 1320 450 Q 1463 422 1570 388 L 1700 365"
  );
  const beiraBaixa = new Path2D(
    "M -20 884 Q 113 823 220 810 Q 325 784 452 789 Q 644 793 790 728 " +
    "Q 921 673 1040 678 Q 1190 672 1306 630 Q 1481 623 1690 566 L 1700 980 H -40 Z"
  );
  const sombraLateral = ctx.createRadialGradient(W * .56, H * .50, 230, W * .56, H * .50, W * .65);
  sombraLateral.addColorStop(0, "#150f0d00");
  sombraLateral.addColorStop(1, "#0d0a0b7a");

  const particulas = Array.from({ length: 17 }, (_, i) => ({
    x: ((i * 593 + 291) % 1733) + 67,
    y: 323 + ((i * 281) % 492),
    fase: i * 1.79,
    raio: 0.7 + (i % 4) * .53,
    velocidade: 3.7 + (i % 6) * 1.15,
  }));

  function luzNaDobra(t, avanco, abertura) {
    const centro = 1050 + 303 * avanco + 28 * Math.sin(t * .25);
    const raio = 352 + 146 * abertura;
    const fase = .84 + .09 * Math.sin(t * 1.17) + .04 * Math.sin(t * 2.98);
    const intensidade = (0.83 + 0.15 * abertura) * fase;
    const raioDoHalo = 293 + 110 * abertura;
    const y = 510 - 64 * avanco;
    ctx.globalCompositeOperation = "screen";
    const halo = ctx.createRadialGradient(centro, y, 0, centro, y, raioDoHalo);
    halo.addColorStop(0, `rgba(232, 160, 82, ${.34 * intensidade})`);
    halo.addColorStop(.36, `rgba(203, 114, 54, ${.14 * intensidade})`);
    halo.addColorStop(1, "#bf673600");
    ctx.save();
    ctx.translate(centro, y);
    ctx.scale(1, .46);
    ctx.translate(-centro, -y);
    ctx.fillStyle = halo;
    ctx.fillRect(centro - raioDoHalo, y - raioDoHalo, 2 * raioDoHalo, 2 * raioDoHalo);
    ctx.restore();
    const luz = ctx.createLinearGradient(centro - raio, 0, centro + raio, 0);
    luz.addColorStop(0, "#dc964c00");
    luz.addColorStop(.27, `rgba(211, 126, 58, ${intensidade * .29})`);
    luz.addColorStop(.53, `rgba(252, 205, 130, ${intensidade})`);
    luz.addColorStop(.72, `rgba(235, 161, 86, ${intensidade * .70})`);
    luz.addColorStop(1, "#dc964c00");
    ctx.strokeStyle = luz;
    ctx.lineWidth = 2.7 + 2.4 * abertura;
    ctx.shadowColor = "#ed9c4f88";
    ctx.shadowBlur = 22 + 13 * abertura;
    ctx.stroke(crista);
    ctx.shadowBlur = 0;
    ctx.globalCompositeOperation = "source-over";
  }

  function ambiente(t) {
    const avanco = .19 * entre(t, .28, 8.9) + .24 * entre(t, 3.5, 17.4)
      + .57 * entre(t, 8.9, 27.82);
    const abertura = entre(t, 8.9, 20.4);
    const tamanho = 1.09 + .59 * avanco;
    const olharX = largura * (.504 + .14 * avanco);
    const deriva = entre(t, .28, 4) * Math.sin(t * .69);
    const olharY = altura * (.516 - .018 * avanco) + 2.5 * deriva;
    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.scale(tamanho * W / largura, tamanho * H / altura);
    ctx.translate(-olharX, -olharY);
    ctx.drawImage(papel, 0, 0);
    luzNaDobra(t, avanco, abertura);
    ctx.save();
    ctx.translate(-22 * abertura + deriva, 12 * abertura + 4 * deriva);
    ctx.clip(beiraBaixa);
    ctx.filter = "brightness(.84)";
    ctx.drawImage(papel, 0, 0);
    ctx.restore();
    ctx.restore();

    const poeira = entre(t, 8.9, 15.8) * (1 - entre(t, 22, 27.82));
    ctx.fillStyle = "#e8b778";
    for (const ponto of particulas) {
      ctx.globalAlpha = poeira * (.10 + .19 * suave(.5 + .5 * Math.sin(t * .91 + ponto.fase)));
      ctx.beginPath();
      ctx.arc(ponto.x + t * ponto.velocidade, ponto.y - t * .66 + 8 * Math.sin(t * .44 + ponto.fase),
        ponto.raio, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = sombraLateral;
    ctx.fillRect(0, 0, W, H);
  }

  function tecido(t) {
    if (t < 17.4 || t > 33.48) return;
    const erguer = entre(t, 17.4, 27.8);
    const passar = entre(t, 27.8, 33.48);
    const topo = 1108 - 1345 * erguer - 1380 * passar;
    const balanço = Math.sin((t - 18) * .80) * 10;
    const contorno = new Path2D(
      "M -150 84 Q 366 74 741 38 Q 1004 10 1274 15 Q 1638 10 2070 -60 " +
      "L 2070 1400 Q 1761 1380 1330 1428 Q 885 1460 500 1447 Q 175 1466 -150 1480 Z"
    );
    ctx.save();
    ctx.translate(0, topo + balanço);
    if (t >= 27.8) {
      ctx.save();
      ctx.shadowColor = "#180f0db0";
      ctx.shadowOffsetY = 10;
      ctx.shadowBlur = 23;
      ctx.fillStyle = "#2a1c16";
      ctx.fill(contorno);
      ctx.restore();
    }
    ctx.clip(contorno);
    ctx.drawImage(papel, -287 - 121 * erguer, -90, 2885, 1624);
    const volume = ctx.createLinearGradient(0, 0, 0, 1480);
    volume.addColorStop(0, "#d49d6229");
    volume.addColorStop(.2, "#130b0b17");
    volume.addColorStop(.51, "#0c070838");
    volume.addColorStop(.85, "#23141306");
    volume.addColorStop(1, "#f0bd7c25");
    ctx.fillStyle = volume;
    ctx.fillRect(-160, -80, W + 340, 1590);
    ctx.restore();
  }

  function desenhar(t) {
    ctx.fillStyle = "#160f11";
    ctx.fillRect(0, 0, W, H);
    if (t < 27.80) {
      ambiente(t);
    } else {
      ctx.drawImage(olhos, 0, 0, W, H);
      ctx.fillStyle = `rgba(15, 9, 9, ${.38 * (1 - entre(t, 29.32, 34.36))})`;
      ctx.fillRect(0, 0, W, H);
    }
    // A imagem sob o tecido muda só quando a camada ocupa todo o quadro.
    tecido(t);
  }

  const relogio = { t: 0 };
  const timeline = gsap.timeline({ paused: true });
  timeline.to(relogio, {
    t: duracao, duration: duracao, ease: "none",
    onUpdate: () => {
      if (relogio.t < 34.4) desenhar(relogio.t);
    },
  });
  window.__timelines = { mm16: timeline };
  desenhar(0);
});
