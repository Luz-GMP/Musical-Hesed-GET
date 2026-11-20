/* As caixas despencam (cena 13 → 14). T 14, k 6.
   `caixas` são os retângulos na tela no início da janela (C13.caixasTela()). A cena que sai é
   desenhada 1 + 2·N vezes: o fundo (recortado SEM as caixas, por path evenodd), que escurece e
   afunda; e cada caixa recortada dela mesma, que se solta (tranco de 2 quadros), gira e cai com
   gravidade, da esquerda para a direita, com um fantasma de rastro atrás. Uma poeira de luz
   branca sobe de onde cada caixa estava. A cena que entra sobe por baixo (opacidade + leve
   descida, 1,04 → 1) a partir do quadro 3 e está inteira em k + 4. Atravessa: as caixas. */
import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import type { TransitionPresentation, TransitionPresentationComponentProps } from '@remotion/transitions';
import { quadroDaJanela, type ComJanela } from '../base/transicao';
import { clamp01, ease } from '../tema';

type Ret = { x: number; y: number; w: number; h: number; r: number };
export type PropsDespenca = ComJanela<{ caixas: Ret[]; semente?: string }>;

const MARGEM = 16;
const G = 13; // px/q²

const posCaixa = (q: number, i: number, sem: string) => {
  const atraso = i * 0.9;
  const t = Math.max(0, q - atraso);
  const solta = clamp01(t / 2);
  const tc = Math.max(0, t - 1.5);
  const dir = random(`${sem}-d-${i}`) < 0.5 ? -1 : 1;
  const y = -10 * Math.sin(Math.PI * solta) * (t < 2 ? 1 : 0) + 0.5 * G * tc * tc;
  const x = dir * (4 + random(`${sem}-x-${i}`) * 9) * tc;
  const rot = dir * (2 * solta + (10 + random(`${sem}-r-${i}`) * 16) * ease.entra(clamp01(tc / 10)));
  return { x, y, rot };
};

export const DespencaApresentacao: React.FC<TransitionPresentationComponentProps<PropsDespenca>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps: p,
}) => {
  const q = quadroDaJanela(presentationProgress, p.T);
  const sem = p.semente ?? 'despenca';
  if (presentationDirection === 'exiting') {
    if (q >= p.T) return <AbsoluteFill style={{ visibility: 'hidden' }}>{children}</AbsoluteFill>;
    const furos = p.caixas
      .map((b) => {
        const x = b.x - MARGEM;
        const y = b.y - MARGEM;
        const w = b.w + 2 * MARGEM;
        const h = b.h + 2 * MARGEM;
        return `M ${x} ${y} H ${x + w} V ${y + h} H ${x} Z`;
      })
      .join(' ');
    const fundo = `path(evenodd, 'M -10 -10 H 1930 V 1090 H -10 Z ${furos}')`;
    const afunda = ease.entra(clamp01(q / p.k));
    return (
      <AbsoluteFill>
        <AbsoluteFill style={{ clipPath: fundo, filter: `brightness(${1 - 0.7 * afunda})`, transform: `translateY(${30 * afunda}px)` }}>{children}</AbsoluteFill>
        {p.caixas.map((b, i) => {
          const clip = `inset(${b.y - MARGEM}px ${1920 - b.x - b.w - MARGEM}px ${1080 - b.y - b.h - MARGEM}px ${b.x - MARGEM}px round ${b.r + 4}px)`;
          const cx = b.x + b.w / 2;
          const cy = b.y + b.h / 2;
          const a = posCaixa(q, i, sem);
          const ant = posCaixa(q - 1.2, i, sem);
          const vel = a.y - ant.y;
          const camada = (k: { x: number; y: number; rot: number }, op: number, key: string) => (
            <AbsoluteFill key={key} style={{ transformOrigin: `${cx}px ${cy}px`, transform: `translate(${k.x}px, ${k.y}px) rotate(${k.rot}deg)`, opacity: op }}>
              <AbsoluteFill style={{ clipPath: clip }}>{children}</AbsoluteFill>
            </AbsoluteFill>
          );
          return (
            <React.Fragment key={i}>
              {vel > 18 ? camada(ant, 0.3, 'g') : null}
              {camada(a, 1, 'c')}
            </React.Fragment>
          );
        })}
      </AbsoluteFill>
    );
  }
  if (q >= p.T) return <AbsoluteFill>{children}</AbsoluteFill>;
  const e = ease.sai(clamp01((q - 4) / (p.k + 1)));
  return (
    <>
      <AbsoluteFill style={{ opacity: e, transform: `translateY(${-24 * (1 - e)}px) scale(${1.04 - 0.04 * e})` }}>{children}</AbsoluteFill>
      {/* poeira de luz subindo de onde as caixas estavam */}
      {q < p.T
        ? p.caixas.flatMap((b, i) =>
            Array.from({ length: 10 }, (_, j) => {
              const d = q - i * 0.9 - 1;
              if (d < 0) return null;
              const r = (k: string) => random(`${sem}-p-${k}-${i}-${j}`);
              const x = b.x + r('x') * b.w;
              const y = b.y + b.h * (0.3 + 0.6 * r('y')) - d * (3 + r('v') * 5);
              const op = (1 - d / 12) * 0.9;
              if (op <= 0) return null;
              return <div key={`${i}-${j}`} style={{ position: 'absolute', left: x, top: y, width: 4, height: 4, borderRadius: 2, background: '#F1F0E8', opacity: op, boxShadow: '0 0 8px rgba(255,255,255,.7)' }} />;
            }),
          )
        : null}
    </>
  );
};

export const despenca = (props: PropsDespenca): TransitionPresentation<PropsDespenca> => ({ component: DespencaApresentacao, props });
