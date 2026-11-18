/* pontoAbre: íris dupla a partir de um ponto. T 14, k 8.
   q0-8: disco do acento cresce de 8 px até R (canto mais longe + 20), curva saida, com rastro de
   desfoque na borda (duas coroas translúcidas, sem filtro). q3-14: dentro dele a cena que entra abre
   em círculo a partir da origem, curva saida, com anel de 3 px de luz na borda. Entre os dois
   círculos fica a coroa do acento por ~6 quadros: é o que faz a íris ler até preto sobre preto.
   Use quando a cena que sai termina num ponto (botão, nó, ponto pulsando): passe a origem nele. */
import React from 'react';
import { AbsoluteFill } from 'remotion';
import type { TransitionPresentation, TransitionPresentationComponentProps } from '@remotion/transitions';
import { quadroDaJanela, type ComJanela } from '../base/transicao';
import { clamp01, curvas, lerp } from '../base/curvas';
import { RGB } from '../tema';
import { COR, resolverXY, type PropsPontoAbre } from './base-transicoes';
import { AnelLuz, cantoMaisLonge } from './flood';

export type PropsPontoAbreT = ComJanela<PropsPontoAbre>;

const VERDE = RGB.acento;

export const PontoAbreApresentacao: React.FC<TransitionPresentationComponentProps<PropsPontoAbreT>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps: p,
}) => {
  const q = quadroDaJanela(presentationProgress, p.T);
  if (presentationDirection === 'exiting') return <AbsoluteFill>{children}</AbsoluteFill>;
  const [ox, oy] = resolverXY(p.origem);
  const R = cantoMaisLonge(ox, oy) + 20;
  const disco = (qq: number) => lerp(4, R, curvas.saida(clamp01(qq / p.k)));
  const rd = disco(q);
  const vd = rd - disco(q - 1);
  const abre = (qq: number) => R * curvas.saida(clamp01((qq - 3) / (p.T - 3)));
  const ra = abre(q);
  // rastro do disco: a borda se esfuma para fora na direção do crescimento (de .35 a 0, sem filtro)
  const rastro = Math.min(140, Math.max(0, vd) * 0.35);
  const discoFundo =
    rastro > 6 && rd < R
      ? `radial-gradient(circle at ${ox}px ${oy}px, ${COR.verde} ${rd.toFixed(1)}px, rgba(${VERDE},.35) ${rd.toFixed(1)}px, rgba(${VERDE},0) ${(rd + rastro).toFixed(1)}px)`
      : `radial-gradient(circle at ${ox}px ${oy}px, ${COR.verde} ${rd.toFixed(1)}px, transparent ${(rd + 0.8).toFixed(1)}px)`;
  const aberto = ra >= R - 0.5;
  // o anel se apaga nos últimos quadros, quando a borda já está fora da tela
  const anel = 1 - clamp01((q - (p.T - 3)) / 3);
  return (
    <>
      {aberto ? null : <AbsoluteFill style={{ background: discoFundo }} />}
      <AbsoluteFill style={{ clipPath: aberto ? undefined : `circle(${ra.toFixed(1)}px at ${ox}px ${oy}px)`, visibility: ra <= 0.5 ? 'hidden' : 'visible' }}>
        {children}
      </AbsoluteFill>
      {ra > 0.5 && !aberto ? <AnelLuz x={ox} y={oy} r={ra} espessura={3} opacidade={anel} brilho={0.4} giro={q * 14} /> : null}
    </>
  );
};

export const pontoAbre = (props: PropsPontoAbreT): TransitionPresentation<PropsPontoAbreT> => ({ component: PontoAbreApresentacao, props });
