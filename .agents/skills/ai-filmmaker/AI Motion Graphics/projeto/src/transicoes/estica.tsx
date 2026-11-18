/* A barra estica e vira a cena (cena 5 → 6). T 14, k 8.
   `de` é a barra de prompt da cena 5 no início da janela. q0-1 a barra acende (a cena que entra surge dentro dela em 3 quadros); q1-6: a barra estica na horizontal até
   passar das bordas (mola sem sobra) e o raio cai; q3-k: estica na vertical até cobrir a tela. A cena
   que entra aparece só dentro da barra (recorte) e a que sai recua (escala 1 → 0,92, escurece).
   A borda da barra é um filete verde com brilho que some depois do corte. Atravessa: a barra. */
import React from 'react';
import { AbsoluteFill } from 'remotion';
import type { TransitionPresentation, TransitionPresentationComponentProps } from '@remotion/transitions';
import { quadroDaJanela, type ComJanela } from '../base/transicao';
import { clamp01, ease, lerp, PALETA, RGB } from '../tema';

export type RetM = { x: number; y: number; w: number; h: number; r: number };
export type PropsEstica = ComJanela<{ de: RetM }>;

export const EsticaApresentacao: React.FC<TransitionPresentationComponentProps<PropsEstica>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps: p,
}) => {
  const q = quadroDaJanela(presentationProgress, p.T);
  const a = ease.corte(clamp01((q - 1) / 5));
  const b = ease.corte(clamp01((q - 3) / (p.k - 3)));
  if (presentationDirection === 'exiting') {
    if (q >= p.k) return <AbsoluteFill style={{ visibility: 'hidden' }}>{children}</AbsoluteFill>;
    return <AbsoluteFill style={{ transform: `scale(${1 - 0.08 * b})`, filter: `brightness(${1 - 0.5 * b})` }}>{children}</AbsoluteFill>;
  }
  if (q >= p.T) return <AbsoluteFill>{children}</AbsoluteFill>;
  const cx = p.de.x + p.de.w / 2;
  const cy = p.de.y + p.de.h / 2;
  const w = lerp(p.de.w, 2000, a);
  const h = lerp(p.de.h, 1120, b);
  const xc = lerp(cx, 960, a);
  const yc = lerp(cy, 540, b);
  const raio = lerp(p.de.r, 0, Math.max(a * 0.6, b));
  const x = xc - w / 2;
  const y = yc - h / 2;
  const borda = 1 - clamp01((q - p.k) / (p.T - p.k));
  const clip = `inset(${y.toFixed(1)}px ${(1920 - x - w).toFixed(1)}px ${(1080 - y - h).toFixed(1)}px ${x.toFixed(1)}px round ${raio.toFixed(1)}px)`;
  return (
    <>
      <AbsoluteFill style={{ clipPath: clip, opacity: clamp01((q - 1) / 3) }}>{children}</AbsoluteFill>
      {borda > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: x,
            top: y,
            width: w,
            height: h,
            borderRadius: raio,
            border: `3px solid ${PALETA.acentoClaro}`,
            boxShadow: `0 0 30px rgba(${RGB.acento},.8), inset 0 0 30px rgba(${RGB.acento},.45)`,
            opacity: borda,
            pointerEvents: 'none',
          }}
        />
      ) : null}
    </>
  );
};

export const estica = (props: PropsEstica): TransitionPresentation<PropsEstica> => ({ component: EsticaApresentacao, props });
