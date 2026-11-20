/* Corte seco na batida (cena 15 → 16). T 6, k 2.
   Nada de fusão: q0-1 a cena que sai dá um puxão para dentro (escala 1 → 1,035, leve subida);
   no quadro k a outra cena entra de uma vez, com um soco de câmera (escala 1,14 → 1 em mola curta),
   sobre-exposição que assenta (brilho 1,5 → 1) e um tranco vertical que morre em 4 quadros.
   Duas réguas de luz brancas cruzam a tela no quadro do corte (a "batida" vista). */
import React from 'react';
import { AbsoluteFill } from 'remotion';
import type { TransitionPresentation, TransitionPresentationComponentProps } from '@remotion/transitions';
import { quadroDaJanela, type ComJanela } from '../base/transicao';
import { clamp01, ease } from '../tema';

export type PropsCorteBatida = ComJanela<{ tranco?: number }>;

export const CorteBatidaApresentacao: React.FC<TransitionPresentationComponentProps<PropsCorteBatida>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps: p,
}) => {
  const q = quadroDaJanela(presentationProgress, p.T);
  if (presentationDirection === 'exiting') {
    if (q >= p.k) return <AbsoluteFill style={{ visibility: 'hidden' }}>{children}</AbsoluteFill>;
    const m = ease.entra(clamp01((q + 1) / (p.k + 1)));
    return <AbsoluteFill style={{ transform: `scale(${1 + 0.035 * m}) translateY(${-10 * m}px)` }}>{children}</AbsoluteFill>;
  }
  if (q < p.k) return <AbsoluteFill style={{ visibility: 'hidden' }}>{children}</AbsoluteFill>;
  if (q >= p.T) return <AbsoluteFill>{children}</AbsoluteFill>;
  const d = clamp01((q - p.k) / (p.T - p.k));
  const s = ease.sai(d);
  const tranco = (q - p.k) < 3 ? (q - p.k === 0 ? 16 : q - p.k === 1 ? -9 : 4) : 0;
  return (
    <>
      <AbsoluteFill style={{ transform: `translateY(${tranco}px) scale(${1.14 - 0.14 * s})`, filter: `brightness(${1.5 - 0.5 * s})` }}>{children}</AbsoluteFill>
      {q - p.k < 2 ? (
        <>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 300, height: 3, background: '#FFFFFF', opacity: 0.8 * (1 - (q - p.k) / 2), boxShadow: '0 0 20px rgba(255,255,255,.9)' }} />
          <div style={{ position: 'absolute', left: 0, right: 0, top: 780, height: 3, background: '#FFFFFF', opacity: 0.8 * (1 - (q - p.k) / 2), boxShadow: '0 0 20px rgba(255,255,255,.9)' }} />
        </>
      ) : null}
    </>
  );
};

export const corteBatida = (props: PropsCorteBatida): TransitionPresentation<PropsCorteBatida> => ({ component: CorteBatidaApresentacao, props });
