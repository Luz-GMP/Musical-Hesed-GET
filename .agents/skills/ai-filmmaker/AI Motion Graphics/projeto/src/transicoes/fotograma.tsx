/* O círculo vira um fotograma de filme (cena 11 → 12). T 16, k 10.
   `circulo` é o círculo da cena 11 na tela no início da janela; `para` é o fotograma central da
   película da cena 12 no quadro local k (C12.fotograma).
   q0-k   o resto da cena 11 escurece e desfoca; o círculo descola, voa e se transforma no retângulo
          do fotograma (raio cai, proporção vira 1,41), por dentro o anel verde dá lugar ao quadro
          renderizado em miniatura; a partir de q4 os trilhos de perfuração nascem do fotograma para
          os dois lados e os fotogramas vizinhos deslizam para dentro: no quadro k o desenho é
          exatamente a película da cena 12 parada (FitaFilme com offset 0).
   q k-T  troca seca para a cena 12 (idêntica) e o contorno de luz do fotograma apaga.
   Atravessa: o círculo. */
import React from 'react';
import { AbsoluteFill } from 'remotion';
import type { TransitionPresentation, TransitionPresentationComponentProps } from '@remotion/transitions';
import { quadroDaJanela, type ComJanela } from '../base/transicao';
import { FitaFilme, QuadroMini } from '../cenas/pecas';
import type { RetB } from '../layoutB';
import { clamp01, ease, lerp, PALETA, RGB } from '../tema';

export type PropsFotograma = ComJanela<{ circulo: { cx: number; cy: number; r: number }; para: RetB }>;

export const FotogramaApresentacao: React.FC<TransitionPresentationComponentProps<PropsFotograma>> = ({ children, presentationDirection, presentationProgress, passedProps: p }) => {
  const q = quadroDaJanela(presentationProgress, p.T);
  const u = ease.corte(clamp01(q / (p.k - 1)));
  if (presentationDirection === 'exiting') {
    if (q >= p.k) return <AbsoluteFill style={{ visibility: 'hidden' }}>{children}</AbsoluteFill>;
    const d = ease.sai(clamp01(q / 5));
    return <AbsoluteFill style={{ filter: `brightness(${(1 - 0.75 * d).toFixed(3)}) blur(${(6 * d).toFixed(2)}px)`, transform: `scale(${(1 + 0.04 * d).toFixed(4)})` }}>{children}</AbsoluteFill>;
  }
  if (q >= p.T) return <AbsoluteFill>{children}</AbsoluteFill>;
  const aberto = q >= p.k;
  const C = p.circulo;
  const F = p.para;
  const w = lerp(2 * C.r, F.w, u);
  const h = lerp(2 * C.r, F.h, u);
  const cx = lerp(C.cx, F.x + F.w / 2, u);
  const cy = lerp(C.cy, F.y + F.h / 2, u) - Math.sin(Math.PI * u) * 60;
  const raio = lerp(C.r, F.r, ease.sai(u));
  const rot = (1 - u) * -25;
  const mini = clamp01((u - 0.25) / 0.45);
  const fita = ease.sai(clamp01((q - 4) / (p.k - 4)));
  const luz = aberto ? 1 - clamp01((q - p.k) / (p.T - p.k)) : 1;
  return (
    <>
      <AbsoluteFill style={{ visibility: aberto ? 'visible' : 'hidden' }}>{children}</AbsoluteFill>
      {!aberto && fita > 0 ? (
        <AbsoluteFill style={{ clipPath: `inset(0 ${(960 * (1 - fita)).toFixed(1)}px 0 ${(960 * (1 - fita)).toFixed(1)}px)` }}>
          <FitaFilme offset={0} pular={(j) => j === 0} />
        </AbsoluteFill>
      ) : null}
      {!aberto ? (
        <div
          style={{
            position: 'absolute',
            left: cx - w / 2,
            top: cy - h / 2,
            width: w,
            height: h,
            borderRadius: raio,
            overflow: 'hidden',
            transform: `rotate(${rot}deg)`,
            border: `${lerp(5, 2, u).toFixed(1)}px solid ${u < 0.6 ? PALETA.acento : `rgba(${RGB.claro},.75)`}`,
            boxSizing: 'border-box',
            background: `radial-gradient(circle, rgba(${RGB.acento},.38), rgba(${RGB.acento},.04) 70%)`,
            boxShadow: `0 0 ${(60 - 30 * u).toFixed(0)}px rgba(${RGB.acento},.8)`,
          }}
        >
          {mini > 0 ? (
            <div style={{ position: 'absolute', inset: 0, opacity: mini }}>
              <QuadroMini w={F.w} h={F.h} t={0} />
            </div>
          ) : null}
        </div>
      ) : null}
      {luz > 0 && q > 0 ? (
        <div style={{ position: 'absolute', left: (aberto ? F.x : cx - w / 2) - 6, top: (aberto ? F.y : cy - h / 2) - 6, width: (aberto ? F.w : w) + 12, height: (aberto ? F.h : h) + 12, borderRadius: (aberto ? F.r : raio) + 6, border: '3px solid #DFFFEA', boxShadow: `0 0 30px rgba(${RGB.acento},1)`, opacity: luz * (aberto ? 1 : clamp01(u * 3)), transform: aberto ? undefined : `rotate(${rot}deg)`, pointerEvents: 'none' }} />
      ) : null}
    </>
  );
};

export const fotograma = (props: PropsFotograma): TransitionPresentation<PropsFotograma> => ({ component: FotogramaApresentacao, props });
