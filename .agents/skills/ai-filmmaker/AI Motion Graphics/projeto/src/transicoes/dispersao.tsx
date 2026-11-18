/* dispersao: partículas que viram a próxima tela. T 24, k 18. Um <canvas> de 1920x1080 por cima.
   q0-4: ~700 partículas aparecem exatamente sobre a fonte (texto medido ou lista de pontos).
   q4-18: cada uma voa em arco até um ponto sorteado dentro dos alvos, atraso de 0 a 6 quadros pela
   distância, curva corte; no voo 15% ficam no acento claro e 10% no acento. Duas cópias atrasadas do
   canvas (.30 e .15) fazem o rastro de desfoque enquanto elas voam.
   q12-20: a cena que entra abre por círculo a partir do centro (curva saida) com anel de luz;
   q18-24: as partículas encolhem até 0 sobre os alvos, que a cena que entra já desenha ali.
   Sem fonte, usa a palavra MOTION no centro; sem alvos, uma grade de pontos (prova visual). */
import React from 'react';
import { AbsoluteFill } from 'remotion';
import type { TransitionPresentation, TransitionPresentationComponentProps } from '@remotion/transitions';
import { Particulas } from './Particulas';
import { quadroDaJanela, type ComJanela } from '../base/transicao';
import { clamp01, curvas } from '../base/curvas';
import { type FonteParticulas, type PropsDispersao } from './base-transicoes';
import { AnelLuz, cantoMaisLonge } from './flood';

export type PropsDispersaoT = ComJanela<PropsDispersao> & {
  /** de onde a cena que entra abre (padrão: centro da tela) */
  centroAbertura?: readonly [number, number];
};

const FONTE_TESTE: FonteParticulas[] = [{ tipo: 'texto', texto: 'MOTION', x: 960, base: 620, tamanho: 260, alinhar: 'centro' }];
const ALVOS_TESTE = { pontos: Array.from({ length: 60 }, (_, i) => [360 + (i % 12) * 109, 340 + Math.floor(i / 12) * 100] as const), raio: 8 };

export const DispersaoApresentacao: React.FC<TransitionPresentationComponentProps<PropsDispersaoT>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps: p,
}) => {
  const q = quadroDaJanela(presentationProgress, p.T);
  if (presentationDirection === 'exiting') return <AbsoluteFill>{children}</AbsoluteFill>;

  const esc = p.T / 24; // as fases do storyboard são numa janela de 24
  const fontes = p.fonte.length ? p.fonte : FONTE_TESTE;
  const temAlvos = (p.alvos.retangulos?.length ?? 0) + (p.alvos.pontos?.length ?? 0) > 0;
  const alvos = temAlvos ? p.alvos : ALVOS_TESTE;
  const [cx, cy] = p.centroAbertura ?? [960, 540];
  const R = cantoMaisLonge(cx, cy) + 10;
  const abre = clamp01((q - 12 * esc) / (8 * esc));
  const r = R * curvas.saida(abre);
  const aberto = abre >= 1;
  // rastro: só enquanto voam (q4-18)
  const voando = q > 4 * esc && q < 18.5 * esc;
  const comum = { fontes, alvos, semente: p.semente, n: p.n, duracao: p.T };

  return (
    <>
      <AbsoluteFill style={{ clipPath: aberto ? undefined : `circle(${r.toFixed(1)}px at ${cx}px ${cy}px)`, visibility: r <= 0.5 ? 'hidden' : 'visible' }}>
        {children}
      </AbsoluteFill>
      {r > 0.5 && !aberto ? <AnelLuz x={cx} y={cy} r={r} espessura={2} opacidade={1 - clamp01((abre - 0.7) / 0.3)} brilho={0.3} giro={q * 10} /> : null}
      {voando ? (
        <>
          <AbsoluteFill style={{ opacity: 0.15 }}>
            <Particulas {...comum} tempo={q - 1.1} />
          </AbsoluteFill>
          <AbsoluteFill style={{ opacity: 0.3 }}>
            <Particulas {...comum} tempo={q - 0.55} />
          </AbsoluteFill>
        </>
      ) : null}
      {q >= p.T ? null : <Particulas {...comum} tempo={q} />}
    </>
  );
};

export const dispersao = (props: PropsDispersaoT): TransitionPresentation<PropsDispersaoT> => ({ component: DispersaoApresentacao, props });
