/* A câmera atravessa uma letra (cena 4 → 5: o "O" de OPUS). T 16, k 10.
   `centro` e `raio` são o centro e os raios do miolo da letra NA TELA no início da janela (funções:
   medem a fonte no render). q0-k: a cena que sai escala em volta do miolo (curva expo: devagar e
   depois mergulho), com desfoque crescente; a que entra aparece SÓ dentro da elipse do miolo, que
   escala junto, e cresce por dentro de 0,5 a 1 (paralaxe: sensação de atravessar). No q k a elipse
   já cobre a tela; q k-T: a borda da letra (anel de luz verde) passa pela câmera e some.
   Atravessa: a letra. */
import React from 'react';
import { AbsoluteFill } from 'remotion';
import type { TransitionPresentation, TransitionPresentationComponentProps } from '@remotion/transitions';
import { quadroDaJanela, type ComJanela } from '../base/transicao';
import { clamp01, ease, lerp, RGB } from '../tema';

type XY = [number, number];
export type PropsAtravessa = ComJanela<{ centro: () => XY; raio: () => XY }>;

/** Escala em que uma elipse (rx, ry) centrada em c cobre a tela 1920x1080. */
const escalaCobre = (c: XY, r: XY) =>
  Math.max(
    ...[
      [0, 0],
      [1920, 0],
      [0, 1080],
      [1920, 1080],
    ].map(([x, y]) => Math.hypot((x - c[0]) / r[0], (y - c[1]) / r[1])),
  );

export const AtravessaApresentacao: React.FC<TransitionPresentationComponentProps<PropsAtravessa>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps: p,
}) => {
  const q = quadroDaJanela(presentationProgress, p.T);
  const c = p.centro();
  const r = p.raio();
  const cobre = escalaCobre(c, r) * 1.04;
  // escala do mundo da cena que sai: 1 → cobre (no q k) → cobre × 2,2 (no q T), exponencial
  const escala = (qq: number) => {
    if (qq <= p.k) return Math.exp(Math.log(cobre) * ease.expo(clamp01(qq / p.k)));
    return cobre * Math.exp(Math.log(2.2) * clamp01((qq - p.k) / (p.T - p.k)));
  };
  const S = escala(q);
  const vel = Math.log(escala(q)) - Math.log(escala(q - 1));
  if (presentationDirection === 'exiting') {
    if (q <= 0) return <AbsoluteFill>{children}</AbsoluteFill>;
    if (q >= p.k + 4) return <AbsoluteFill style={{ visibility: 'hidden' }}>{children}</AbsoluteFill>;
    return (
      <AbsoluteFill
        style={{
          transformOrigin: `${c[0]}px ${c[1]}px`,
          transform: `scale(${S.toFixed(4)})`,
          filter: vel > 0.05 ? `blur(${Math.min(6, vel * 8).toFixed(2)}px) brightness(${1 + Math.min(0.6, vel)})` : undefined,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }
  if (q >= p.T) return <AbsoluteFill>{children}</AbsoluteFill>;
  const rx = r[0] * S;
  const ry = r[1] * S;
  const dentro = lerp(0.5, 1, ease.sai(clamp01(q / p.T)));
  // o centro da cena que entra desliza do miolo para o centro da tela
  const desliza = ease.suave(clamp01(q / p.k));
  const tx = (c[0] - 960) * (1 - desliza);
  const ty = (c[1] - 540) * (1 - desliza);
  const aberto = q >= p.k;
  const anel = 1 - clamp01((q - p.k) / (p.T - p.k));
  return (
    <>
      <AbsoluteFill style={{ clipPath: aberto ? undefined : `ellipse(${rx.toFixed(1)}px ${ry.toFixed(1)}px at ${c[0]}px ${c[1]}px)`, visibility: q <= 0 ? 'hidden' : 'visible' }}>
        <AbsoluteFill style={{ transform: `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${dentro.toFixed(4)})` }}>{children}</AbsoluteFill>
      </AbsoluteFill>
      {q > 0 && anel > 0 ? (
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <ellipse cx={c[0]} cy={c[1]} rx={rx} ry={ry} fill="none" stroke={`rgba(${RGB.acento},.35)`} strokeWidth={Math.min(120, 14 + S * 0.8)} opacity={anel} />
          <ellipse cx={c[0]} cy={c[1]} rx={rx} ry={ry} fill="none" stroke="#C8FFD9" strokeWidth={3} opacity={anel} />
        </svg>
      ) : null}
    </>
  );
};

export const atravessa = (props: PropsAtravessa): TransitionPresentation<PropsAtravessa> => ({ component: AtravessaApresentacao, props });
