/* Cena 1 (0,00–3,14 s): "E se eu te dissesse que dá pra criar um motion desse nível…"
   Três tempos, câmera empurrando o tempo todo (1 → 1,16):
   A (q0–41)  "E se eu te dissesse" em Inter 250 é ESCRITO por uma faísca de luz quente que corre na
              ponta do texto, com uma linha de luz desenhando por baixo; em "que" a frase sobe e sai
              com glitch (fatias deslocadas + fantasma verde).
   B (q24–56) "que dá pra criar um" vira rótulo pequeno; uma MIRA de laser (vertical + horizontal +
              círculo tracejado girando, leitura de coordenadas) varre a grade, que acende atrás dela,
              e para onde o M vai cair.
   C (q53–98) "MOTION" (Inter 900, 350 px) entra GIGANTE letra a letra, incandescente (núcleo branco,
              borda verde, brilho forte, clarão e fagulhas em cada letra, tranco de câmera) e esfria
              para o verde ${PALETA.acento}; "DESSE NÍVEL" entra embaixo do mesmo jeito e esfria para o papel.
              A linha de luz sob MOTION (C01.yLuz) é a que o chicote de saída estica pela tela. */
import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { MiraLaser } from '../blocos/MiraLaser';
import { useCenaM } from '../cena';
import { Fala, useLayoutFala } from '../Fala';
import { C01 } from '../layout';
import { metricas } from '../medir';
import { BRILHO, clamp01, CORM, ease, falaDaCena, FONTEM, janelaM, lerp, mola, PALETA, RGB, TRIO } from '../tema';
import { Faisca, Flare, FundoM, HUD, LinhaLuz, Poeira, timecodeM } from '../visual';

type RGB = [number, number, number];
const mix = (a: RGB, b: RGB, t: number) => `rgb(${Math.round(lerp(a[0], b[0], t))},${Math.round(lerp(a[1], b[1], t))},${Math.round(lerp(a[2], b[2], t))})`;
const BRANCO: RGB = [255, 255, 255];
const VERDE: RGB = TRIO.acento;
const PAPEL: RGB = [241, 240, 232];

export const M01: React.FC = () => {
  const c = useCenaM();
  const f = c.frame;
  const fala = falaDaCena(1);
  const frase = fala.slice(0, 5);
  const rotulo = fala.slice(5, 10);
  const motion = fala.slice(10, 11);
  const nivel = fala.slice(11);

  /* ---------- A: a faísca escreve ---------- */
  const lf = useLayoutFala({ palavras: frase, x: C01.frase.x, y: C01.frase.y, alinhar: 'centro', estilo: C01.frase.estilo, largura: 1800 });
  const baseFrase = lf.itens[0].base;
  const xFaisca = (fr: number) => {
    const its = lf.itens;
    if (fr < its[0].q) return its[0].x;
    for (let i = 0; i < its.length; i++) {
      const it = its[i];
      const dur = Math.max(1, it.qFim - it.q - 1);
      if (fr <= it.q + dur) return it.x + it.w * clamp01((fr - it.q) / dur);
      const prox = its[i + 1];
      if (prox && fr < prox.q) return lerp(it.x + it.w, prox.x, ease.suave((fr - it.q - dur) / Math.max(1, prox.q - it.q - dur)));
    }
    const u = its[its.length - 1];
    return u.x + u.w;
  };
  const qSai = c.local(rotulo[0].s) - 2; // "que": a frase sobe e sai
  const sai = janelaM(f, qSai, qSai + 10, 'entra');
  const glitch = clamp01(1 - Math.abs(f - (qSai + 2)) / 4) + clamp01(1 - Math.abs(f - (qSai + 7)) / 3) * 0.8;
  const fx = xFaisca(f);
  const yLinhaFrase = baseFrase + 30;
  const rastroFaisca: [number, number][] = Array.from({ length: 10 }, (_, j) => [xFaisca(f - j - 1), yLinhaFrase]);
  const forcaFaisca = 1 - janelaM(f, qSai + 1, qSai + 6);
  const frasePronta = (
    <>
      <LinhaLuz x1={lf.itens[0].x - 40} x2={fx + 6} y={yLinhaFrase} cabeca={0} espessura={2.5} />
      <Fala
        palavras={frase}
        x={C01.frase.x}
        y={C01.frase.y}
        alinhar="centro"
        estilo={C01.frase.estilo}
        largura={1800}
        modo="maquina"
        cursor={false}
        cor={CORM.papel}
        estiloPalavra={() => ({ textShadow: BRILHO.branco })}
      />
    </>
  );
  const fatias = 7;
  const yTopoFrase = C01.frase.y - 20;
  const hFatia = (C01.frase.estilo.tamanho * 1.5) / fatias;

  /* ---------- B: mira de laser ---------- */
  const lm = useLayoutFala({ palavras: motion, x: C01.motion.x, y: C01.motion.y, alinhar: 'centro', estilo: C01.motion.estilo, textos: { 0: 'MOTION' } });
  const M = lm.itens[0];
  const baseM = M.base;
  const capM = metricas(C01.motion.estilo).cap;
  const qMira = 24;
  const alvo: [number, number] = [M.x + 10, baseM];
  const pA: [number, number] = [1720, 230];
  const pB: [number, number] = [1260, 780];
  const t1 = janelaM(f, qMira, qMira + 12, 'corte');
  const t2 = janelaM(f, qMira + 12, M.q - 1, 'corte');
  const mx = f < qMira + 12 ? lerp(pA[0], pB[0], t1) : lerp(pB[0], alvo[0], t2);
  const my = f < qMira + 12 ? lerp(pA[1], pB[1], t1) : lerp(pB[1], alvo[1], t2);
  const miraOn = janelaM(f, qMira - 2, qMira + 4);
  const qMotionFim = M.q + 2 * (M.letras.length - 1) + 6;
  const miraFora = janelaM(f, qMotionFim, qMotionFim + 12, 'sai');
  const raioMira = 230 * (1 - miraFora) * (0.6 + 0.4 * mola(f, 'estalo', qMira));
  const gradeOn = 0.18 + 0.82 * janelaM(f, qMira, qMira + 18, 'suave');

  /* ---------- C: MOTION incandescente ---------- */
  const qLetra = (i: number) => M.q + i * 2;
  let tranco = 0;
  M.letras.forEach((_, i) => {
    const d = f - qLetra(i);
    if (d >= 0 && d < 5) tranco += (random(`m01-sh-${i}-${f}`) - 0.5) * 14 * (1 - d / 5);
  });
  const ultimaLetra = M.letras.reduce((acc, _l, i) => (f >= qLetra(i) ? i : acc), -1);
  const headM = ultimaLetra >= 0 ? M.x + M.letras[ultimaLetra].x + M.letras[ultimaLetra].w + 30 : M.x - 40;
  const motionFeito = f >= qMotionFim;
  const ln = useLayoutFala({ palavras: nivel, x: C01.nivel.x, y: C01.nivel.y, alinhar: 'centro', estilo: C01.nivel.estilo, textos: { 0: 'DESSE', 1: 'NÍVEL' } });
  const fimNivel = ln.itens[ln.itens.length - 1].qFim;

  const z = 1 + 0.16 * ease.suave(clamp01(f / 98));
  const giro = Math.sin(f / 40) * 0.5;

  return (
    <AbsoluteFill>
      <FundoM brilho={[50, 52]} grade={gradeOn} deriva={0.6} forcaGrade={1 + 1.2 * janelaM(f, qMira, qMira + 18, 'suave')} />
      <Poeira semente="m01" velocidade={1.3} />
      <AbsoluteFill style={{ transformOrigin: '960px 540px', transform: `translate(${tranco}px, ${tranco * 0.5}px) scale(${z}) rotate(${giro}deg)` }}>
        {/* ---- A ---- */}
        {sai < 1 ? (
          <AbsoluteFill style={{ transform: `translateY(${-320 * sai}px)`, opacity: 1 - sai }}>
            {glitch > 0.05 ? (
              <>
                <AbsoluteFill style={{ transform: `translateX(${18 * glitch}px)`, opacity: 0.75 * glitch, filter: 'sepia(1) hue-rotate(80deg) saturate(6)', mixBlendMode: 'screen' }}>
                  {frasePronta}
                </AbsoluteFill>
                {Array.from({ length: fatias }, (_, i) => {
                  const dx = (random(`m01-g-${i}-${Math.floor(f / 2)}`) - 0.5) * 140 * glitch;
                  const y0 = yTopoFrase + i * hFatia;
                  return (
                    <AbsoluteFill key={i} style={{ clipPath: `inset(${y0}px 0 ${1080 - y0 - hFatia}px 0)`, transform: `translateX(${dx}px)` }}>
                      {frasePronta}
                    </AbsoluteFill>
                  );
                })}
              </>
            ) : (
              frasePronta
            )}
          </AbsoluteFill>
        ) : null}
        <Faisca x={fx} y={yLinhaFrase - 6 - 320 * sai} forca={forcaFaisca} rastro={rastroFaisca} semente="m01f" />

        {/* ---- B ---- */}
        <Fala palavras={rotulo} x={M.x + 12} y={C01.rotulo.y} estilo={C01.rotulo.estilo} cor={CORM.papel} destaque={['criar']} />
        {miraOn > 0 ? <MiraLaser x={mx} y={my} raio={raioMira} fora={miraFora} opacidade={miraOn} /> : null}

        {/* ---- C ---- */}
        {f >= M.q ? (
          <LinhaLuz x1={M.x - 60} x2={motionFeito ? lerp(headM, M.x + M.w + 120, janelaM(f, qMotionFim, qMotionFim + 10)) : headM} y={C01.yLuz()} cabeca={1} espessura={3} />
        ) : null}
        {M.letras.map((l, i) => {
          const qi = qLetra(i);
          const d = f - qi;
          if (d < 0) return null;
          const m = mola(f, 'estalo', qi);
          const quente = 1 - janelaM(f, qi + 2, qi + 22, 'suave');
          const cx = M.x + l.x + l.w / 2;
          return (
            <React.Fragment key={i}>
              {/* bloom: cópia desfocada atrás, forte enquanto a letra está quente */}
              <div
                style={{
                  position: 'absolute',
                  left: M.x + l.x,
                  top: M.y,
                  height: M.h,
                  lineHeight: `${M.h}px`,
                  fontFamily: C01.motion.estilo.familia,
                  fontWeight: 900,
                  fontSize: C01.motion.estilo.tamanho,
                  whiteSpace: 'pre',
                  color: mix(BRANCO, VERDE, 0.5 + 0.5 * (1 - quente)),
                  opacity: clamp01(d / 2) * (0.22 + 0.4 * quente),
                  filter: `blur(${(18 + 10 * quente).toFixed(0)}px)`,
                  transformOrigin: `${l.w / 2}px ${baseM - M.y}px`,
                  transform: `translateY(${(1 - m) * -70}px) scale(${1.04 + 0.55 * (1 - m)})`,
                }}
              >
                {l.ch}
              </div>
              {/* aro + brilho: atrás do miolo (passe final abaixo), para o brilho nunca borrar a letra */}
              <div
                style={{
                  position: 'absolute',
                  left: M.x + l.x,
                  top: M.y,
                  height: M.h,
                  lineHeight: `${M.h}px`,
                  fontFamily: C01.motion.estilo.familia,
                  fontWeight: 900,
                  fontSize: C01.motion.estilo.tamanho,
                  whiteSpace: 'pre',
                  color: quente > 0.4 ? `rgb(${RGB.acento})` : `rgba(${RGB.claro},.55)`,
                  WebkitTextStroke: `${(3 + 6 * quente).toFixed(1)}px ${quente > 0.4 ? `rgb(${RGB.acento})` : `rgba(${RGB.claro},.55)`}`,
                  opacity: clamp01(d / 2),
                  transformOrigin: `${l.w / 2}px ${baseM - M.y}px`,
                  transform: `translateY(${(1 - m) * -70}px) scale(${1 + 0.55 * (1 - m)})`,
                  filter: `${d < 2 ? `blur(${((1 - d / 2) * 12).toFixed(1)}px) ` : ''}drop-shadow(0 0 ${(10 + 26 * quente).toFixed(0)}px rgba(255,255,255,${(0.2 + 0.6 * quente).toFixed(2)})) drop-shadow(0 0 ${(28 + 50 * quente).toFixed(0)}px rgba(${RGB.acento},${(0.55 + 0.3 * quente).toFixed(2)}))`,
                }}
              >
                {l.ch}
              </div>
              <Flare x={cx} y={baseM - capM / 2} forca={1 - janelaM(f, qi, qi + 8)} largura={700} />
              {d < 16
                ? Array.from({ length: 12 }, (_, j) => {
                    const r = (k: string) => random(`m01-fa-${k}-${i}-${j}`);
                    const a = r('a') * Math.PI * 2;
                    const dist = ease.sai(d / 16) * (80 + r('d') * 260);
                    const tam = 3 + r('s') * 4;
                    return (
                      <div
                        key={j}
                        style={{
                          position: 'absolute',
                          left: cx + Math.cos(a) * dist,
                          top: baseM - capM / 2 + Math.sin(a) * dist * 0.7 + (d / 16) ** 2 * 60,
                          width: tam,
                          height: tam,
                          borderRadius: '50%',
                          background: j % 3 === 0 ? '#fff' : CORM.verdeClaro,
                          opacity: 1 - d / 16,
                          boxShadow: `0 0 8px rgba(${RGB.acento},.9)`,
                        }}
                      />
                    );
                  })
                : null}
            </React.Fragment>
          );
        })}
        {/* miolo nítido: o gradiente da letra por cima de aro, bloom, flare e fagulhas (sem drop-shadow nem contorno) */}
        {M.letras.map((l, i) => {
          const qi = qLetra(i);
          const d = f - qi;
          if (d < 0) return null;
          const m = mola(f, 'estalo', qi);
          const quente = 1 - janelaM(f, qi + 2, qi + 22, 'suave');
          const corAro = quente > 0.4 ? `rgb(${RGB.acento})` : `rgba(${RGB.claro},.55)`;
          const base: React.CSSProperties = {
            position: 'absolute',
            left: M.x + l.x,
            top: M.y,
            height: M.h,
            lineHeight: `${M.h}px`,
            fontFamily: C01.motion.estilo.familia,
            fontWeight: 900,
            fontSize: C01.motion.estilo.tamanho,
            whiteSpace: 'pre',
            opacity: clamp01(d / 2),
            transformOrigin: `${l.w / 2}px ${baseM - M.y}px`,
            transform: `translateY(${(1 - m) * -70}px) scale(${1 + 0.55 * (1 - m)})`,
            filter: d < 2 ? `blur(${((1 - d / 2) * 12).toFixed(1)}px)` : undefined,
          };
          return (
            <React.Fragment key={`n${i}`}>
            {/* aro seco (sem brilho): separa a letra da vizinha que ela encosta */}
            <div style={{ ...base, color: corAro, WebkitTextStroke: `${(3 + 6 * quente).toFixed(1)}px ${corAro}` }}>{l.ch}</div>
            <div
              style={{
                position: 'absolute',
                left: M.x + l.x,
                top: M.y,
                height: M.h,
                lineHeight: `${M.h}px`,
                fontFamily: C01.motion.estilo.familia,
                fontWeight: 900,
                fontSize: C01.motion.estilo.tamanho,
                whiteSpace: 'pre',
                // núcleo branco descendo para a borda verde; esfria até o verde cheio
                backgroundImage: `linear-gradient(180deg, ${mix(BRANCO, [120, 245, 160], 1 - quente)} 0%, ${mix(BRANCO, VERDE, 1 - quente * 0.85)} 55%, ${mix([200, 255, 220], [34, 190, 88], 1 - quente)} 100%)`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                opacity: clamp01(d / 2),
                transformOrigin: `${l.w / 2}px ${baseM - M.y}px`,
                transform: `translateY(${(1 - m) * -70}px) scale(${1 + 0.55 * (1 - m)})`,
                filter: d < 2 ? `blur(${((1 - d / 2) * 12).toFixed(1)}px)` : undefined,
              }}
            >
              {l.ch}
            </div>
            </React.Fragment>
          );
        })}
        <Fala
          palavras={nivel}
          x={C01.nivel.x}
          y={C01.nivel.y}
          alinhar="centro"
          estilo={C01.nivel.estilo}
          textos={{ 0: 'DESSE', 1: 'NÍVEL' }}
          modo="letras"
          staggerLetra={0.9}
          estiloPalavra={(_i, t) => {
            const q = 1 - janelaM(t, 3, 20, 'suave');
            return {
              color: mix(BRANCO, PAPEL, 1 - q),
              WebkitTextStroke: `${(1 + 3 * q).toFixed(1)}px rgba(${RGB.claro},${(0.35 + 0.5 * q).toFixed(2)})`,
              textShadow: `0 0 ${(8 + 30 * q).toFixed(0)}px rgba(255,255,255,${(0.2 + 0.5 * q).toFixed(2)}), 0 0 ${(24 + 60 * q).toFixed(0)}px rgba(${RGB.acento},${(0.25 + 0.35 * q).toFixed(2)})`,
            };
          }}
        />
        {f >= fimNivel ? (
          <div style={{ position: 'absolute', left: M.x + M.w - 420, top: C01.yLuz() + 14, width: 420, textAlign: 'right', fontFamily: FONTEM.mono, fontSize: 28, color: CORM.dim, opacity: janelaM(f, fimNivel, fimNivel + 4) }}>
            {`W ${Math.round(M.w)} · INTER 900`}
          </div>
        ) : null}
      </AbsoluteFill>
      <HUD tl="MOTION / 001" tr={`REC  ${timecodeM(c.global)}`} bl="ESCRITO EM CÓDIGO" br="30 FPS · 1920×1080" inicio={2} />
    </AbsoluteFill>
  );
};
