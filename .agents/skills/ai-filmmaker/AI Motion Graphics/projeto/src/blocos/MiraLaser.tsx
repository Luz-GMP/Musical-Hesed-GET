/* <MiraLaser x y raio fora />: mira de laser. Linha vertical e horizontal de ponta a ponta (núcleo
   claro + halo do acento), régua com marcas a cada 40 px na horizontal, círculo tracejado girando,
   anel interno, leitura de coordenadas em mono 28 px e um flare no centro.
   Mova x/y com janelaM + lerp (curva 'corte') para ela "varrer" a tela e parar no alvo.
   raio: raio do círculo tracejado (0 esconde o círculo). fora: 0→1 apaga a mira (saída). */
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { CORM, FONTEM, RGB } from '../tema';
import { Flare } from '../visual';

export const MiraLaser: React.FC<{ x: number; y: number; raio?: number; fora?: number; opacidade?: number; leitura?: boolean }> = ({
  x,
  y,
  raio = 230,
  fora = 0,
  opacidade = 1,
  leitura = true,
}) => {
  const f = useCurrentFrame();
  if (opacidade <= 0) return null;
  return (
    <AbsoluteFill style={{ opacity: opacidade }}>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <line x1={x} x2={x} y1={-200} y2={1280} stroke={`rgba(${RGB.acento},.35)`} strokeWidth={10 * (1 - 0.7 * fora)} />
        <line x1={x} x2={x} y1={-200} y2={1280} stroke="#E8FFF0" strokeWidth={2} opacity={1 - 0.75 * fora} />
        <line x1={-200} x2={2120} y1={y} y2={y} stroke={`rgba(${RGB.acento},.35)`} strokeWidth={10 * (1 - 0.7 * fora)} />
        <line x1={-200} x2={2120} y1={y} y2={y} stroke="#E8FFF0" strokeWidth={2} opacity={1 - 0.6 * fora} />
        {Array.from({ length: 48 }, (_, i) => (
          <line key={i} x1={i * 40} x2={i * 40} y1={y - (i % 5 === 0 ? 14 : 7)} y2={y + (i % 5 === 0 ? 14 : 7)} stroke={CORM.verdeClaro} strokeWidth={2} opacity={0.7 * (1 - fora)} />
        ))}
        {raio > 2 ? (
          <>
            <circle cx={x} cy={y} r={raio} fill="none" stroke={CORM.verdeClaro} strokeWidth={2.5} strokeDasharray="14 10" transform={`rotate(${f * 4} ${x} ${y})`} />
            <circle cx={x} cy={y} r={raio * 0.32} fill="none" stroke="#E8FFF0" strokeWidth={2} />
          </>
        ) : null}
      </svg>
      {leitura ? (
        <div style={{ position: 'absolute', left: x + 26, top: y - 58, fontFamily: FONTEM.mono, fontSize: 28, color: CORM.verdeClaro, whiteSpace: 'pre', opacity: 1 - fora }}>
          {`X ${String(Math.round(x)).padStart(4, '0')}  Y ${String(Math.round(y)).padStart(4, '0')}`}
        </div>
      ) : null}
      <Flare x={x} y={y} forca={0.9 * (1 - 0.6 * fora)} largura={520} />
    </AbsoluteFill>
  );
};
