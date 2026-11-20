/* Chicote com rastro de luz (cena 1 → 2). T 12, k 6.
   As duas cenas correm para a esquerda (a que sai acelera em 5 q, a que entra freia e assenta em q5,5), esticadas na horizontal no pico de
   velocidade e com dois fantasmas atrás (desfoque de movimento sem filtro caro). Por cima: a emenda
   entre as cenas é um filete vertical de luz verde; a linha de luz da cena 1 (yLuz) vira um risco
   que atravessa a tela inteira; 18 riscos finos verdes e brancos correm junto. No corte (q6) o
   pico de luz cobre a emenda. Atravessa: a linha de luz. */
import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import type { TransitionPresentation, TransitionPresentationComponentProps } from '@remotion/transitions';
import { quadroDaJanela, type ComJanela } from '../base/transicao';
import { clamp01, ease, RGB } from '../tema';

export type PropsChicoteLuz = ComJanela<{ yLuz?: number; semente?: string }>;

const L = 1920;

export const ChicoteLuzApresentacao: React.FC<TransitionPresentationComponentProps<PropsChicoteLuz>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps: p,
}) => {
  const q = quadroDaJanela(presentationProgress, p.T);
  if (q >= p.T) return <AbsoluteFill>{children}</AbsoluteFill>;
  // assimétrico: a que sai acelera para fora em 5 q; a que entra freia e ASSENTA em q5,5 (antes do
  // corte k6), para a primeira palavra da cena nova estar parada e nítida quando o som começa
  const saindo = presentationDirection === 'exiting';
  const e = saindo ? ease.entra(clamp01(q / 5)) : ease.sai(clamp01((q - 1) / 4.5));
  const pico = Math.sin(Math.PI * clamp01(q / 7)) ** 1.5 * (q < 7 ? 1 : 0) + clamp01(1 - (q - 5) / 7) * 0.35 * (q >= 5 ? 1 : 0);
  const desloc = saindo ? -L * e : L * (1 - e);
  const estica = 1 + 0.18 * pico;
  const cena = (dx: number, op: number, key: string) => (
    <AbsoluteFill key={key} style={{ transform: `translateX(${dx.toFixed(1)}px) scaleX(${estica})`, transformOrigin: saindo ? '100% 50%' : '0% 50%', opacity: op }}>
      {children}
    </AbsoluteFill>
  );
  const camadas = [
    pico > 0.15 ? cena(desloc + 110 * pico, 0.18 * pico, 'f2') : null,
    pico > 0.15 ? cena(desloc + 55 * pico, 0.3 * pico, 'f1') : null,
    cena(desloc, 1, 'c'),
  ];
  if (saindo) return <>{camadas}</>;

  const emenda = L * (1 - e); // x da borda esquerda da cena que entra
  const yLuz = p.yLuz ?? 600;
  const sem = p.semente ?? 'chicoteLuz';
  return (
    <>
      {camadas}
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        {/* filete de luz na emenda */}
        <div
          style={{
            position: 'absolute',
            left: emenda - 60,
            top: 0,
            width: 120,
            height: 1080,
            background: `linear-gradient(90deg, rgba(${RGB.acento},0), rgba(${RGB.claro},.55) 45%, rgba(255,255,255,.95) 50%, rgba(${RGB.claro},.55) 55%, rgba(${RGB.acento},0))`,
            opacity: pico,
          }}
        />
        {/* a linha de luz da cena 1 atravessa a tela */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: yLuz - 30,
            width: L,
            height: 60,
            background: `linear-gradient(180deg, rgba(${RGB.acento},0), rgba(${RGB.acento},.35) 40%, rgba(255,255,255,1) 50%, rgba(${RGB.acento},.35) 60%, rgba(${RGB.acento},0))`,
            opacity: pico,
            transform: `scaleY(${0.4 + 0.6 * pico})`,
          }}
        />
        {Array.from({ length: 18 }, (_, i) => {
          const r = (k: string) => random(`${sem}-${k}-${i}`);
          const comp = 300 + r('l') * 900;
          const y = r('y') * 1080;
          const x = ((r('x') * (L + comp) - q * (260 + r('v') * 200)) % (L + comp) + (L + comp)) % (L + comp) - comp;
          const verde = r('c') < 0.6;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                width: comp * pico,
                height: r('h') < 0.3 ? 3 : 2,
                background: verde ? `linear-gradient(90deg, rgba(${RGB.acento},0), rgba(${RGB.claro},.85))` : 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.6))',
                opacity: pico,
              }}
            />
          );
        })}
      </AbsoluteFill>
    </>
  );
};

export const chicoteLuz = (props: PropsChicoteLuz): TransitionPresentation<PropsChicoteLuz> => ({ component: ChicoteLuzApresentacao, props });
