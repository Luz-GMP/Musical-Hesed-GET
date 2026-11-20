/* A película gira e vira o fluxograma (cena 12 → 13). T 10, k 5.
   O giro acontece DENTRO da cena 12 (m12-quadro.tsx): no último "quadro" a película dá uma volta no
   plano, encolhe e volta, e os cinco fotogramas centrais assentam nas cinco caixas cinza do
   fluxograma (layoutB.ts → FLUXO_13), parados, dois quadros antes desta janela começar.
   Esta transição é o CORTE CASADO: até o quadro k só a cena 12; no k a cena 13 (que abre com as
   mesmas caixas, C13.caixas, e a câmera em repouso) entra em corte seco, e um brilho varre as caixas
   da esquerda para a direita. (Passe final, 07/10: era uma fusão de 5 quadros enquanto a câmera da 13
   abria deslocada; a 13 agora acorda a câmera só depois do corte, então o corte casa.) */
import React from 'react';
import { AbsoluteFill } from 'remotion';
import type { TransitionPresentation, TransitionPresentationComponentProps } from '@remotion/transitions';
import { quadroDaJanela, type ComJanela } from '../base/transicao';
import { FLUXO_13 } from '../layoutB';
import { clamp01, ease, lerp } from '../tema';

export type PropsPeliculaGira = ComJanela<object>;

export const PeliculaGiraApresentacao: React.FC<TransitionPresentationComponentProps<PropsPeliculaGira>> = ({ children, presentationDirection, presentationProgress, passedProps: p }) => {
  const q = quadroDaJanela(presentationProgress, p.T);
  const entrou = q >= p.k;
  if (presentationDirection === 'exiting') return <AbsoluteFill style={{ visibility: q >= p.T ? 'hidden' : 'visible' }}>{children}</AbsoluteFill>;
  if (q >= p.T) return <AbsoluteFill>{children}</AbsoluteFill>;
  const u = ease.suave(clamp01((q - p.k + 1) / (p.T - p.k)));
  const c0 = FLUXO_13.caixas[0];
  const c4 = FLUXO_13.caixas[4];
  const x = lerp(c0.x - 200, c4.x + c4.w + 60, u);
  return (
    <>
      <AbsoluteFill style={{ visibility: entrou ? 'visible' : 'hidden' }}>{children}</AbsoluteFill>
      {entrou ? (
        <AbsoluteFill style={{ pointerEvents: 'none', clipPath: `inset(${c0.y - 4}px 0 ${1080 - c0.y - c0.h - 4}px 0)` }}>
          <div style={{ position: 'absolute', left: x - 70, top: c0.y - 10, width: 140, height: c0.h + 20, background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.35), rgba(255,255,255,0))', transform: 'skewX(-18deg)', mixBlendMode: 'screen' }} />
        </AbsoluteFill>
      ) : null}
    </>
  );
};

export const peliculaGira = (props: PropsPeliculaGira): TransitionPresentation<PropsPeliculaGira> => ({ component: PeliculaGiraApresentacao, props });
