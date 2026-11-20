/* Molas e beziers usadas pelas transições de varredura (flood, faixas, pontoAbre, retângulo,
   dispersão). Mesmo papel de MOLAM/CURVAM do tema, com os valores que essas transições usam. */
import { Easing, interpolate, spring } from 'remotion';

export const MOLA = {
  snap: { mass: 0.6, damping: 20, stiffness: 220 },
  assenta: { mass: 0.8, damping: 14, stiffness: 120 },
  pesada: { mass: 1.2, damping: 26, stiffness: 90 },
  elastica: { mass: 0.7, damping: 10, stiffness: 160 },
} as const;
export type NomeMola = keyof typeof MOLA;

export const CURVA = {
  corte: [0.7, 0, 0.2, 1],
  saida: [0.16, 1, 0.3, 1],
  entrada: [0.7, 0, 0.84, 0],
  suave: [0.45, 0, 0.55, 1],
} as const;
export type NomeCurva = keyof typeof CURVA;

const FPS = 30;

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const curvas: Record<NomeCurva, (t: number) => number> = {
  corte: Easing.bezier(...CURVA.corte),
  saida: Easing.bezier(...CURVA.saida),
  entrada: Easing.bezier(...CURVA.entrada),
  suave: Easing.bezier(...CURVA.suave),
};

/** Mola 0→1 começando em `inicio` (quadro local). `duracao` estica a mola para assentar em N quadros. */
export const mola = (frame: number, nome: NomeMola, inicio = 0, duracao?: number) =>
  spring({ frame: frame - inicio, fps: FPS, config: MOLA[nome], durationInFrames: duracao });

/** Interpola entre `de` e `para` na janela [a, b] com uma curva nomeada, sem extrapolar. */
export const tween = (frame: number, a: number, b: number, de = 0, para = 1, curva: NomeCurva | 'linear' = 'saida') =>
  interpolate(frame, [a, b], [de, para], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: curva === 'linear' ? undefined : curvas[curva],
  });
