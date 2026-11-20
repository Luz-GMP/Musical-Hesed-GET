/* faixas: faixas de texto correndo que cobrem a tela. T 18, k 9.
   q0-9: n faixas inclinadas (−7°) entram alternando esquerda e direita, stagger 1, curva corte, até
   cobrir a tela; o texto de cada faixa corre (<Marquee/>, 8 a 12 px por quadro) com um ponto como
   separador. A ponta que chega leva a luz do acento (filete de 6 px e brilho de 90 px) e um rastro
   da cor da faixa na frente dela (desfoque simulado, sem filtro).
   permanece = false, q9-18: as faixas seguem no mesmo sentido e saem pelo lado oposto, revelando a
   cena que entra por trás.
   permanece = true, q9 em diante: a transição mostra a cena que entra, que deve desenhar as mesmas
   faixas no mesmo lugar (geometria em GEOMETRIA_FIXA abaixo), para a troca não pular. */
import React from 'react';
import { AbsoluteFill } from 'remotion';
import type { TransitionPresentation, TransitionPresentationComponentProps } from '@remotion/transitions';
import { Marquee } from '../base/Marquee';
import { quadroDaJanela, type ComJanela } from '../base/transicao';
import { clamp01, curvas } from '../base/curvas';
import { COR, type PropsFaixas } from './base-transicoes';
import { LARG } from './flood';
import { RGB } from '../tema';

export type PropsFaixasT = ComJanela<PropsFaixas> & {
  /** centros (y) das faixas; padrão: GEOMETRIA_FIXA quando permanece, senão lado a lado cobrindo a tela */
  centros?: number[];
  tamanhoTexto?: number;
};

/** A posição das faixas no quadro k quando `permanece` (a cena que entra pode importar daqui). */
export const GEOMETRIA_FIXA = {
  centros: [120, 540, 960],
  altura: 420,
  angulo: -7,
  velocidades: [10, -8, 12],
  deslocamentos: [0, 400, 800],
  tamanhoTexto: 76,
} as const;

const FATOR_VEL = [1, -0.8, 1.2, -0.9, 1.1];
/** Largura do Marquee (2800) posicionado em x −440; a faixa ocupa x −440 a 2360 antes de girar. */
const ESQ = (LARG - 2800) / 2;
const DIR = ESQ + 2800;
/** Quanto a faixa anda para sair inteira da tela (medido no eixo da faixa, com folga para o rastro). */
const DIST = 2640;

export const FaixasApresentacao: React.FC<TransitionPresentationComponentProps<PropsFaixasT>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps: p,
}) => {
  const q = quadroDaJanela(presentationProgress, p.T);
  const cobriu = q >= p.k;
  if (presentationDirection === 'exiting') return <AbsoluteFill style={{ visibility: cobriu ? 'hidden' : 'visible' }}>{children}</AbsoluteFill>;

  const n = p.n;
  const fixa = p.permanece && n === 3;
  const centros = p.centros ?? (fixa ? [...GEOMETRIA_FIXA.centros] : Array.from({ length: n }, (_, i) => 540 + (i - (n - 1) / 2) * p.altura));
  // sem permanecer, as faixas se sobrepõem 14 px para não deixar fresta na inclinação
  const alturaDesenho = p.permanece ? p.altura : p.altura + 14;
  const tamTexto = p.tamanhoTexto ?? (fixa ? GEOMETRIA_FIXA.tamanhoTexto : Math.round(p.altura * 0.42));
  const D = Math.max(3, p.k - (n - 1)); // duração de cada faixa, para a última chegar no quadro k

  const faixas = centros.map((cy, i) => {
    const lado = i % 2 === 0 ? -1 : 1; // −1: vem da esquerda (anda para +x)
    const posDe = (qq: number) => {
      if (qq < p.k || p.permanece) return lado * DIST * (1 - curvas.corte(clamp01((qq - i) / D)));
      return -lado * DIST * curvas.corte(clamp01((qq - p.k - i) / D));
    };
    const off = posDe(q);
    const vel = Math.abs(off - posDe(q - 1));
    if (Math.abs(off) >= DIST - 1) return null;
    const cor = p.cores[i % p.cores.length];
    const corTexto = p.coresTexto[i % p.coresTexto.length];
    const v = fixa ? GEOMETRIA_FIXA.velocidades[i] : p.velocidade * FATOR_VEL[i % FATOR_VEL.length];
    const desloc = fixa ? GEOMETRIA_FIXA.deslocamentos[i] : i * 400;
    // ponta que chega (no eixo da faixa, antes do giro): quem anda para +x lidera pela direita
    const ponta = lado < 0 ? DIR : ESQ;
    const frente = lado < 0 ? 1 : -1;
    const topo = cy - alturaDesenho / 2;
    const rastro = vel > 20 ? Math.min(120, vel * 0.25) : 0;
    const luz = Math.min(1, vel / 60);
    return (
      <AbsoluteFill key={i} style={{ transformOrigin: `${LARG / 2}px ${cy}px`, transform: `rotate(${p.angulo}deg) translateX(${off.toFixed(1)}px)` }}>
        <Marquee
          itens={p.itens}
          y={cy}
          altura={alturaDesenho}
          angulo={0}
          velocidade={v}
          deslocamento={desloc}
          corFaixa={cor}
          corTexto={corTexto}
          tamanhoTexto={tamTexto}
        />
        {rastro > 0 ? (
          <div
            style={{
              position: 'absolute',
              top: topo,
              height: alturaDesenho,
              left: frente > 0 ? ponta : ponta - rastro,
              width: rastro,
              background: `linear-gradient(${frente > 0 ? 90 : 270}deg, ${cor}4d, ${cor}14 55%, ${cor}00)`,
            }}
          />
        ) : null}
        {luz > 0 ? (
          <>
            <div
              style={{
                position: 'absolute',
                top: topo,
                height: alturaDesenho,
                left: frente > 0 ? ponta - 90 : ponta,
                width: 90,
                opacity: luz,
                background: `linear-gradient(${frente > 0 ? 270 : 90}deg, rgba(${RGB.claro},.35), rgba(${RGB.acento},.12) 55%, rgba(${RGB.acento},0))`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: topo,
                height: alturaDesenho,
                left: ponta - 3,
                width: 6,
                opacity: luz,
                background: `linear-gradient(180deg, ${COR.claro}, ${COR.forte})`,
              }}
            />
          </>
        ) : null}
      </AbsoluteFill>
    );
  });

  // a cena que entra fica montada o tempo todo (escondida até o quadro k); com permanece, do quadro
  // k em diante quem desenha as faixas é a própria cena
  return (
    <>
      <AbsoluteFill style={{ visibility: cobriu ? 'visible' : 'hidden' }}>{children}</AbsoluteFill>
      {(p.permanece && cobriu) || q >= p.T ? null : faixas}
    </>
  );
};

export const faixas = (props: PropsFaixasT): TransitionPresentation<PropsFaixasT> => ({ component: FaixasApresentacao, props });
