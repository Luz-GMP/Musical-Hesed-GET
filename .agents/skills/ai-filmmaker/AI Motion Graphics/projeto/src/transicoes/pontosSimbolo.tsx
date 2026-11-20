/* Os keyframes despencam e se juntam no símbolo da skill (cena 16 → 17). T 26, k 13.
   `de`: os keyframes na tela no início da janela (keyframesTela16()); a cena 16 para de desenhá-los
   nesse quadro, então a troca é invisível. `alvos`: pontos ao longo dos traços do símbolo
   (pontosDoSimbolo em SIMBOLO17).
   q0-12   cada losango despenca com gravidade (atraso pelo sorteio, giro crescente) e quica no chão
           (uma linha de luz no pé da tela acende no impacto). É a risada.
   q11-22  sobem em enxame, cada um numa curva com desvio lateral (curva corte, atraso 0-3), com
           rastro, e pousam nos traços do símbolo; ao pousar viram ponto de luz quente.
   q20-26  encolhem sobre o símbolo, que a cena 17 desenha e acende ali (clarão no q21 local).
   A cena 16 continua por baixo até k; a 17 sobe por cima (opacidade q10-16). Atravessa: os pontos. */
import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import type { TransitionPresentation, TransitionPresentationComponentProps } from '@remotion/transitions';
import { quadroDaJanela, type ComJanela } from '../base/transicao';
import { clamp01, ease, lerp, PALETA, RGB } from '../tema';

type XY = [number, number];
export type PropsPontosSimbolo = ComJanela<{ de: { x: number; y: number; tam: number; claro: boolean }[]; alvos: XY[]; semente?: string }>;

const G = 16;
const CHAO = 1046;

type Estado = { x: number; y: number; rot: number; s: number; quente: number };

const estado = (q: number, i: number, p: PropsPontosSimbolo): Estado => {
  const sem = p.semente ?? 'ps';
  const r = (k: string) => random(`${sem}-${k}-${i}`);
  const o = p.de[i];
  const alvo = p.alvos[Math.floor((i * p.alvos.length) / p.de.length) % p.alvos.length];
  // queda
  const atraso = r('d') * 3;
  const chao = CHAO - r('c') * 34;
  const yQueda = (t: number) => {
    const tt = Math.max(0, t - atraso);
    const y = o.y + 0.5 * G * tt * tt;
    if (y <= chao) return y;
    const th = Math.sqrt((2 * (chao - o.y)) / G) + atraso;
    const u = t - th;
    return chao - 26 * Math.exp(-u / 2.2) * Math.abs(Math.sin(u * 1.1));
  };
  const xQueda = (t: number) => o.x + (r('vx') - 0.5) * 3 * Math.max(0, t - atraso);
  const qSobe = 11 + r('s') * 3;
  const dur = 9;
  const u = ease.corte(clamp01((q - qSobe) / dur));
  const x0 = xQueda(qSobe);
  const y0 = yQueda(qSobe);
  if (q < qSobe) {
    return { x: xQueda(q), y: yQueda(q), rot: 45 + (r('r') - 0.5) * 40 * Math.max(0, q - atraso), s: o.tam, quente: 0 };
  }
  const mx = (x0 + alvo[0]) / 2 + (r('lx') - 0.5) * 700;
  const my = Math.min(y0, alvo[1]) - 120 - r('ly') * 260;
  const a = 1 - u;
  const x = a * a * x0 + 2 * a * u * mx + u * u * alvo[0];
  const y = a * a * y0 + 2 * a * u * my + u * u * alvo[1];
  const encolhe = 1 - clamp01((q - (qSobe + dur)) / 5);
  return { x, y, rot: 45 + 360 * u, s: lerp(o.tam, 4.5, u) * encolhe, quente: clamp01((u - 0.7) / 0.3) };
};

export const PontosSimboloApresentacao: React.FC<TransitionPresentationComponentProps<PropsPontosSimbolo>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps: p,
}) => {
  const q = quadroDaJanela(presentationProgress, p.T);
  if (presentationDirection === 'exiting') {
    if (q >= p.k) return <AbsoluteFill style={{ visibility: 'hidden' }}>{children}</AbsoluteFill>;
    return <AbsoluteFill style={{ filter: `brightness(${1 - 0.4 * clamp01((q - 6) / (p.k - 6))})` }}>{children}</AbsoluteFill>;
  }
  if (q >= p.T) return <AbsoluteFill>{children}</AbsoluteFill>;
  const entra = ease.sai(clamp01((q - 10) / 6));
  const impacto = clamp01(1 - Math.abs(q - 8.5) / 4);
  const pts = p.de.map((_, i) => ({ a: estado(q, i, p), b: estado(q - 1, i, p) }));
  return (
    <>
      <AbsoluteFill style={{ opacity: entra }}>{children}</AbsoluteFill>
      {impacto > 0 ? (
        <div style={{ position: 'absolute', left: 0, right: 0, top: CHAO - 4, height: 8, background: `linear-gradient(90deg, rgba(${RGB.acento},0), rgba(${RGB.claro},.9), rgba(${RGB.acento},0))`, opacity: impacto, boxShadow: `0 0 40px rgba(${RGB.acento},.8)` }} />
      ) : null}
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        {pts.map(({ a, b }, i) => {
          const vel = Math.hypot(a.x - b.x, a.y - b.y);
          return vel > 14 && a.s > 0.5 ? <line key={`r${i}`} x1={b.x} y1={b.y} x2={a.x} y2={a.y} stroke={PALETA.acentoClaro} strokeWidth={Math.max(1.5, a.s * 0.5)} strokeOpacity={0.35} strokeLinecap="round" /> : null;
        })}
        {pts.map(({ a }, i) => {
          if (a.s <= 0.3) return null;
          const s = a.s;
          const r = (a.rot * Math.PI) / 180;
          const c = Math.cos(r) * s;
          const d = Math.sin(r) * s;
          const pts4 = `${a.x + c},${a.y + d} ${a.x - d},${a.y + c} ${a.x - c},${a.y - d} ${a.x + d},${a.y - c}`;
          const cor = a.quente > 0 ? '#F4FFF7' : p.de[i].claro ? '#F4FFF7' : PALETA.acento;
          return <polygon key={i} points={pts4} fill={cor} stroke={PALETA.acentoClaro} strokeWidth={1.5} style={a.quente > 0.3 ? { filter: `drop-shadow(0 0 6px rgba(${RGB.claro},1))` } : undefined} />;
        })}
      </svg>
    </>
  );
};

export const pontosSimbolo = (props: PropsPontosSimbolo): TransitionPresentation<PropsPontosSimbolo> => ({ component: PontosSimboloApresentacao, props });
