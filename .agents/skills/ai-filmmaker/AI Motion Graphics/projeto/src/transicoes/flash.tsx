/* Flash de um quadro (cena 3 → 4). T 6, k 2.
   q0: a cena que sai estoura (brilho 1 → 1,8). q1: UM quadro chapado de luz (#EFFFF4, com núcleo
   verde no centro). q2 (o corte, início da fala): a cena que entra aparece superexposta e desce ao
   normal em 4 quadros, com um leve recuo de escala 1,05 → 1. */
import React from 'react';
import { AbsoluteFill } from 'remotion';
import type { TransitionPresentation, TransitionPresentationComponentProps } from '@remotion/transitions';
import { quadroDaJanela, type ComJanela } from '../base/transicao';
import { clamp01, ease, RGB } from '../tema';

export type PropsFlash = ComJanela<{ cor?: string }>;

export const FlashApresentacao: React.FC<TransitionPresentationComponentProps<PropsFlash>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps: p,
}) => {
  const q = Math.floor(quadroDaJanela(presentationProgress, p.T) + 1e-6);
  const qFlash = p.k - 1;
  if (presentationDirection === 'exiting') {
    if (q >= qFlash) return <AbsoluteFill style={{ visibility: 'hidden' }}>{children}</AbsoluteFill>;
    return <AbsoluteFill style={{ filter: q === qFlash - 1 ? 'brightness(1.8)' : undefined }}>{children}</AbsoluteFill>;
  }
  if (q >= p.T) return <AbsoluteFill>{children}</AbsoluteFill>;
  if (q < qFlash) return <AbsoluteFill style={{ visibility: 'hidden' }}>{children}</AbsoluteFill>;
  if (q === qFlash) {
    return (
      <AbsoluteFill style={{ background: p.cor ?? '#EFFFF4' }}>
        <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 50%, rgba(${RGB.acento},.35), rgba(${RGB.acento},0) 60%)` }} />
      </AbsoluteFill>
    );
  }
  const d = ease.sai(clamp01((q - p.k) / (p.T - p.k)));
  return <AbsoluteFill style={{ filter: `brightness(${(2.2 - 1.2 * d).toFixed(3)})`, transform: `scale(${1.05 - 0.05 * d})` }}>{children}</AbsoluteFill>;
};

export const flash = (props: PropsFlash): TransitionPresentation<PropsFlash> => ({ component: FlashApresentacao, props });
