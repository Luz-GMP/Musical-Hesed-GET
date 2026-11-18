/* Estilhaça em partículas (cena 2 → 3). T 16, k 5.
   q0: a cena que sai racha a partir de `impacto` (filetes de luz nas arestas de 30 cacos
   triangulares de uma grade 5x3 com vértices sorteados). q1-15: cada caco voa para fora do impacto
   (acelerando, atraso de 0 a 3 quadros pela distância), gira em 3D, encolhe e apaga; a borda de
   cada caco brilha verde. 160 faíscas saem dos centros dos cacos. A cena que entra abre por um círculo
   de borda suave a partir do impacto (q1-13), escala 1,08→1: os cacos das bordas seguem por cima. Atravessa: os cacos e as faíscas. */
import React from 'react';
import { AbsoluteFill, random } from 'remotion';
import type { TransitionPresentation, TransitionPresentationComponentProps } from '@remotion/transitions';
import { quadroDaJanela, type ComJanela } from '../base/transicao';
import { clamp01, ease, PALETA, RGB } from '../tema';

export type PropsEstilhaca = ComJanela<{ impacto?: [number, number]; semente?: string; colunas?: number; linhas?: number }>;

type Caco = { pts: [number, number][]; cx: number; cy: number; dist: number };

const cache = new Map<string, Caco[]>();
const cacos = (sem: string, cols: number, rows: number, imp: [number, number]): Caco[] => {
  const chave = `${sem}|${cols}|${rows}|${imp.join(',')}`;
  const c = cache.get(chave);
  if (c) return c;
  const cw = 1920 / cols;
  const ch = 1080 / rows;
  const v = (i: number, j: number): [number, number] => {
    const borda = i === 0 || j === 0 || i === cols || j === rows;
    const jx = borda && (i === 0 || i === cols) ? 0 : (random(`${sem}-vx-${i}-${j}`) - 0.5) * cw * 0.7;
    const jy = borda && (j === 0 || j === rows) ? 0 : (random(`${sem}-vy-${i}-${j}`) - 0.5) * ch * 0.7;
    return [i * cw + jx, j * ch + jy];
  };
  const lista: Caco[] = [];
  for (let i = 0; i < cols; i++)
    for (let j = 0; j < rows; j++) {
      const a = v(i, j);
      const b = v(i + 1, j);
      const cc = v(i + 1, j + 1);
      const d = v(i, j + 1);
      const tris: [number, number][][] = random(`${sem}-d-${i}-${j}`) < 0.5 ? [[a, b, cc], [a, cc, d]] : [[a, b, d], [b, cc, d]];
      tris.forEach((pts) => {
        const cx = (pts[0][0] + pts[1][0] + pts[2][0]) / 3;
        const cy = (pts[0][1] + pts[1][1] + pts[2][1]) / 3;
        lista.push({ pts, cx, cy, dist: Math.hypot(cx - imp[0], cy - imp[1]) });
      });
    }
  cache.set(chave, lista);
  return lista;
};

export const EstilhacaApresentacao: React.FC<TransitionPresentationComponentProps<PropsEstilhaca>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps: p,
}) => {
  const q = quadroDaJanela(presentationProgress, p.T);
  const imp = p.impacto ?? [960, 560];
  const sem = p.semente ?? 'estilhaca';
  if (presentationDirection === 'entering') {
    if (q >= p.T) return <AbsoluteFill>{children}</AbsoluteFill>;
    // a cena que entra abre por um círculo a partir do impacto (o miolo esvazia primeiro), assim os
    // cacos que ainda voam nas bordas continuam visíveis por cima do fundo novo
    const e = ease.suave(clamp01((q - 1) / (p.T - 4)));
    const R = e * 1500;
    const m = `radial-gradient(circle at ${imp[0]}px ${imp[1]}px, #000 ${R.toFixed(0)}px, transparent ${(R + 160).toFixed(0)}px)`;
    return (
      <AbsoluteFill style={{ transform: `scale(${1.08 - 0.08 * e})`, WebkitMaskImage: m, maskImage: m, visibility: q < 1 ? 'hidden' : 'visible' }}>
        {children}
      </AbsoluteFill>
    );
  }
  if (q <= 0) return <AbsoluteFill>{children}</AbsoluteFill>;
  const lista = cacos(sem, p.colunas ?? 5, p.linhas ?? 3, imp);
  const maxD = Math.max(...lista.map((c) => c.dist)) || 1;
  const racha = 1 - clamp01((q - 0.5) / 1.5);
  return (
    <AbsoluteFill style={{ perspective: 1400 }}>
      {lista.map((c, i) => {
        const r = (k: string) => random(`${sem}-${k}-${i}`);
        const atraso = (c.dist / maxD) * 4;
        const t = clamp01((q - atraso) / (p.T - 3 - atraso));
        const voo = 1 - (1 - t) * (1 - t);
        const ang = Math.atan2(c.cy - imp[1], c.cx - imp[0]) + (r('a') - 0.5) * 0.6;
        const dist = voo * (160 + r('d') * 420);
        const dx = Math.cos(ang) * dist;
        const dy = Math.sin(ang) * dist + voo * voo * 260;
        const rz = (r('rz') - 0.5) * 140 * voo;
        const rx = (r('rx') - 0.5) * 160 * voo;
        const ry = (r('ry') - 0.5) * 160 * voo;
        const esc = 1 - 0.45 * voo;
        const op = 1 - clamp01((t - 0.45) / 0.55);
        if (op <= 0) return null;
        const poli = c.pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(',');
        const pontos = c.pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
        return (
          <AbsoluteFill
            key={i}
            style={{
              transformOrigin: `${c.cx}px ${c.cy}px`,
              transform: `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, ${(voo * (120 + r('z') * 380)).toFixed(1)}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${esc})`,
              opacity: op,
            }}
          >
            <AbsoluteFill style={{ clipPath: `polygon(${poli})`, filter: `brightness(${(1 + 0.5 * voo).toFixed(2)})` }}>{children}</AbsoluteFill>
            <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
              <polygon points={pontos} fill="none" stroke={PALETA.acentoClaro} strokeWidth={3} opacity={0.5 + 0.5 * voo} />
            </svg>
          </AbsoluteFill>
        );
      })}
      {/* rachaduras acendendo no primeiro quadro */}
      {racha > 0 ? (
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
          {lista.map((c, i) => (
            <polygon key={i} points={c.pts.map(([x, y]) => `${x},${y}`).join(' ')} fill="none" stroke="#E8FFF0" strokeWidth={3} opacity={racha * 0.9} />
          ))}
          <circle cx={imp[0]} cy={imp[1]} r={60 + 200 * (1 - racha)} fill={`rgba(${RGB.claro},.35)`} opacity={racha} />
        </svg>
      ) : null}
      {/* faíscas */}
      {Array.from({ length: 160 }, (_, i) => {
        const r = (k: string) => random(`${sem}-fa-${k}-${i}`);
        const c = lista[i % lista.length];
        const t = clamp01((q - r('t') * 3) / (p.T - 4));
        if (t <= 0 || t >= 1) return null;
        const ang = Math.atan2(c.cy - imp[1], c.cx - imp[0]) + (r('a') - 0.5) * 1.6;
        const d = ease.sai(t) * (200 + r('d') * 700);
        const x = c.cx + Math.cos(ang) * d;
        const y = c.cy + Math.sin(ang) * d + t * t * 120;
        const tam = 2 + r('s') * 5;
        return (
          <div
            key={`f${i}`}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: tam,
              height: tam,
              borderRadius: '50%',
              background: r('c') < 0.65 ? PALETA.acentoClaro : '#FFFFFF',
              boxShadow: `0 0 10px rgba(${RGB.acento},.9)`,
              opacity: 1 - t,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const estilhaca = (props: PropsEstilhaca): TransitionPresentation<PropsEstilhaca> => ({ component: EstilhacaApresentacao, props });
