/* Caixa de seleção de ferramenta de design. Contorno de 1 px verde + 8 alças 10x10
   brancas com borda verde de 1,5 px. progresso 0 → 1 faz as alças crescerem (0 = escondida). */
import React from 'react';
import { PALETA } from '../tema';

export const AlcasSelecao: React.FC<{ x: number; y: number; w: number; h: number; progresso?: number; cor?: string }> = ({
  x,
  y,
  w,
  h,
  progresso = 1,
  cor = PALETA.acento,
}) => {
  const p = Math.max(0, Math.min(1, progresso));
  if (p <= 0) return null;
  const a = 10 * p;
  const pts: Array<[number, number]> = [
    [x, y], [x + w / 2, y], [x + w, y],
    [x, y + h / 2], [x + w, y + h / 2],
    [x, y + h], [x + w / 2, y + h], [x + w, y + h],
  ];
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, border: `1px solid ${cor}`, opacity: Math.min(1, p * 2), boxSizing: 'border-box' }} />
      {pts.map(([px, py], i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: px - a / 2,
            top: py - a / 2,
            width: a,
            height: a,
            background: PALETA.branco,
            border: `1.5px solid ${cor}`,
            boxSizing: 'border-box',
          }}
        />
      ))}
    </div>
  );
};
