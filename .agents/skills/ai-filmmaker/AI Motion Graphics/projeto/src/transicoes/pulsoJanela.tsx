/* O pulso vira a janela de preview (cena 14 → 15). T 16, k 8.
   `de` = a caixa "vídeo" na tela (C14.videoTela()); `para` = a janela de preview da 15 (C15.janela).
   q0-3  o pulso estoura no centro da caixa: clarão, anel de choque e 16 raios de luz curtos.
   q1-k  um retângulo de luz sai da caixa e se transforma (curva corte, raio acompanhando) na janela
         de preview; a cena 15 aparece só dentro dele. A cena 14 mergulha na caixa (escala em
         torno do centro dela, 1 → 1,5), escurece e some no corte.
   k-T   o resto da cena 15 se revela por um retângulo arredondado que cresce da janela até a tela
         inteira (curva sai); a borda de luz da janela apaga. Atravessa: a janela. */
import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import type { TransitionPresentation, TransitionPresentationComponentProps } from '@remotion/transitions';
import { quadroDaJanela, type ComJanela } from '../base/transicao';
import { clamp01, ease, lerp, PALETA, RGB } from '../tema';

type Ret = { x: number; y: number; w: number; h: number; r: number };
export type PropsPulsoJanela = ComJanela<{ de: Ret; para: Ret }>;

const inset = (r: Ret) =>
  `inset(${r.y.toFixed(1)}px ${(1920 - r.x - r.w).toFixed(1)}px ${(1080 - r.y - r.h).toFixed(1)}px ${r.x.toFixed(1)}px round ${r.r.toFixed(1)}px)`;
const mistura = (a: Ret, b: Ret, t: number): Ret => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t), r: lerp(a.r, b.r, t) });

export const PulsoJanelaApresentacao: React.FC<TransitionPresentationComponentProps<PropsPulsoJanela>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps: p,
}) => {
  const q = quadroDaJanela(presentationProgress, p.T);
  const cx = p.de.x + p.de.w / 2;
  const cy = p.de.y + p.de.h / 2;
  if (presentationDirection === 'exiting') {
    if (q >= p.k) return <AbsoluteFill style={{ visibility: 'hidden' }}>{children}</AbsoluteFill>;
    const m = ease.entra(clamp01(q / p.k));
    return <AbsoluteFill style={{ transformOrigin: `${cx}px ${cy}px`, transform: `scale(${1 + 0.5 * m})`, filter: `brightness(${1 + 0.6 * clamp01(1 - q / 3) - 0.75 * m})` }}>{children}</AbsoluteFill>;
  }
  if (q >= p.T) return <AbsoluteFill>{children}</AbsoluteFill>;
  const a = ease.corte(clamp01((q - 1) / (p.k - 1)));
  const jan = mistura(p.de, p.para, a);
  const b = ease.sai(clamp01((q - p.k) / (p.T - p.k)));
  const tela: Ret = { x: -40, y: -40, w: 2000, h: 1160, r: 0 };
  const revela = mistura(p.para, tela, b);
  const estouro = clamp01(1 - q / 5);
  const anel = ease.sai(clamp01(q / 9));
  const borda = 1 - clamp01((q - p.k) / (p.T - p.k));
  return (
    <>
      {q >= p.k ? <AbsoluteFill style={{ clipPath: inset(revela), filter: `brightness(${0.5 + 0.5 * b})` }}>{children}</AbsoluteFill> : null}
      <AbsoluteFill style={{ clipPath: inset(q >= p.k ? p.para : jan), opacity: clamp01((q - 1) / 2) }}>{children}</AbsoluteFill>
      {/* borda de luz da janela */}
      {borda > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: (q >= p.k ? p.para : jan).x,
            top: (q >= p.k ? p.para : jan).y,
            width: (q >= p.k ? p.para : jan).w,
            height: (q >= p.k ? p.para : jan).h,
            borderRadius: (q >= p.k ? p.para : jan).r,
            border: '4px solid #CFFFE0',
            boxShadow: `0 0 40px rgba(${RGB.acento},.9), inset 0 0 40px rgba(${RGB.acento},.5)`,
            opacity: borda,
          }}
        />
      ) : null}
      {/* estouro do pulso */}
      {estouro > 0 ? (
        <div style={{ position: 'absolute', left: cx - 320, top: cy - 320, width: 640, height: 640, borderRadius: '50%', background: `radial-gradient(circle, rgba(255,255,255,${estouro}) 0%, rgba(${RGB.claro},${0.8 * estouro}) 14%, rgba(${RGB.acento},${0.3 * estouro}) 40%, rgba(${RGB.acento},0) 70%)` }} />
      ) : null}
      {anel < 1 ? (
        <div style={{ position: 'absolute', left: cx - 700 * anel, top: cy - 700 * anel, width: 1400 * anel, height: 1400 * anel, borderRadius: '50%', border: `${2 + 6 * (1 - anel)}px solid ${PALETA.acentoClaro}`, opacity: 1 - anel, boxShadow: `0 0 40px rgba(${RGB.acento},.8)` }} />
      ) : null}
      {q < 8
        ? Array.from({ length: 16 }, (_, i) => {
            const ang = (i / 16) * Math.PI * 2 + random(`pj-${i}`) * 0.3;
            const d0 = 40 + ease.sai(q / 8) * 520;
            const len = 120 * (1 - q / 8);
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: cx + Math.cos(ang) * d0,
                  top: cy + Math.sin(ang) * d0,
                  width: len,
                  height: 3,
                  background: 'linear-gradient(90deg, rgba(255,255,255,0), #E9FFF0)',
                  transformOrigin: '0 50%',
                  transform: `rotate(${(ang * 180) / Math.PI + 180}deg)`,
                  opacity: 1 - q / 8,
                }}
              />
            );
          })
        : null}
    </>
  );
};

export const pulsoJanela = (props: PropsPulsoJanela): TransitionPresentation<PropsPulsoJanela> => ({ component: PulsoJanelaApresentacao, props });
