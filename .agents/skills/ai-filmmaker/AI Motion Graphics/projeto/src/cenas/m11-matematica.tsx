/* Cena 11 (35,96–40,82 s): "Texto, forma, posição, easing, partícula, tudo definido em matemática."
   Uma prancheta de design viva. Cada palavra dita é um rótulo que nasce colado na sua peça:
   "Texto," — MOTION cai letra a letra e ganha caixa de seleção com alças e leitura x/y/corpo;
   "forma," — um quadrado (girando) e um círculo (pulsando) estalam no lugar, com leituras;
   "posição," — cotas tracejadas saem dos eixos até o círculo, os números correm até 1540 / 400 e o
   círculo passa a orbitar com as leituras ao vivo; "easing," — o quadrado desliza com curva e um
   gráfico de easing com ponto correndo aparece embaixo dele; "partícula," — centenas de partículas
   estouram das letras e do círculo e ficam girando; "tudo definido em matemática." embaixo, e em
   "definido" as fórmulas de cada peça se digitam ao lado dela; em "matemática" a grade acende.
   O círculo volta ao repouso (C11.circulo) antes da saída: é ele que vira o fotograma da cena 12. */
import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import { useCenaM } from '../cena';
import { Fala } from '../Fala';
import { C11 } from '../layoutB';
import { BRILHO, clamp01, CORM, ease, type EstiloM, FONTEM, janelaM, lerp, mola, RGB, TIPOM, trecho } from '../tema';
import { FundoM, HUD, Poeira, timecodeM } from '../visual';
import { Fagulhas, Onda } from './pecas';
import { larguraTexto, posicoesLetras } from '../medir';

const ROTULO: EstiloM = { ...TIPOM.frase, tamanho: 66, peso: 800 };
const MOT: EstiloM = { ...TIPOM.gigante, tamanho: C11.motion.tamanho, tracking: -0.04, entrelinha: 1.1 };

const mono = (cor: string = CORM.verdeClaro, tam = 28): React.CSSProperties => ({ position: 'absolute', fontFamily: FONTEM.mono, fontSize: tam, color: cor, whiteSpace: 'pre' });

const Alcas: React.FC<{ x: number; y: number; w: number; h: number; p: number }> = ({ x, y, w, h, p }) => {
  if (p <= 0) return null;
  const per = 2 * (w + h);
  return (
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={CORM.verdeClaro} strokeWidth={2} strokeDasharray={`${(per * p).toFixed(0)} ${per}`} />
      {p > 0.9
        ? [
            [x, y],
            [x + w, y],
            [x, y + h],
            [x + w, y + h],
            [x + w / 2, y],
            [x + w / 2, y + h],
          ].map(([a, b], i) => <rect key={i} x={a - 7} y={b - 7} width={14} height={14} fill={CORM.fundo} stroke={CORM.verdeClaro} strokeWidth={2.5} />)
        : null}
    </svg>
  );
};

export const M11: React.FC = () => {
  const c = useCenaM();
  const f = c.frame;
  const fala = trecho(11, 0, 4);
  const fim = trecho(11, 5);
  const q = fala.map((p) => c.local(p.s) - 2);
  const [qTexto, qForma, qPos, qEasing, qPart] = q;
  const qDefinido = c.local(fim[1].s) - 2;
  const qMat = c.local(fim[3].s) - 2;
  const sai = Number.isFinite(c.saidaInicio) ? c.saidaInicio : c.seqDuracao;
  const repouso = janelaM(f, sai - 14, sai, 'suave');
  const vida = 1 - repouso;

  /* MOTION */
  const M = C11.motion;
  const letras = posicoesLetras('MOTION', MOT);
  const wM = larguraTexto('MOTION', MOT);
  const hM = MOT.tamanho * MOT.entrelinha;
  const selM = janelaM(f, qTexto + 10, qTexto + 18, 'sai');

  /* quadrado e círculo */
  const Q = C11.quadrado;
  const C = C11.circulo;
  const eq = mola(f, 'estalo', qForma);
  const ec = mola(f, 'estalo', qForma + 5);
  const ang = (f - qForma) * 2.2;
  const fasE = Math.max(0, f - qEasing);
  const desliza = f >= qEasing ? 190 * Math.sin(Math.PI * ease.suave(((fasE % 34) / 34))) * vida : 0;
  const qx = Q.x;
  const qy = Q.y + desliza;
  const orbita = f >= qPos + 10 ? vida * clamp01((f - qPos - 10) / 8) : 0;
  const cx = C.cx + Math.sin((f - qPos) / 7) * 40 * orbita;
  const cy = C.cy + Math.cos((f - qPos) / 9) * 22 * orbita;
  const pulso = 1 + 0.05 * Math.sin(f / 4) * vida;

  /* cotas */
  const cota = janelaM(f, qPos, qPos + 10, 'sai');
  const conta = janelaM(f, qPos, qPos + 12, 'suave');

  /* fórmulas e matemática */
  const formulas = [
    { t: 'y = 250 − 40·|sen(t/2)|', x: M.x, y: 600 },
    { t: 'θ(t) = 2,2·t', x: Q.x - 10, y: 252 },
    { t: 'x(t) = 1540 + 40·sen(t/7)', x: 1330, y: 640 },
  ];
  const acende = janelaM(f, qMat, qMat + 6) * (1 - janelaM(f, qMat + 10, qMat + 30));

  /* partículas */
  const nPart = 180;

  const z = 1 + 0.05 * ease.suave(clamp01(f / sai));
  const dx = Math.sin(f / 29) * 10 * vida;
  const dy = Math.cos(f / 35) * 7 * vida;
  // a câmera empurra em volta do círculo: ele fica parado na tela quando a deriva morre
  return (
    <AbsoluteFill>
      <FundoM brilho={[60, 42]} deriva={0.4} semente="m11" forcaGrade={1 + 1.6 * acende + 0.5 * janelaM(f, qMat, qMat + 8)} />
      <Poeira semente="m11" n={30} />
      <AbsoluteFill style={{ transformOrigin: `${C.cx}px ${C.cy}px`, transform: `translate(${dx}px, ${dy}px) scale(${z})` }}>
        {/* eixos de origem */}
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          <line x1={60} x2={60} y1={120} y2={1000} stroke={`rgba(${RGB.claro},.35)`} strokeWidth={2} />
          <line x1={60} x2={1860} y1={120} y2={120} stroke={`rgba(${RGB.claro},.35)`} strokeWidth={2} />
          {Array.from({ length: 10 }, (_, i) => (
            <line key={i} x1={60 + i * 200} x2={60 + i * 200} y1={112} y2={128} stroke={`rgba(${RGB.claro},.6)`} strokeWidth={2} />
          ))}
          {cota > 0 ? (
            <>
              <line x1={60} y1={cy} x2={lerp(60, cx, cota)} y2={cy} stroke={CORM.verdeClaro} strokeWidth={2.5} strokeDasharray="10 8" />
              <line x1={cx} y1={120} x2={cx} y2={lerp(120, cy, cota)} stroke={CORM.verdeClaro} strokeWidth={2.5} strokeDasharray="10 8" />
              <circle cx={60} cy={cy} r={6} fill={CORM.verde} />
              <circle cx={cx} cy={120} r={6} fill={CORM.verde} />
            </>
          ) : null}
        </svg>
        {cota > 0 ? (
          <>
            <div style={{ ...mono(CORM.verdeClaro, 30), left: 90, top: cy - 44 }}>{`x ${String(Math.round(lerp(0, cx, conta))).padStart(4, '0')}`}</div>
            <div style={{ ...mono(CORM.verdeClaro, 30), left: cx + 14, top: 136 }}>{`y ${String(Math.round(lerp(0, cy, conta))).padStart(4, '0')}`}</div>
          </>
        ) : null}

        {/* MOTION */}
        {letras.map((l, i) => {
          const qi = qTexto + i * 2;
          if (f < qi) return null;
          const m = mola(f, 'estalo', qi);
          const onda = Math.sin((f - qTexto) / 5 + i * 0.8) * 6 * vida;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: M.x + l.x,
                top: M.y + onda,
                height: hM,
                lineHeight: `${hM}px`,
                fontFamily: MOT.familia,
                fontWeight: 900,
                fontSize: MOT.tamanho,
                letterSpacing: `${MOT.tracking}em`,
                color: CORM.papel,
                textShadow: BRILHO.branco,
                opacity: clamp01((f - qi) / 2),
                transform: `translateY(${(1 - m) * -120}px) scale(${1 + 0.4 * (1 - m)})`,
                transformOrigin: '50% 80%',
                filter: f - qi < 3 ? `blur(${(1 - (f - qi) / 3) * 10}px)` : undefined,
              }}
            >
              {l.ch}
            </div>
          );
        })}
        <Alcas x={M.x - 14} y={M.y + 8} w={wM + 28} h={hM - 16} p={selM} />
        {selM > 0 ? <div style={{ ...mono(), left: M.x, top: M.y + hM + 2, opacity: selM }}>{`x 140  y 250  corpo ${Math.round(lerp(0, 210, selM))}`}</div> : null}

        {/* quadrado */}
        {eq > 0 ? (
          <>
            <div style={{ position: 'absolute', left: qx, top: qy, width: Q.lado, height: Q.lado, border: `5px solid ${CORM.verdeClaro}`, background: `rgba(${RGB.acento},.16)`, boxShadow: `0 0 30px rgba(${RGB.acento},.45), inset 0 0 30px rgba(${RGB.acento},.3)`, transform: `rotate(${ang}deg) scale(${eq})`, boxSizing: 'border-box' }} />
            {[0.12, 0.06].map((op, i) =>
              f >= qEasing ? <div key={i} style={{ position: 'absolute', left: Q.x, top: Q.y + 190 * Math.sin(Math.PI * ease.suave(clamp01(((fasE - (i + 1) * 2) % 34) / 34))) * vida, width: Q.lado, height: Q.lado, border: `5px solid ${CORM.verdeClaro}`, opacity: op, transform: `rotate(${ang - (i + 1) * 4}deg)`, boxSizing: 'border-box' }} /> : null,
            )}
            <div style={{ ...mono(), left: qx, top: qy + Q.lado + 14, opacity: eq }}>{`w 170  θ ${String(Math.round(((ang % 360) + 360) % 360)).padStart(3, '0')}°`}</div>
          </>
        ) : null}

        {/* círculo */}
        {ec > 0 ? (
          <>
            <div style={{ position: 'absolute', left: cx - C.r * ec * pulso, top: cy - C.r * ec * pulso, width: 2 * C.r * ec * pulso, height: 2 * C.r * ec * pulso, borderRadius: '50%', border: `5px solid ${CORM.verde}`, background: `radial-gradient(circle, rgba(${RGB.acento},.38), rgba(${RGB.acento},.04) 70%)`, boxShadow: `0 0 50px rgba(${RGB.acento},.7), inset 0 0 40px rgba(${RGB.acento},.35)`, boxSizing: 'border-box' }} />
            <div style={{ position: 'absolute', left: cx - 6, top: cy - 6, width: 12, height: 12, borderRadius: 6, background: '#fff', boxShadow: BRILHO.verde }} />
            <div style={{ ...mono(), left: cx + C.r + 16, top: cy - 16, opacity: ec }}>r 130</div>
          </>
        ) : null}
        <Onda f={f} q0={qForma + 5} x={C.cx} y={C.cy} r0={60} r1={320} dur={16} />

        {/* gráfico de easing */}
        {f >= qEasing ? (
          (() => {
            const e = mola(f, 'estalo', qEasing);
            const gx = 880;
            const gy = 540;
            const W = 230;
            const H = 150;
            const u = clamp01(((fasE % 34) / 34) * 2);
            const k = ease.suave(u);
            return (
              <div style={{ position: 'absolute', left: gx, top: gy, width: W + 40, height: H + 40, opacity: clamp01(e * 2), transform: `scale(${0.7 + 0.3 * e})`, transformOrigin: '0 0' }}>
                <svg width={W + 40} height={H + 40} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
                  <rect x={0} y={0} width={W + 40} height={H + 40} rx={12} fill="rgba(10,28,17,.85)" stroke={CORM.linhaForte} strokeWidth={2} />
                  <path d={`M20 ${H + 20} C ${20 + 0.45 * W} ${H + 20}, ${20 + 0.55 * W} 20, ${20 + W} 20`} fill="none" stroke={CORM.verde} strokeWidth={4} style={{ filter: `drop-shadow(0 0 6px rgba(${RGB.acento},.9))` }} />
                  <circle cx={20 + u * W} cy={H + 20 - k * H} r={9} fill="#fff" style={{ filter: `drop-shadow(0 0 8px rgba(${RGB.claro},1))` }} />
                </svg>
              </div>
            );
          })()
        ) : null}

        {/* partículas */}
        {f >= qPart
          ? Array.from({ length: nPart }, (_, i) => {
              const r = (k: string) => random(`m11-p-${k}-${i}`);
              const doCirculo = i % 2 === 0;
              const l = letras[i % letras.length];
              const ox = doCirculo ? C.cx : M.x + l.x + l.w / 2;
              const oy = doCirculo ? C.cy : M.y + hM * 0.55;
              const t = f - qPart - r('q') * 4;
              if (t < 0) return null;
              const a = r('a') * Math.PI * 2 + t * (0.01 + 0.02 * r('w'));
              const dist = ease.sai(clamp01(t / 22)) * (90 + r('d') * 330);
              const tam = 3 + r('s') * 6;
              const pisca = 0.6 + 0.4 * Math.sin(f / (3 + r('f') * 4) + i);
              return <div key={i} style={{ position: 'absolute', left: ox + Math.cos(a) * dist, top: oy + Math.sin(a) * dist * 0.6 - t * 0.6 * r('v'), width: tam, height: tam, borderRadius: '50%', background: i % 5 === 0 ? '#fff' : CORM.verdeClaro, opacity: pisca * (1 - 0.5 * clamp01(t / 60)), boxShadow: `0 0 8px rgba(${RGB.acento},.9)` }} />;
            })
          : null}
        <Fagulhas f={f} q0={qPart} x={C.cx} y={C.cy} semente="m11-pc" raio={360} n={24} />

        {/* fórmulas */}
        {formulas.map((fm, i) => {
          const t0 = qDefinido + i * 3;
          if (f < t0) return null;
          const n = Math.min(fm.t.length, Math.floor((f - t0) * 2.4));
          return (
            <div key={i} style={{ ...mono(acende > 0.1 ? '#E8FFF0' : CORM.verde, 30), left: fm.x, top: fm.y, textShadow: acende > 0.1 ? BRILHO.verde : BRILHO.verdeLeve, padding: '4px 12px', borderRadius: 8, background: 'rgba(3,7,5,.75)', border: `1px solid ${CORM.linhaForte}` }}>
              {fm.t.slice(0, n)}
            </div>
          );
        })}

        {/* rótulos = a fala */}
        <Fala palavras={fala.slice(0, 1)} x={M.x} y={150} estilo={ROTULO} destaque={[0]} />
        <Fala palavras={fala.slice(1, 2)} x={Q.x} y={150} estilo={ROTULO} destaque={[0]} />
        <Fala palavras={fala.slice(2, 3)} x={1420} y={566} estilo={ROTULO} destaque={[0]} />
        <Fala palavras={fala.slice(3, 4)} x={880} y={740} estilo={{ ...ROTULO, tamanho: 56 }} destaque={[0]} />
        <Fala palavras={fala.slice(4, 5)} x={M.x} y={660} estilo={ROTULO} destaque={[0]} />
      </AbsoluteFill>
      <Fala palavras={fim} x={960} y={846} alinhar="centro" estilo={{ ...TIPOM.frase, tamanho: 108 }} destaque={['matemática']} pesoDestaque={900} />
      <HUD tl="MOTION / 011" tr={`REC  ${timecodeM(c.global)}`} bl="ORIGEM · 0, 0" br={`PEÇAS · ${[qTexto, qForma, qForma + 5, qPart].filter((x) => f >= x).length + (f >= qPart ? nPart - 1 : 0)}`} inicio={6} />
    </AbsoluteFill>
  );
};
