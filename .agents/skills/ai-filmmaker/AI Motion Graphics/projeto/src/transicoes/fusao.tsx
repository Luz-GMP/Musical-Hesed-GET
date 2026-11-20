/* fusao: fusão com desfoque. T 10, k 5. A que sai desfoca e apaga; a que entra sai do desfoque.
   A transição mais discreta: use entre duas cenas que já têm muito movimento próprio. */
import React from 'react';
import { AbsoluteFill } from 'remotion';
import type { TransitionPresentation, TransitionPresentationComponentProps } from '@remotion/transitions';
import { quadroDaJanela, type ComJanela } from '../base/transicao';
import { clamp01, ease } from '../tema';

export type PropsFusao = ComJanela<object>;

export const FusaoApresentacao: React.FC<TransitionPresentationComponentProps<PropsFusao>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps: p,
}) => {
  const q = quadroDaJanela(presentationProgress, p.T);
  if (presentationDirection === 'exiting') {
    const t = ease.entra(clamp01(q / p.k));
    if (t <= 0) return <AbsoluteFill>{children}</AbsoluteFill>;
    return <AbsoluteFill style={{ opacity: 1 - t, filter: `blur(${(t * 14).toFixed(1)}px)` }}>{children}</AbsoluteFill>;
  }
  if (q >= p.T) return <AbsoluteFill>{children}</AbsoluteFill>;
  const t = ease.sai(clamp01((q - p.k + 3) / (p.T - p.k + 3)));
  return <AbsoluteFill style={{ opacity: t, filter: t < 1 ? `blur(${((1 - t) * 14).toFixed(1)}px)` : undefined }}>{children}</AbsoluteFill>;
};

export const fusao = (props: PropsFusao): TransitionPresentation<PropsFusao> => ({ component: FusaoApresentacao, props });
