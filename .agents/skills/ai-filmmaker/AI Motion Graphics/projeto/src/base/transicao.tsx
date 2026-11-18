/* Base das transições. Toda apresentação recebe em passedProps as props dela + T e k. A janela tem T quadros; o corte (a batida) é o quadro k da janela.
   quadroDaJanela(progresso, T) devolve o quadro 0..T da janela (progresso linear).
   Camadas: a cena que ENTRA é renderizada por cima (vem depois no DOM); por isso o elemento que
   atravessa deve ser desenhado pelo lado 'entering', acima dos filhos. */
import React from 'react';
import { AbsoluteFill } from 'remotion';
import type { TransitionPresentationComponentProps } from '@remotion/transitions';

export type ComJanela<P> = P & { T: number; k: number };

export const quadroDaJanela = (progresso: number, T: number) => Math.round(progresso * T * 1000) / 1000;

/** Stub: corte seco no quadro k. A cena que sai some e a que entra aparece, sem sobreposição. */
export const CorteSimples = <P extends { T: number; k: number }>({ children, presentationDirection, presentationProgress, passedProps }: TransitionPresentationComponentProps<P>) => {
  const q = quadroDaJanela(presentationProgress, passedProps.T);
  const entrou = q >= passedProps.k;
  const visivel = presentationDirection === 'entering' ? entrou : !entrou;
  return <AbsoluteFill style={{ visibility: visivel ? 'visible' : 'hidden' }}>{children}</AbsoluteFill>;
};
