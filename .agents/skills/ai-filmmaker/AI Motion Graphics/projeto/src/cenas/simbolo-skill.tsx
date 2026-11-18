/* O símbolo da skill de motion (cenas 16, 17 e 19).
   Um losango de cantos arredondados (o "keyframe" do After Effects, aumentado) com um M de traço
   único por dentro; no vale do M, um losango pequeno cheio: o keyframe que ninguém precisa mais
   arrastar. Tudo em traço verde com brilho, núcleo claro.

   Geometria em unidades de R (meia diagonal do losango), y para baixo:
     losango externo: vértices (0,-1) (1,0) (0,1) (-1,0), cantos arredondados (raio 0,16 R)
     M: (-0,40, 0,30) → (-0,40, -0,26) → (0, 0,16) → (0,40, -0,26) → (0,40, 0,30), traço 0,085 R
     keyframe: losango cheio de meia diagonal 0,10 R em (0, 0,16)
   <SimboloSkill cx cy R desenho brilho /> desenha (desenho 0→1 traça o contorno e o M).
   pontosDoSimbolo(cx, cy, R, passo) devolve pontos ao longo dos traços (para partículas). */
import React from 'react';
import { CORM, RGB } from '../tema';

type XY = [number, number];

export const M_PONTOS: XY[] = [
  [-0.4, 0.3],
  [-0.4, -0.26],
  [0, 0.16],
  [0.4, -0.26],
  [0.4, 0.3],
];
export const KEY_SIMBOLO: XY = [0, 0.16];
const RAIO_CANTO = 0.16;
const TRACO_LOSANGO = 0.07;
const TRACO_M = 0.085;

/** Contorno do losango com cantos arredondados, em unidades de R (path SVG). */
const pathLosango = (cx: number, cy: number, R: number) => {
  // cada canto é cortado a d = raio·√2 ao longo das arestas e arredondado por uma quadrática
  const v: XY[] = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ];
  const d = RAIO_CANTO;
  const P = (p: XY) => `${(cx + p[0] * R).toFixed(1)} ${(cy + p[1] * R).toFixed(1)}`;
  const parts: string[] = [];
  for (let i = 0; i < 4; i++) {
    const a = v[(i + 3) % 4];
    const b = v[i];
    const c = v[(i + 1) % 4];
    const la = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const lc = Math.hypot(c[0] - b[0], c[1] - b[1]);
    const p1: XY = [b[0] + ((a[0] - b[0]) / la) * d, b[1] + ((a[1] - b[1]) / la) * d];
    const p2: XY = [b[0] + ((c[0] - b[0]) / lc) * d, b[1] + ((c[1] - b[1]) / lc) * d];
    parts.push(`${i === 0 ? 'M' : 'L'} ${P(p1)} Q ${P(b)} ${P(p2)}`);
  }
  return `${parts.join(' ')} Z`;
};

const pathM = (cx: number, cy: number, R: number) => M_PONTOS.map((p, i) => `${i === 0 ? 'M' : 'L'} ${(cx + p[0] * R).toFixed(1)} ${(cy + p[1] * R).toFixed(1)}`).join(' ');

/** comprimentos aproximados (em R) para o strokeDasharray */
const COMP_LOSANGO = 4 * Math.SQRT2;
const COMP_M = M_PONTOS.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - M_PONTOS[i][0], p[1] - M_PONTOS[i][1]), 0);

export const SimboloSkill: React.FC<{
  cx: number;
  cy: number;
  R: number;
  /** 0→1: quanto dos traços já foi desenhado */
  desenho?: number;
  /** 0→1: brilho extra (clarão de montagem) */
  brilho?: number;
  /** só o contorno (camadas de espessura do 3D) */
  fantasma?: boolean;
  opacidade?: number;
  cor?: string;
  /** desenha só estas partes (vista explodida da cena 17); padrão: todas */
  so?: ('placa' | 'losango' | 'm' | 'key')[];
}> = ({ cx, cy, R, desenho = 1, brilho = 0, fantasma = false, opacidade = 1, cor = CORM.verde, so }) => {
  const tem = (x: 'placa' | 'losango' | 'm' | 'key') => !so || so.includes(x);
  if (opacidade <= 0.001) return null;
  const dl = COMP_LOSANGO * R;
  const dm = COMP_M * R;
  const pl = Math.min(1, desenho * 1.25);
  const pm = Math.max(0, Math.min(1, desenho * 1.6 - 0.6));
  const k = Math.max(0, Math.min(1, (desenho - 0.85) / 0.15));
  const key = KEY_SIMBOLO;
  const kr = 0.1 * R;
  const kx = cx + key[0] * R;
  const ky = cy + key[1] * R;
  const losango = pathLosango(cx, cy, R);
  const m = pathM(cx, cy, R);
  if (fantasma) {
    return (
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, overflow: 'visible', opacity: opacidade }}>
        <path d={losango} fill="rgba(10,40,22,.55)" stroke={cor} strokeWidth={TRACO_LOSANGO * R * 0.8} strokeOpacity={0.55} />
        <path d={m} fill="none" stroke={cor} strokeWidth={TRACO_M * R * 0.8} strokeOpacity={0.45} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  const glow = 0.55 + 0.45 * brilho;
  return (
    <svg
      width={1920}
      height={1080}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'visible',
        opacity: opacidade,
        filter: `drop-shadow(0 0 ${(10 + 20 * brilho).toFixed(0)}px rgba(${RGB.acento},${glow.toFixed(2)})) drop-shadow(0 0 ${(36 + 60 * brilho).toFixed(0)}px rgba(${RGB.acento},${(0.45 + 0.4 * brilho).toFixed(2)}))`,
      }}
    >
      {tem('placa') ? <path d={losango} fill={`rgba(8,30,16,${(0.75 * pl).toFixed(2)})`} stroke="none" /> : null}
      {/* traço largo (cor) + núcleo claro */}
      {tem('losango') ? (
        <>
          <path d={losango} fill="none" stroke={cor} strokeWidth={TRACO_LOSANGO * R} strokeDasharray={`${dl} ${dl}`} strokeDashoffset={dl * (1 - pl)} strokeLinejoin="round" />
          <path d={losango} fill="none" stroke="#E9FFF0" strokeWidth={TRACO_LOSANGO * R * 0.3} strokeOpacity={0.55 + 0.45 * brilho} strokeDasharray={`${dl} ${dl}`} strokeDashoffset={dl * (1 - pl)} />
        </>
      ) : null}
      {pm > 0 && tem('m') ? (
        <>
          <path d={m} fill="none" stroke={cor} strokeWidth={TRACO_M * R} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${dm} ${dm}`} strokeDashoffset={dm * (1 - pm)} />
          <path d={m} fill="none" stroke="#F4FFF7" strokeWidth={TRACO_M * R * 0.32} strokeLinecap="round" strokeLinejoin="round" strokeOpacity={0.7 + 0.3 * brilho} strokeDasharray={`${dm} ${dm}`} strokeDashoffset={dm * (1 - pm)} />
        </>
      ) : null}
      {k > 0 && tem('key') ? (
        <polygon
          points={`${kx},${ky - kr * (0.4 + 0.6 * k) * 1.25} ${kx + kr * (0.4 + 0.6 * k)},${ky} ${kx},${ky + kr * (0.4 + 0.6 * k) * 1.25} ${kx - kr * (0.4 + 0.6 * k)},${ky}`}
          fill="#F4FFF7"
          stroke={cor}
          strokeWidth={R * 0.03}
          opacity={k}
        />
      ) : null}
    </svg>
  );
};

/** Pontos ao longo dos traços do símbolo (contorno + M + keyframe), um a cada `passo` px. */
export const pontosDoSimbolo = (cx: number, cy: number, R: number, passo = 5): XY[] => {
  const out: XY[] = [];
  const seg = (a: XY, b: XY) => {
    const ax = cx + a[0] * R;
    const ay = cy + a[1] * R;
    const bx = cx + b[0] * R;
    const by = cy + b[1] * R;
    const n = Math.max(1, Math.round(Math.hypot(bx - ax, by - ay) / passo));
    for (let i = 0; i < n; i++) out.push([ax + ((bx - ax) * i) / n, ay + ((by - ay) * i) / n]);
  };
  // losango (com os cantos cortados, sem a curva: a diferença some no brilho)
  const v: XY[] = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ];
  const d = RAIO_CANTO;
  for (let i = 0; i < 4; i++) {
    const a = v[i];
    const b = v[(i + 1) % 4];
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const ux = (b[0] - a[0]) / l;
    const uy = (b[1] - a[1]) / l;
    seg([a[0] + ux * d, a[1] + uy * d], [b[0] - ux * d, b[1] - uy * d]);
    const c = v[(i + 1) % 4];
    const e = v[(i + 2) % 4];
    const l2 = Math.hypot(e[0] - c[0], e[1] - c[1]);
    seg([b[0] - ux * d, b[1] - uy * d], [c[0] + ((e[0] - c[0]) / l2) * d, c[1] + ((e[1] - c[1]) / l2) * d]);
  }
  for (let i = 1; i < M_PONTOS.length; i++) seg(M_PONTOS[i - 1], M_PONTOS[i]);
  // o keyframe: um punhado de pontos no miolo
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    out.push([cx + (KEY_SIMBOLO[0] + Math.cos(a) * 0.05) * R, cy + (KEY_SIMBOLO[1] + Math.sin(a) * 0.06) * R]);
  }
  return out;
};

/** Onde o símbolo mora na cena 17 (a transição 16→17 monta os pontos aqui; a 17→18 dispersa daqui). */
export const SIMBOLO17 = { cx: 960, cy: 585, R: 215 } as const;
