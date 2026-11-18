/* layout.ts: posições que uma cena e a transição dela precisam combinar (as duas leem
   daqui). Valores que dependem de medir a fonte são funções: chame dentro do render. */
import { baseDaLinha, larguraTexto, metricas } from './medir';
import { TIPOM, type EstiloM } from './tema';

type XY = [number, number];

/* ---------- cena 1: faísca escreve, mira varre, MOTION incandescente ---------- */
const c01Frase: EstiloM = { ...TIPOM.fina, tamanho: 140 };
const c01Motion: EstiloM = { ...TIPOM.gigante, tamanho: 350, tracking: -0.035, entrelinha: 0.9 };
const c01Nivel: EstiloM = { ...TIPOM.gigante, tamanho: 150, tracking: -0.01, entrelinha: 1 };
const c01MotionY = 300;
export const C01 = {
  /** "E se eu te dissesse": fina, centrada */
  frase: { estilo: c01Frase, x: 960, y: 420 },
  /** "que dá pra criar um": rótulo pequeno em cima de MOTION, alinhado à esquerda dele */
  rotulo: { estilo: { ...TIPOM.apoio, tamanho: 60, peso: 700 } as EstiloM, y: 228 },
  motion: { estilo: c01Motion, x: 960, y: c01MotionY },
  nivel: { estilo: c01Nivel, x: 960, y: c01MotionY + c01Motion.tamanho * c01Motion.entrelinha + 34 },
  /** y da linha de luz sob MOTION (o chicote de saída usa o mesmo y) */
  yLuz: () => baseDaLinha(c01MotionY, c01Motion) + 34,
};

/* ---------- cena 2: timeline + "After Effects?" ---------- */
export const C02 = {
  painel: { x: 250, y: 250, w: 1420, h: 470 },
  impacto: [960, 485] as XY,
  apoio: { x: 150, y: 120 },
  gigante: { x: 140, y: 690, estilo: { ...TIPOM.gigante, tamanho: 236 } as EstiloM },
};

/* ---------- cena 3: "plugin" cai ---------- */
export const C03 = {
  apoio: { x: 960, y: 210 },
  palavra: 'plugin',
  estilo: { ...TIPOM.gigante, tamanho: 330, tracking: -0.045 } as EstiloM,
  /** topo da caixa da palavra quando assentada */
  yTopo: 430,
  cx: 960,
};

/* ---------- cena 4: CLAUDE / OPUS 5.5 ---------- */
const c04Estilo: EstiloM = { ...TIPOM.gigante, tamanho: 290, tracking: -0.035, entrelinha: 0.9 };
export const C04 = {
  estilo: c04Estilo,
  apoio: { x: 160, y: 138 },
  x: 150,
  /** topo da linha "CLAUDE"; "OPUS 5.5" vem uma entrelinha abaixo */
  y: 215,
  /** miolo do "O" de OPUS na tela (a câmera da cena 4 empurra ancorada nele: ele não se mexe) */
  centroO: (): XY => {
    const yLinha2 = 215 + c04Estilo.tamanho * c04Estilo.entrelinha;
    const base = baseDaLinha(yLinha2, c04Estilo);
    const m = metricas(c04Estilo);
    const wO = larguraTexto('O', c04Estilo) - c04Estilo.tracking * c04Estilo.tamanho;
    return [150 + wO / 2, base - m.cap / 2];
  },
  /** raios do miolo do "O" (Inter 900) na escala 1 */
  raioO: (): XY => [c04Estilo.tamanho * 0.15, c04Estilo.tamanho * 0.215],
  /** zoom da câmera no início da saída (a transição multiplica os raios por ele) */
  zoomSaida: 1.1,
};

/* ---------- cena 5: barra de prompt ---------- */
export const C05 = {
  barra: { x: 330, y: 560, w: 1260, h: 136, r: 68 },
  apoio: { x: 960, y: 250 },
  prompt: { ...TIPOM.prompt, tamanho: 50 } as EstiloM,
};
