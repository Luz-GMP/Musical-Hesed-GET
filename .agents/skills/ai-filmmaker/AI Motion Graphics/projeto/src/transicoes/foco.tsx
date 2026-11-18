/* Desfoque de foco (cena 10 → 11): troca de foco de lente. T 14, k 7.
   q0-k   a cena que sai perde o foco (desfoque 0 → 26 px, respira 1 → 1,06, brilho sobe como
          halação) e bolhas de bokeh (círculos de luz macios, verdes e brancos) crescem por cima.
   q k    no pico do desfoque a cena troca (as duas estão borradas: a troca não se vê).
   q k-T  a cena que entra volta ao foco (26 → 0 px, 0,96 → 1), o bokeh encolhe e apaga; uma régua
          de distância de lente corre embaixo e quatro cantos de autofoco fecham e piscam verde no
          fim ("FOCO").
   Atravessa: o bokeh e a régua de foco. */
import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import type { TransitionPresentation, TransitionPresentationComponentProps } from '@remotion/transitions';
import { quadroDaJanela, type ComJanela } from '../base/transicao';
import { clamp01, ease, FONTEM, lerp, PALETA, RGB } from '../tema';

export type PropsFoco = ComJanela<object>;

const MARCAS = ['∞', '10', '5', '3', '2', '1,5', '1', '0,7', '0,5'];

export const FocoApresentacao: React.FC<TransitionPresentationComponentProps<PropsFoco>> = ({ children, presentationDirection, presentationProgress, passedProps: p }) => {
  const q = quadroDaJanela(presentationProgress, p.T);
  const sai = presentationDirection === 'exiting';
  if (sai) {
    if (q >= p.k) return <AbsoluteFill style={{ visibility: 'hidden' }}>{children}</AbsoluteFill>;
    const u = ease.entra(clamp01(q / p.k));
    if (u <= 0) return <AbsoluteFill>{children}</AbsoluteFill>;
    return <AbsoluteFill style={{ filter: `blur(${(26 * u).toFixed(2)}px) brightness(${(1 + 0.5 * u).toFixed(3)})`, transform: `scale(${(1 + 0.06 * u).toFixed(4)})` }}>{children}</AbsoluteFill>;
  }
  const v = q < p.k ? 0 : ease.sai(clamp01((q - p.k) / (p.T - p.k)));
  const borrado = q < p.k ? 1 : 1 - v;
  const bokeh = q < p.k ? ease.sai(clamp01(q / p.k)) : 1 - v;
  const regua = clamp01(q / 3) * (1 - clamp01((q - (p.T - 2)) / 2));
  const fechaAF = ease.sai(clamp01((q - p.k) / (p.T - p.k - 2)));
  const pisca = q >= p.T - 3 ? 1 : 0;
  return (
    <>
      <AbsoluteFill style={{ visibility: q < p.k ? 'hidden' : 'visible', filter: borrado > 0.01 ? `blur(${(26 * borrado).toFixed(2)}px) brightness(${(1 + 0.4 * borrado).toFixed(3)})` : undefined, transform: `scale(${lerp(0.96, 1, v).toFixed(4)})` }}>{children}</AbsoluteFill>
      {bokeh > 0.01 ? (
        <AbsoluteFill style={{ pointerEvents: 'none' }}>
          {Array.from({ length: 22 }, (_, i) => {
            const r = (k: string) => random(`foco-${k}-${i}`);
            const R = (30 + r('r') * 80) * (0.5 + 0.5 * bokeh);
            const x = r('x') * 1920 + Math.sin(q / 3 + i) * 10;
            const y = r('y') * 1080;
            const verde = r('c') < 0.65;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: x - R,
                  top: y - R,
                  width: R * 2,
                  height: R * 2,
                  borderRadius: '50%',
                  background: verde ? `radial-gradient(circle, rgba(${RGB.claro},.20) 55%, rgba(${RGB.claro},.45) 68%, rgba(${RGB.claro},0) 72%)` : 'radial-gradient(circle, rgba(255,255,255,.14) 55%, rgba(255,255,255,.35) 68%, rgba(255,255,255,0) 72%)',
                  opacity: bokeh * (0.5 + 0.5 * r('o')),
                }}
              />
            );
          })}
        </AbsoluteFill>
      ) : null}
      {regua > 0 ? (
        <AbsoluteFill style={{ pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', left: 560, top: 930, width: 800, height: 80, overflow: 'hidden', opacity: regua, WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 20%, #000 80%, transparent)', maskImage: 'linear-gradient(90deg, transparent, #000 20%, #000 80%, transparent)' }}>
            {MARCAS.map((m, i) => {
              const x = 400 + i * 150 - lerp(0, 150 * 6, ease.corte(clamp01(q / p.T)));
              return (
                <React.Fragment key={m}>
                  <div style={{ position: 'absolute', left: x, top: 0, width: 3, height: 22, background: '#C8FFD9' }} />
                  <div style={{ position: 'absolute', left: x - 40, width: 80, top: 30, textAlign: 'center', fontFamily: FONTEM.mono, fontSize: 30, color: '#C8FFD9' }}>{m}</div>
                </React.Fragment>
              );
            })}
          </div>
          <div style={{ position: 'absolute', left: 958, top: 914, width: 4, height: 40, background: PALETA.acento, boxShadow: `0 0 12px rgba(${RGB.acento},1)`, opacity: regua }} />
        </AbsoluteFill>
      ) : null}
      {q >= p.k && q < p.T ? (
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {[
            [-1, -1],
            [1, -1],
            [-1, 1],
            [1, 1],
          ].map(([sx, sy], i) => {
            const x = 960 + sx * lerp(860, 420, fechaAF);
            const y = 540 + sy * lerp(480, 260, fechaAF);
            const L = 60;
            return <path key={i} d={`M${x} ${y - sy * L}V${y}H${x - sx * L}`} fill="none" stroke={pisca ? PALETA.acento : '#E8FFF0'} strokeWidth={5} opacity={1 - clamp01((q - (p.T - 1)) / 1)} style={{ filter: `drop-shadow(0 0 8px rgba(${RGB.acento},1))` }} />;
          })}
          {pisca ? (
            <text x={960} y={540 - 280} textAnchor="middle" fontFamily={FONTEM.mono} fontSize={30} fill={PALETA.acento}>
              FOCO
            </text>
          ) : null}
        </svg>
      ) : null}
    </>
  );
};

export const foco = (props: PropsFoco): TransitionPresentation<PropsFoco> => ({ component: FocoApresentacao, props });
